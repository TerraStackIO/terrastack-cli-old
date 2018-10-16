/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const { Command, flags } = require("@oclif/command");
const { Terrastack } = require("terrastack");
const log4js = require("log4js");
const chalk = require("chalk");

log4js.configure({
  appenders: {
    multi: {
      type: "multiFile",
      base: "logs/",
      property: "categoryName",
      extension: ".log"
    }
  },
  categories: {
    default: { appenders: ["multi"], level: "debug" }
  }
});

let loggers = {};

class PlanCommand extends Command {
  async run() {
    const { flags } = this.parse(PlanCommand);
    const stack = require(process.cwd() + "/stack.js");
    const terrastack = new Terrastack(stack);
    let buffer = [];

    terrastack.events.on("component:before", function(component) {
      loggers[component.name] = log4js.getLogger(component.name);
    });

    terrastack.events.on("output:*", function(component, output) {
      loggers[component.name].info(output.trim());
      buffer.push(output);
    });

    terrastack.events.on("component:**", function(component) {
      console.log(`${component.name}: ${this.event}`);
    });

    terrastack.events.on("error", function(component) {
      console.log(chalk.red.bold.underline(`Error: ${component.name}`));
      console.log(`Recent output: ${buffer.join("")}`);
    });

    (async () => {
      await terrastack.plan();
    })();
  }
}

PlanCommand.description = `Plan the stack`;

PlanCommand.flags = {};

module.exports = PlanCommand;
