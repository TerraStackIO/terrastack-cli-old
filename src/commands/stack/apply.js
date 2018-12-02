/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const { Command, flags } = require("@oclif/command");
const { Terrastack } = require("../../orchestration/terrastack");
const applyLogging = require("../../logging.js");
const { applyVisualization } = require("../../ui");

class ApplyCommand extends Command {
  async run() {
    const { flags } = this.parse(ApplyCommand);
    const stack = require(process.cwd() + "/stack.js");
    const terrastack = new Terrastack(stack);
    applyLogging(terrastack);
    applyVisualization(terrastack);
    (async () => {
      await terrastack.apply();
    })();
  }
}

ApplyCommand.description = `Apply the stack`;

ApplyCommand.flags = {};

module.exports = ApplyCommand;
