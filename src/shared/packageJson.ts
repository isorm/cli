import { join } from "path";
import { cwd } from "process";
import fs from "fs";
import os from "os";

const packageJson = () => {
  const packageJsonPath = join(cwd(), "package.json");
  const data = fs.readFileSync(packageJsonPath, "utf8");

  const packageJson = JSON.parse(data);

  packageJson.main = "src/app.ts";
  packageJson.keywords = ["Isorm-project"];
  packageJson.author = os.hostname();
  packageJson.scripts = {
    dev: "isorm dev",
    build: "isorm build",
  };

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 1));
};

export default packageJson;
