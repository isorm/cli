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
import getFileSize from "../shared/getFileSize";

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

      await execSync("npx isorm build", { silent: true });

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

      const event =
        (showRunningMsg?: boolean, buildForce?: boolean) =>
        async (path: string, stats: string) => {
          await new Promise((res, rej) => {
            setTimeout(async () => {
              clearConsole();
              console.log(chalk.gray("+ Updating..."));
              if (buildUpdate) await execSync("tsc", { silent: true });

              if (configs?.type === "react") {
                const format = configs?.react?.format || "tsx";

                try {
                  await execSync(
                    `npx esbuild ${root}/pages/index.${format} --bundle --minify --keep-names --outfile=${root}/${tsConfig.compilerOptions.outDir}/bundle.js --loader:.js=${format}`,
                    { silent: true },
                  );
                } catch (e) {}
              }

              if (showRunningMsg) {
                clearConsole();
                console.log(chalk.greenBright("+ App Running..."));
              }

              return res(true);
            }, 100);
          });
        };

      watcher.on("add", event(true));
      watcher.on("addDir", event(true));
      watcher.on("change", event());
      watcher.on("error", event());
      // watcher.on("raw", event());
      watcher.on("unlink", event(true));
      watcher.on("unlinkDir", event(true));

      watcher.on("ready", async (path: string, stats: string) => {
        await event(true)(path, stats);
      });

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
      const hideChanges = args?.hideChanges || args?.h || "";

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
      if (!hideChanges) {
        console.log(chalk.greenBright(`+ Build Successfully`));
        console.log(
          `\n${getFileSize()
            .map(
              (item) =>
                `${chalk.dim(chalk.cyan(item.file))} ${chalk.bold(
                  chalk.gray(item.size),
                )}`,
            )
            .join("\n")}`,
        );
      } else console.log(chalk.greenBright("+ Build Successfully"));
    },
  );
};

export default appScripts;
