/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const { Command, flags } = require("@oclif/command");

const printInfo = stack => {
  const components = stack
    .list()
    .map(component => `* ${component.name}`)
    .join("\n");
  const template = `
Stack: ${stack.name}

${components}
    `.trim();

  console.log(template);
};

class InfoCommand extends Command {
  async run() {
    const stack = require(process.cwd() + "/stack.js");
    const { flags } = this.parse(InfoCommand);
    printInfo(stack);
  }
}

InfoCommand.description = `Get info about the stack`;

InfoCommand.flags = {};

module.exports = InfoCommand;
