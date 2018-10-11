/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const fs = require("fs-extra");
const os = require("os");
const path = require("path");
const { runTerrastack } = require("../runTerrastack");

describe("CLI Component Init", () => {
  const dir = path.resolve(__dirname, "..", "component-init");
  const workDir = path.resolve(os.tmpdir(), "component-init");

  beforeEach(() => {
    fs.removeSync(path.resolve(workDir, "*"));
    fs.copySync(dir, workDir);
  });

  it("generates a Terrastack index.js file", () => {
    const result = runTerrastack(workDir, [
      "component",
      "-t",
      "1.0.0",
      "-d",
      "description",
      "-n",
      "foo-module"
    ]);

    const generatedIndexContent = fs
      .readFileSync(
        path.resolve(workDir, ".terrastack", "component", "index.js")
      )
      .toString();

    expect(generatedIndexContent).toMatchSnapshot();
  });

  it("generates a package.json file", () => {
    const result = runTerrastack(workDir, [
      "component",
      "-t",
      "1.0.0",
      "-d",
      "description",
      "-n",
      "foo-module"
    ]);

    const generatedFileContent = fs
      .readFileSync(path.resolve(workDir, "package.json"))
      .toString();

    expect(generatedFileContent).toMatchSnapshot();
  });

  it("prints status messages on stdout", () => {
    const result = runTerrastack(workDir, [
      "component",
      "-t",
      "1.0.0",
      "-d",
      "description",
      "-n",
      "foo-module"
    ]);

    console.log({ result });

    expect(result.stdout).toMatchSnapshot();
  });

  it("does not print errors on stderr", () => {
    const result = runTerrastack(workDir, [
      "component",
      "-t",
      "1.0.0",
      "-d",
      "description",
      "-n",
      "foo-module"
    ]);

    expect(result.stderr).toHaveLength(0);
  });

  it("exits with 0", () => {
    const result = runTerrastack(workDir, [
      "component",
      "-t",
      "1.0.0",
      "-d",
      "description",
      "-n",
      "foo-module"
    ]);

    expect(result.code).toEqual(0);
  });
});
