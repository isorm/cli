#! /usr/bin/env node

import chalk from "chalk";
import ora, { Ora } from "ora";

class Spinner {
  start(title: string): Ora {
    const spinner = ora(`${chalk.magentaBright(title)}`).start();
    return spinner;
  }
}

export default Spinner;
