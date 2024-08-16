import React, { Suspense } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { handleComponent, RouteType } from "./utils/routes.utils";
import { ThemeProvider } from "./context/theme";
import { TranslationProvider } from "./context/i18n";

interface Props {
  routes?: RouteType[];
}

const App: React.FC<Props> = ({ routes = [] }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThemeProvider>
        <TranslationProvider>
          <Link to="/">APP</Link>
          <Link to="/home">HOME</Link>
          <Link to="/home/1">1</Link>
          <Link to="/home/2">2</Link>
          <Routes>
            {routes.map((route, index) => handleComponent(index, route))}
            <Route path="*" element={<div>404</div>} />
          </Routes>
        </TranslationProvider>
      </ThemeProvider>
    </Suspense>
  );
};

export default App;
