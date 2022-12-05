#! /usr/bin/env node

import cli from "yargs";
import appCreate from "./commands/app.create";
import appScripts from "./commands/app.scripts";

cli.scriptName("isorm");

appCreate(cli);
appScripts(cli);

cli.argv;
export default cli;
