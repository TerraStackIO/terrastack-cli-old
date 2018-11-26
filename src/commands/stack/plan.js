/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const { Command, flags } = require("@oclif/command");
const { Terrastack } = require("../../orchestration/terrastack");
const applyLogging = require("../../logging.js");
const applyVisualization = require("../../visualization.js");

class PlanCommand extends Command {
  async run() {
    const { flags } = this.parse(PlanCommand);
    const stack = require(process.cwd() + "/stack.js");
    const terrastack = new Terrastack(stack);
    applyLogging(terrastack);
    applyVisualization(terrastack);
    (async () => {
      await terrastack.plan();
    })();
  }
}

PlanCommand.description = `Plan the stack`;

PlanCommand.flags = {};

module.exports = PlanCommand;
