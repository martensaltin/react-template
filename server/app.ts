import express from "express";
import path from "node:path";
import renderReact from "./ssr/renderReact";
import { devMiddleware, hotMiddleware } from "../webpack.config";

const app = express();
const cwd = process.cwd();

if (process.env.NODE_ENV === "development") {
    app.use(devMiddleware);
    app.use(hotMiddleware);
}

app.use(express.static(path.resolve(cwd, "build/public"), { index: false }));

app.use(express.json());
app.use(express.urlencoded());

app.get("/*", renderReact);

export default app;
