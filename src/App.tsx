import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { handleComponent, RouteType } from "./utils/routes.utils";
import { ThemeProvider } from "./context/theme";

interface Props {
  routes?: RouteType[];
}

const App: React.FC<Props> = ({ routes = [] }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThemeProvider>
        <Routes>
          {routes.map((route, index) => handleComponent(index, route))}
          <Route path="*" element={<div>404</div>} />
        </Routes>
      </ThemeProvider>
    </Suspense>
  );
};

export default App;
