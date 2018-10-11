/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const { Command, flags } = require("@oclif/command");
const init = require("../component/index");

class ComponentCommand extends Command {
  async run() {
    const { flags } = this.parse(ComponentCommand);
    init(flags.name, flags.tag, flags.description);
  }
}

ComponentCommand.description = `Init a new component from a Terraform module`;

ComponentCommand.flags = {
  name: flags.string({
    char: "n",
    description: "name of component",
    required: true
  }),
  tag: flags.string({
    char: "t",
    description: "Which tag (version) to set for package",
    required: true
  }),
  description: flags.string({
    char: "d",
    description: "Brief description for package",
    required: false
  })
};

module.exports = ComponentCommand;
