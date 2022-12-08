#! /usr/bin/env node

import { Argv } from "yargs";
import chalk from "chalk";
import { pwd } from "shelljs";
import { join } from "path";
import fs from "fs-extra";
import execSync from "../shared/execSync";
import getConfigs from "../shared/getConfigs";
import getTsConfigs from "../shared/getTsConfigs";
import chokidar from "chokidar";
import clearConsole from "../shared/clearConsole";

const appScripts = (cli: Argv) => {
  cli.command(
    "dev",
    "Run isorm project in development mode",
    () => {},
    async (args) => {
      const buildUpdate = args?.b || args?.build;

      const rootPath = pwd().stdout;
      const tsConfig = await getTsConfigs(rootPath);
      const configs = await getConfigs(rootPath);
      const root = rootPath.replace(/\\/g, "/");

      const pkg = JSON.parse(
        fs.readFileSync(join(rootPath, "package.json"), "utf8"),
      );

      const watcher = chokidar.watch(
        [
          "src",
          "pages",
          "public",
          "static",
          "styles",
          "style",
          "package.json",
          "tsconfig.json",
        ],
        {
          ignored: [tsConfig.compilerOptions?.outDir],
          cwd: ".",
          persistent: true,
        },
      );

      const event = async () => {
        clearConsole();
        console.log(chalk.blueBright("+ Updating..."));

        if (buildUpdate) await execSync("tsc", { silent: true });

        if (configs?.type === "react") {
          const format = configs?.react?.format || "tsx";

          try {
            await execSync(
              `npx esbuild ${root}/pages/index.${format} --bundle --minify --outfile=${root}/${tsConfig.compilerOptions.outDir}/bundle.js --loader:.js=${format}`,
              { silent: true },
            );
          } catch (e) {}
        }

        clearConsole();
        console.log(chalk.greenBright("+ App Running"));
      };

      await event();

      watcher.on("change", event);

      await execSync(
        `npx ts-node-dev --clear --quiet ${join(rootPath, pkg.main).replace(
          /\\/g,
          "/",
        )} -w`,
      );
    },
  );

  cli.command(
    "build",
    "Build isorm project",
    () => {},
    async (args) => {
      const rootPath = pwd().stdout;
      const tsConfig = await getTsConfigs(rootPath);
      const configs = await getConfigs(rootPath);
      const root = rootPath.replace(/\\/g, "/");

      clearConsole();
      console.log(chalk.gray("+ Building..."));

      await execSync("tsc", { silent: true });

      if (configs?.type === "react") {
        const format = configs?.react?.format || "tsx";

        try {
          await execSync(
            `npx esbuild ${root}/pages/index.${format} --bundle --minify --outfile=${root}/${tsConfig.compilerOptions.outDir}/bundle.js --loader:.js=${format}`,
            { silent: true },
          );
        } catch (e) {}
      }

      clearConsole();
      console.log(chalk.blueBright("+ Build Successfully"));
    },
  );
};

export default appScripts;
