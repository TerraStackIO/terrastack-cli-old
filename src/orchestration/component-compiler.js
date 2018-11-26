/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const fs = require("fs-extra");
const recursiveCopy = require("recursive-copy");
const path = require("path");
const eventbus = require("./eventbus");
const format = require("es6-template-strings");

const writeConfig = (stack, component) => {
  fs.writeFileSync(
    path.join(component.workingDir, "terrastack.tf"),
    JSON.stringify(compileConfig(stack, component), null, 2)
  );
};

const compileConfig = (stack, component) => {
  const data = Object.keys(stack.config).map(key => {
    const remoteStateKey =
      component.options.remoteStateKey ||
      "terrastack/${stackName}/${componentName}";
    const context = {
      stackName: stack.name,
      componentName: component.name
    };
    return stack.config[key].compile(format(remoteStateKey, context));
  });
  return Object.assign({}, ...data);
};

const writeInput = (stack, component) => {
  fs.writeFileSync(
    path.join(component.workingDir, "terrastack.auto.tfvars"),
    JSON.stringify(
      Object.assign(
        {},
        stack.globals,
        component.inputCallback(component.bindings, stack)
      ),
      null,
      2
    )
  );
};

const copySource = async component => {
  await recursiveCopy(component.sourceDir, component.workingDir, {
    filter: ["**/*", "!.terrastack"],
    overwrite: true,
    expand: true
  });
};

const compile = async (stack, component) => {
  fs.emptyDirSync(component.workingDir);
  writeConfig(stack, component);
  writeInput(stack, component);
  await copySource(component);
  eventbus.emit("component:compile", component);
};

const asyncCompile = (stack, component) => {
  return () =>
    new Promise((resolve, reject) => resolve(compile(stack, component)));
};

module.exports = { compile, asyncCompile };
