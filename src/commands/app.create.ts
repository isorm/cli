import { Argv } from "yargs";
import chalk from "chalk";
import ora from "ora";
import shell from "shelljs";
import { cwd } from "process";
import { join } from "path";
import fs from "fs-extra";
import packageJson from "../templates/packageJson";

const appCreate = (cli: Argv) => {
  cli
    .command(
      "create <app_name>",
      "Create Framework Template",
      (yargs) => {
        yargs.positional("app_name", {
          type: "string",
        });
      },
      (args) => {
        const appName = ((args?.app_name as string) ?? "").trim();

        //   if (appName === ".") {
        //   }

        //   const spinner = ora("Downloading...").start();

        const tempDir = join(__dirname, "templates");

        shell.mkdir(appName);
        shell.cd(appName);
        shell.mkdir("src");
        shell.exec("npm init -y");
        shell.exec("npm i isorm-core express");
        shell.exec(
          "npm i @types/node @types/express typescript ts-node-dev -D",
        );
        shell.exec("tsc --init");

        fs.writeFileSync(
          join(cwd(), "tsconfig.json"),
          fs.readFileSync(join(tempDir, "tsconfig.json"), "utf8"),
        );
        fs.copySync(join(tempDir, "src"), join(cwd(), "src"), {
          overwrite: true,
        });

        packageJson();
      },
    )
    .help().argv;
};

export default appCreate;
