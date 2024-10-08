import { Writable } from "node:stream";
import { readFile } from "node:fs/promises";
import path from "node:path";

const isProd = process.env.NODE_ENV === "production";

import { renderToPipeableStream } from "react-dom/server";

export async function stream(jsx: React.ReactElement): Promise<string> {
  const bootstrapScript = await getBootstrapScript();

  return new Promise((resolve, reject) => {
    const writableStream = getWritableStream(resolve, reject);

    if (bootstrapScript === null) {
      return reject("Cannot find bootstrapScripts path");
    }
    const { pipe } = renderToPipeableStream(jsx, {
      bootstrapScripts: [
        bootstrapScript["main.js"],
        bootstrapScript["runtime~main.js"],
      ],
      onAllReady() {
        pipe(writableStream);
      },
    });
  });
}

export function getWritableStream(
  resolve: (value: string | PromiseLike<string>) => void,
  reject: (reason?: any) => void
) {
  let body = "";

  const writableStream = new Writable({
    write: (chunk, encoding, callback) => {
      body += chunk;
      setImmediate(callback);
    },
  });

  writableStream.on("finish", () => {
    return resolve(body);
  });

  writableStream.on("error", (error) => {
    return reject(error);
  });

  return writableStream;
}

let bootstrapScript: Record<string, string> | null = null;
export async function getBootstrapScript() {
  bootstrapScript =
    isProd && bootstrapScript
      ? bootstrapScript
      : JSON.parse(
          await readFile(
            path.resolve(process.cwd(), "build/public/webpack-stats.json"),
            "utf-8"
          )
        );
  return bootstrapScript;
}
