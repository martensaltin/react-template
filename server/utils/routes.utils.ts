import React, { ComponentType, ReactNode } from "react";

import { readdirSync, statSync } from "fs";

import path from "path";

interface RouteType {
    path: string;
    component: string | null;
    layout: string | null;
    children: RouteType[];
}

const LAYOUT = "layout.tsx";
const PAGE = "page.tsx";

export async function getAllRoutes(
    directory = "src/pages",
    basePath = "src/pages",
    isRoot = true
): Promise<RouteType[]> {
    let routes: RouteType[] = [];
    const fullBasePath = path.resolve(directory);

    try {
        const items = readdirSync(fullBasePath);

        for (const item of items) {
            const itemPath = path.join(directory, item);
            const fullItemPath = path.resolve(itemPath);

            if (statSync(fullItemPath).isDirectory()) {
                const files = readdirSync(fullItemPath);
                const layoutFile = files.find((file) => file === LAYOUT);
                const pageFile = files.find((file) => file === PAGE);

                let routePath = path
                    .relative(basePath, fullItemPath)
                    .replace(/\\/g, "/");

                routePath = routePath ? `/${routePath}` : "/";

                if (pageFile) {
                    const route: RouteType = {
                        path: routePath,
                        component: path.join(itemPath, pageFile),
                        layout: layoutFile
                            ? path.join(itemPath, layoutFile)
                            : null,
                        children: await getAllRoutes(itemPath, basePath, false),
                    };
                    routes.push(route);
                } else {
                    const nestedRoutes: RouteType[] = await getAllRoutes(
                        itemPath,
                        basePath,
                        false
                    );
                    if (nestedRoutes.length > 0) {
                        routes.push(...nestedRoutes);
                    }
                }
            }
        }

        // Handle files in the base directory (e.g., root route)
        if (isRoot) {
            const baseFiles = readdirSync(fullBasePath);
            const baseLayout = baseFiles.find((file) => file === LAYOUT);
            const basePage = baseFiles.find((file) => file === PAGE);

            if (basePage) {
                const rootRoute = {
                    path: "/",
                    component: path.join(directory, basePage),
                    layout: baseLayout
                        ? path.join(directory, baseLayout)
                        : null,
                    children: routes,
                };
                routes = [rootRoute];
            }
        }
    } catch (error) {
        console.error("Error reading directories:", error);
    }

    return routes;
}
