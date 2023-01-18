#! /usr/bin/env node

import os from "os";
import { Argv } from "yargs";
import chalk from "chalk";
import shell from "shelljs";
import { join } from "path";
import fs from "fs-extra";
import Spinner from "../shared/Spinner";
import execSync from "../shared/execSync";
import fsExtra from "fs-extra";
import { Ora } from "ora";

const appCreate = (cli: Argv) => {
  cli.command(
    "create <app_name>",
    "Create Framework Template",
    (yargs) => {},
    async (args) => {
      const withReact = args?.react || "";

      const appName = ((args?.app_name as string) ?? "").trim();

      let spin = {} as Ora;

      try {
        spin.clear();
      } catch (e) {}

      setTimeout(() => {
        spin = new Spinner().start("Waiting for Initializing source...");
      }, 100);

      if (appName !== ".") {
        fs.mkdirSync(appName);
        shell.cd(appName);
      }

      await shell.exec(
        "git clone https://github.com/isorm/templates.git Initializing",
        {
          async: true,
          silent: true,
        },
        async (code, stdout, stderr) => {
          shell.cd("Initializing");

          const initDir = shell.pwd().stdout;

          fsExtra.copySync(
            join(initDir, withReact ? "react-isorm" : "isorm"),
            join(initDir, "../"),
          );

          shell.cd("..");

          const rootDir = shell.pwd().stdout;

          fsExtra.removeSync(join(initDir));

          const tsConfigData = fs.readFileSync(
            join(rootDir, "tsconfig.json"),
            "utf8",
          );

          const tsConfig = JSON.parse(tsConfigData);

          tsConfig.include = tsConfig.include.filter(
            (item: string) => item !== "../index.d.ts",
          );

          fs.writeFileSync(
            join(rootDir, "tsconfig.json"),
            JSON.stringify(tsConfig, null, 2),
          );

          const packageJsonData = fs.readFileSync(
            join(rootDir, "package.json"),
            "utf8",
          );

          const packageJson = JSON.parse(packageJsonData);

          packageJson.name =
            appName !== "." ? appName : rootDir.split("\\").slice(-2)[0];

          packageJson.author = os.hostname();

          fs.writeFileSync(
            join(rootDir, "package.json"),
            JSON.stringify(packageJson, null, 2),
          );

          spin.stop();

          spin.start("Installing Dependencies...");

          await execSync("npm i", {
            silent: true,
          });

          spin.stop();

          console.log(chalk.blueBright("Project was created successfully :)"));
        },
      );
    },
  );
};

export default appCreate;
