import React from "react";
import { BrowserRouter } from "react-router-dom";
import { hydrateRoot } from "react-dom/client";
import App from "./App";

import pako from "pako";

const root = document.getElementById("root");

if (root) {
  const initialProps = (window as any).INITIAL_PROPS;

  const decompressed = pako.inflate(initialProps);
  const outputString = new TextDecoder().decode(decompressed);
  const output = JSON.parse(outputString);

  console.log("Output", output);

  hydrateRoot(
    root,
    <BrowserRouter>
      <App routes={output} />
    </BrowserRouter>
  );
}
