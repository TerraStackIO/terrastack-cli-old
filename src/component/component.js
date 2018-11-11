/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const Mustache = require("mustache");
const componentJsTemplate = require("fs-extra")
  .readFileSync(require.resolve("./component.js.mustache"))
  .toString();
const componentTypesTemplate = require("fs-extra")
  .readFileSync(require.resolve("./component.d.ts.mustache"))
  .toString();
const path = require("path");
const hcl2json = path.resolve(
  path.dirname(require.resolve("hcl2json")),
  "node_modules",
  ".bin",
  "hcl2json"
);

classify = require("underscore.string/classify");

// Disable HTML escaping
Mustache.escape = e => e;

const typeMap = function(type, defaultValue) {
  const mapping = {
    list: "array",
    object: "BaseComponent.KeyValuePair",
    map: "BaseComponent.KeyValuePair"
  };
  if (type == "String" || type === undefined) {
    if (Array.isArray(defaultValue)) return "array";
    if (type === undefined && defaultValue === undefined) return "string";
    const assumedType = typeof defaultValue;
    return mapping[assumedType] || assumedType.toLocaleLowerCase();
  } else {
    return mapping[type];
  }
};

const defaultValue = value => {
  if (typeof value !== "object") return value;
  return Array.isArray(value) && value.length == 0 ? value : value[0];
};

const defaultText = value => {
  if (value === undefined) return "";
  return `Default: ${JSON.stringify(defaultValue(value))}`;
};

const descriptionText = value => {
  return value === undefined ? "" : `${value}.`;
};

const parseAndRender = (name, version, description) => {
  const moduleJSON = JSON.parse(
    require("child_process")
      .execSync(`cat *.tf | ${hcl2json}`)
      .toString("UTF-8")
  );

  const variables = moduleJSON.variable.map(element =>
    Object.keys(element).map(k => ({
      key: k,
      value: element[k][0]
    }))
  );

  const view = {
    moduleName: classify(name),
    moduleVersion: version,
    moduleDescription: description,
    variables: [].concat(...variables),
    description: function() {
      return descriptionText(this.value.description);
    },
    defaultText: function() {
      return defaultText(this.value.default);
    },
    type: function() {
      return (
        typeMap(this.value.type, defaultValue(this.value.default)) || "String"
      );
    },
    property: function() {
      return this.value.hasOwnProperty("default") ? `${this.key}?` : this.key;
    }
  };

  return {
    compononentJs: Mustache.render(componentJsTemplate, view),
    compononentTypes: Mustache.render(componentTypesTemplate, view)
  };
};

module.exports = parseAndRender;
