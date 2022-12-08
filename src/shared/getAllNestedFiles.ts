import { join } from "path";
import fs from "fs";
import { cwd } from "process";

const getAllNestedFiles = (rootDir: string, filePattern: string) => {
  const focusDir = fs.readdirSync(join(cwd(), rootDir));

  const specFiles: any[] = [];

  const searchNestedDirs = (dirs: any) => {
    for (const i in dirs) {
      const dir = dirs[i];

      if (dir.includes(filePattern)) {
        specFiles.push(join(cwd(), rootDir, dir));
        continue;
      } else if (dir.includes(".")) continue;

      const lastIndex = dirs.findIndex((item: any) => item?.includes(dir));

      let nestedDirs = fs.readdirSync(join(cwd(), rootDir, dir));
      nestedDirs = nestedDirs.map((item: any) => {
        item = `${dirs[lastIndex]}/${item}`;
        return item;
      });

      searchNestedDirs(nestedDirs);
    }
  };

  searchNestedDirs(focusDir);

  return specFiles;
};

export default getAllNestedFiles;
