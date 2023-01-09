#! /usr/bin/env node

import { Argv } from "yargs";
import chalk from "chalk";
import shell from "shelljs";
import { cwd } from "process";
import { join } from "path";
import fs from "fs-extra";
import packageJson from "../shared/packageJson";
import Spinner from "../shared/Spinner";
import execSync from "../shared/execSync";

const appCreate = (cli: Argv) => {
  cli.command(
    "create <app_name>",
    "Create Framework Template",
    (yargs) => {},
    async (args) => {
      const withReact = args?.react || ""

      const appName = ((args?.app_name as string) ?? "").trim();

      //   if (appName === ".") {
      //   }

      const spin = new Spinner().start("Waiting for Initializing...");

      const tempDir = join(__dirname, "../../", "templates");

      shell.mkdir(appName);
      shell.cd(appName);
      shell.mkdir("src");

      await execSync("npm init -y", { silent: true, async: true });
      await execSync("npm i @isorm/core express", {
        silent: true,
        async: true,
      });
      await execSync(
        "npm i @types/node @types/express typescript ts-node-dev -D",
        {
          silent: true,
          async: true,
        },
      );
      await execSync("tsc --init", { silent: true, async: true });

      fs.writeFileSync(
        join(cwd(), "tsconfig.json"),
        fs.readFileSync(join(tempDir, "tsconfig.json"), "utf8"),
      );
      fs.copySync(join(tempDir, "src"), join(cwd(), "src"), {
        overwrite: true,
      });

      packageJson();

      spin.stop();
      shell.cd("..");
      console.log(chalk.blueBright("Project was created successfully :)"));
    },
  );


};

export default appCreate;
