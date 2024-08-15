import fs from "node:fs";
import path from "node:path";

export function findAllDirectoriesSync(baseDir: string): {
  [key: string]: string[];
} {
  let dirs: { [key: string]: string[] } = {};

  const files = fs.readdirSync(baseDir, { withFileTypes: true });

  for (const file of files) {
    if (file.isDirectory()) {
      const dirPath = path.join(baseDir, file.name);
      dirs[`@${file.name}/*`] = [dirPath];
    }
  }
  return dirs;
}
