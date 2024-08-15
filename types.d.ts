type Req = import("express").Request;
type Res = import("express").Response;
type Next = import("express").NextFunction;
type mode = "development" | "production";

declare module "@gatsbyjs/webpack-hot-middleware";
