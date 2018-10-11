/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// return the result of the spawned process:
//  [ 'status', 'signal', 'output', 'pid', 'stdout', 'stderr',
//    'envPairs', 'options', 'args', 'file' ]

const { sync } = require("execa");
const path = require("path");

const TERRASTACK_PATH = path.resolve(__dirname, "../bin/run");

const runTerrastack = (dir, args) => {
  const result = sync(TERRASTACK_PATH, args || [], {
    cwd: dir,
    env: process.env,
    reject: false
  });

  return result;
};

module.exports = {
  runTerrastack
};
