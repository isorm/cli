import { join } from "path";
import { cwd } from "process";
import fs from "fs";
import os from "os";

const packageJson = () => {
  const packageJsonPath = join(cwd(), "package.json");
  const data = fs.readFileSync(packageJsonPath, "utf8");

  const packageJson = JSON.parse(data);

  packageJson.main = "src/app.ts";
  packageJson.keywords = ["isorm"];
  packageJson.author = os.hostname();
  packageJson.scripts = {
    dev: "ts-node-dev --deps --clear --quiet src/app.ts",
    build: "tsc",
  };

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 1));
};

export default packageJson;
