import React from "react";
import { StaticRouter } from "react-router-dom/server";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";
import { stream } from "../utils/stream.utils";

import { getAllRoutes } from "../utils/routes.utils";
import config from "../../config.json";

async function renderReact(
    req: Req,
    res: Res,
    next: Next
): Promise<Res | void> {
    try {
        const { default: App } = await import("../../src/App");

        const routes = await getAllRoutes("src/pages");

        const styleSheet = new ServerStyleSheet();
        global.window = {} as Window & typeof globalThis;

        const jsx = (
            <StyleSheetManager sheet={styleSheet.instance}>
                <StaticRouter location={req.originalUrl}>
                    <App routes={routes} />
                </StaticRouter>
            </StyleSheetManager>
        );

        const appHtml = await stream(jsx);
        const responseHtml = `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${config.name}</title>
        <script>
            window.INITIAL_PROPS = ${JSON.stringify(routes)};
        </script>
        ${styleSheet.getStyleTags()}
      </head>
      <body>
        <div id="root">${appHtml}</div>
      </body>
    </html>`;

        styleSheet.seal();
        return res.send(responseHtml);
    } catch (err) {
        return next(err);
    }
}

export default renderReact;
