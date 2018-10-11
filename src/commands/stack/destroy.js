/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const { Command, flags } = require("@oclif/command");

class DestroyCommand extends Command {
  async run() {
    const { flags } = this.parse(DestroyCommand);
    const stack = require(process.cwd() + "/stack.js");

    (async () => {
      await stack.destroy();
    })();
  }
}

DestroyCommand.description = `Destroy the stack`;

DestroyCommand.flags = {};

module.exports = DestroyCommand;
