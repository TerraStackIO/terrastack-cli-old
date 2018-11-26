/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const fs = require("fs-extra");
const componentCode = require("./component");
const packageDefaults = require("./package");

const initComponent = (name, version, description) => {
  console.log(`Starting to wrap component "${name}" in version ${version}`);

  const files = componentCode(name, version, description);

  fs.ensureDirSync(".terrastack/component");
  fs.ensureDirSync(".terrastack/@types");
  fs.writeFileSync(".terrastack/component/index.js", files.compononentJs);
  fs.writeFileSync(".terrastack/@types/index.d.ts", files.compononentTypes);

  const packageJSON = Object.assign(
    {},
    { name, version, description },
    packageDefaults
  );

  fs.writeFileSync("package.json", JSON.stringify(packageJSON, null, 2));
  console.log("Successfully wrapped component");
};

module.exports = initComponent;
