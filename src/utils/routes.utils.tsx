import React, { lazy, ReactNode } from "react";

import { Route } from "react-router-dom";

export interface RouteType {
    path: string;
    component: string | null; // Ensure this is the relative path from '@pages/'
    layout: string | null;
    children: RouteType[];
}

export const handleComponent = (index: number, route: RouteType) => {
    if (!route.component) {
        console.error("Component path is undefined for route:", route.path);
        return null;
    }
    const filePath = route.component
        .replace("src/pages/", "")
        .replace(".tsx", "");

    const path = route.path.replace("../src/pages/", "");
    console.log("Path", path, filePath);

    try {
        const Page = lazy(() =>
            import(`../../src/pages/${filePath}`).catch((error) => {
                console.error(
                    `Failed to load the page component @pages/${route.component}: `,
                    error
                );
                return {
                    default: () => <div>Component failed to load</div>,
                };
            })
        );

        return (
            <React.Fragment key={index}>
                <Route key={index} path={path} element={<Page />} />
                {route.children.map(
                    (child, i): ReactNode => handleComponent(i + index, child)
                )}
            </React.Fragment>
        );
    } catch (error) {
        console.error("Error while dynamic importing", route.component, error);
        return null;
    }
};
