import React, { ComponentType, lazy, ReactNode, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { handleComponent, RouteType } from "./utils/routes.utils";

interface Props {
    routes?: RouteType[];
}

const App: React.FC<Props> = ({ routes = [] }) => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                {routes.map((route, index) => handleComponent(index, route))}
                <Route path="*" element={<div>404</div>} />
            </Routes>
        </Suspense>
    );
};

export default App;
