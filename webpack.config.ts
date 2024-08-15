// Node.js built-in modules
import path from "node:path";
import { readFileSync } from "node:fs";

// Third-party modules
import webpack from "webpack";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import { WebpackManifestPlugin } from "webpack-manifest-plugin";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "@gatsbyjs/webpack-hot-middleware";

// Type imports
import type { Request, Response, NextFunction } from "express";

import { findAllDirectoriesSync } from "./utils";
import config from "./config.json";

// Configuration for SWC Compiler
const swcConfigPath = path.resolve(process.cwd(), "swc.config.json");
const swcConfig = JSON.parse(readFileSync(swcConfigPath, "utf-8"));

const mode = process.env.NODE_ENV as mode;

// Environment and Mode Checks
const isDevMode = mode === "development";

// Enhanced configuration with conditional logic for development mode
const swcLoaderOptions = {
  ...swcConfig,
  jsc: {
    ...swcConfig.jsc,
    transform: {
      react: {
        runtime: "automatic",
        refresh: isDevMode, // Enable fast refresh in dev mode
      },
    },
    paths: findAllDirectoriesSync(path.resolve(process.cwd(), config.source)),
  },
  module: { type: "nodenext" },
};

const contenthash = isDevMode ? "" : ".[contenthash:8]";

const webpackConfig: webpack.Configuration = {
  mode,
  entry: {
    main: [config.entry],
  },
  stats: "errors-only",
  output: {
    clean: true,
    path: path.resolve(__dirname, "./build/public"),
    filename: `[name]${contenthash}.js`,
    chunkFilename: `[name].chunk${contenthash}.js`,
    publicPath: "/",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        include: [path.join(__dirname, config.source)],
        use: {
          loader: "swc-loader",
          options: swcLoaderOptions,
        },
      },
    ],
  },
  plugins: [
    new WebpackManifestPlugin({
      fileName: "webpack-stats.json",
      writeToFileEmit: true,
      isInitial: true,
    }),
  ],
  optimization: {
    moduleIds: "deterministic",
    runtimeChunk: true,
  },
};

if (isDevMode) {
  Object.assign(webpackConfig, {
    entry: {
      main: ["@gatsbyjs/webpack-hot-middleware/client", config.entry],
    },
    output: {
      ...webpackConfig.output,
      hotUpdateChunkFilename: "[id].hot-update.js",
      hotUpdateMainFilename: "[runtime].hot-update.json",
    },
    plugins: [
      ...(webpackConfig.plugins || []),
      new webpack.HotModuleReplacementPlugin(),
      new ReactRefreshWebpackPlugin({
        overlay: { sockIntegration: "whm" },
      }),
    ],
    cache: {
      type: "filesystem",
      cacheDirectory: path.resolve(__dirname, ".tmp"),
      name: "dev-react-cache",
    },
  });
}

const compiler = webpack(webpackConfig);

export const devMiddleware = isDevMode
  ? webpackDevMiddleware(compiler, {
      serverSideRender: true,
      publicPath: webpackConfig.output?.publicPath || "/",
    })
  : (req: Request, res: Response, next: NextFunction) => next();

export const hotMiddleware = isDevMode
  ? webpackHotMiddleware(compiler, {
      log: false,
      path: "/__webpack_hmr",
      heartbeat: 10 * 1000,
    })
  : (req: Request, res: Response, next: NextFunction) => next();

export default webpackConfig;
