#! /usr/bin/env node

import cli from "yargs";
import appCreate from "./commands/app.create";

cli.scriptName("isorm");

appCreate(cli);

cli.argv;
export default cli;
