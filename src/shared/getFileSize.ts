import getAllNestedFiles from "./getAllNestedFiles";
import fs from "fs";
import { cwd } from "process";
import { join } from "path";

const getFileSize = () => {
  const files = getAllNestedFiles("build", ".js");

  const newFiles = [];

  function sizeDetector(size: number) {
    const ONE_KB = 1024;
    const ONE_MB = ONE_KB * 1024;
    const ONE_GB = ONE_MB * 1024;

    if (size < ONE_KB) {
      return size.toFixed(0) + " B";
    } else if (size < ONE_MB) {
      return (size / ONE_KB).toFixed(2) + " KB";
    } else if (size < ONE_GB) {
      return (size / ONE_MB).toFixed(2) + " MB";
    } else {
      return (size / ONE_GB).toFixed(2) + " GB";
    }
  }

  for (let i in files) {
    const path = files[i];

    const stats = fs.statSync(path);

    newFiles.push({
      size: sizeDetector(stats.size),
      file: path
        .split(join(cwd(), "build"))
        .join("")
        .replace(/\\/g, "/")
        .split("/")
        .filter((i: any, _: number) => _ !== 0).join("/"),
    });
  }

  return newFiles;
};

export default getFileSize;
