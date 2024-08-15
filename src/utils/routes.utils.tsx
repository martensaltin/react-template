import React, { lazy, ReactNode } from "react";

import { Route } from "react-router-dom";

import config from "../../config.json";

export interface RouteType {
  path: string;
  component: string | null; // Ensure this is the relative path from '@pages/'
  layout: string | null;
  children: RouteType[];
}

const lazyLoad = (path: string | null) => {
  if (!path) {
    return null;
  }

  const filePath = path.replace("src/pages/", "").replace(".tsx", "");

  return lazy(() =>
    import(`../../src/pages/${filePath}`).catch((error) => {
      console.error(
        `Failed to load the page component @pages/${path}: `,
        error
      );
      return {
        default: () => <div>Component failed to load</div>,
      };
    })
  );
};

export const handleComponent = (
  index: number,
  route: RouteType,
  layouts: React.LazyExoticComponent<React.ComponentType<any>>[] = []
) => {
  route.path = route.path.replace("../src/pages/", "");

  try {
    const Page = lazyLoad(route.component);

    if (!Page) {
      return null;
    }

    const Layout = lazyLoad(route.layout);

    let element = <Page />;
    if (Layout) {
      layouts.push(Layout);
    }
    for (let i = layouts.length - 1; i >= 0; i--) {
      element = React.createElement(layouts[i], {}, element);
      console.log("Layouts", i);
    }

    console.log("Child count", route.children.length);

    return (
      <React.Fragment key={index}>
        <Route key={index} path={route.path} element={element} />
        {route.children.map(
          (child, i): ReactNode => handleComponent(i + index, child, layouts)
        )}
      </React.Fragment>
    );
  } catch (error) {
    console.error("Error while dynamic importing", route.component, error);
    return null;
  }
};
