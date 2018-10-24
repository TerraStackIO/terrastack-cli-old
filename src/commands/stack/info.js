/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const { Command, flags } = require("@oclif/command");
const { Terrastack } = require("terrastack");

const printInfo = terrastack => {
  console.log(`
Terrastack Stack: ${terrastack.stack.name}
------------`);
  terrastack.componentChunks.map((chunk, index) => {
    console.log(`
Chunk ${index + 1}:
${chunk.map(component => component.name).join("\n")}`);
  });
};

class InfoCommand extends Command {
  async run() {
    const { flags } = this.parse(InfoCommand);
    const stack = require(process.cwd() + "/stack.js");
    const terrastack = new Terrastack(stack);
    printInfo(terrastack);
  }
}

InfoCommand.description = `Get info about the stack`;

InfoCommand.flags = {};

module.exports = InfoCommand;
