#! /usr/bin/env node

import cli from "yargs";
import appCreate from "./commands/app.create";

cli.scriptName("isorm");

appCreate(cli);

export default cli;
