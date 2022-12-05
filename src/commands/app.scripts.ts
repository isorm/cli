#! /usr/bin/env node

import { Argv } from "yargs";
import chalk from "chalk";
import shell, { pwd } from "shelljs";
import { cwd } from "process";
import { join } from "path";
import fs from "fs-extra";
import packageJson from "../shared/packageJson";
import Spinner from "../shared/Spinner";
import execSync from "../shared/execSync";
import getConfigs from "../shared/getConfigs";
import getTsConfigs from "../shared/getTsConfigs";
import chokidar from "chokidar";

const appScripts = (cli: Argv) => {
  cli.command(
    "dev",
    "Run isorm project in development mode",
    () => {},
    async (args) => {
      const rootPath = pwd().stdout;
      const tsConfig = await getTsConfigs(rootPath);
      const configs = await getConfigs(rootPath);

      console.clear();

      const watcher = chokidar.watch(".", {
        // ignored: ["*.json", /(^|[\/\\])\../],
        ignored: [tsConfig?.outDir],
        cwd: rootPath,
      });

      watcher.on("change", async () => {
        await execSync("tsc", { silent: true });

        await execSync(
          `ts-node-dev --deps --clear --quiet src/app.${
            configs?.type === "react" ? "tsx" : "ts"
          }`,
          { silent: true },
        );

        console.log("App Running");
      });

      console.log("App Running");
    },
  );
};

export default appScripts;
