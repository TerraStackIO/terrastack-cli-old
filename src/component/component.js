/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const Mustache = require("mustache");
const template = require("fs-extra")
  .readFileSync(require.resolve("./component.mustache"))
  .toString();
const path = require("path");
const hcl2json = path.resolve(
  path.dirname(require.resolve("hcl2json-foo")),
  "node_modules",
  ".bin",
  "hcl2json"
);

// Disable HTML escaping
Mustache.escape = e => e;

const typeMap = function(type, defaultValue) {
  const mapping = {
    list: "Array",
    object: "Object.<string, (string|number)>",
    map: "Object.<string, (string|number)>"
  };
  if (type == "String" || type === undefined) {
    if (Array.isArray(defaultValue)) return "Array";
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

const parseAndRender = () => {
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
    variables: [].concat(...variables),
    description: function() {
      const text = [
        descriptionText(this.value.description),
        defaultText(this.value.default)
      ]
        .filter(Boolean)
        .join(" ");

      if (text.length === 0) return "";
      return ` - ${text}`;
    },
    type: function() {
      return (
        typeMap(this.value.type, defaultValue(this.value.default)) || "String"
      );
    },
    property: function() {
      return this.value.hasOwnProperty("default")
        ? `[${this.key}=${JSON.stringify(defaultValue(this.value.default))}]`
        : this.key;
    }
  };

  return Mustache.render(template, view);
};

module.exports = parseAndRender;
