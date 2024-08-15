import React from "react";
import { BrowserRouter } from "react-router-dom";
import { hydrateRoot } from "react-dom/client";
import App from "./App";

const root = document.getElementById("root");

if (root) {
  const initialProps = (window as any).INITIAL_PROPS || [];

  hydrateRoot(
    root,
    <BrowserRouter>
      <App routes={initialProps} />
    </BrowserRouter>
  );
}
