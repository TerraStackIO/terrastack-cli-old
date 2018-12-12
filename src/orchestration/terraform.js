/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const { spawn } = require("child_process");
const eventbus = require("./eventbus");
const parser = require("terraform-plan-parser");

class Terraform {
  constructor(component) {
    this.component = component;
  }

  async init() {
    eventbus.emit("component:init:start", this.component);
    await this._exec("init -force-copy ").then(...this._defaultCallbacks("init"));
  }

  asyncInit() {
    return this.asyncCommand("init");
  }

  asyncPlan() {
    return this.asyncCommand("plan");
  }

  asyncState() {
    return this.asyncCommand("state");
  }

  asyncApply() {
    return this.asyncCommand("apply");
  }

  asyncOutput() {
    return this.asyncCommand("output");
  }

  asyncDestroy() {
    return this.asyncCommand("destroy");
  }

  asyncCommand(method) {
    return async () => {
      await new Promise((resolve, reject) => resolve(this[method]()));
    };
  }

  async plan() {
    eventbus.emit("component:plan:start", this.component);
    await this._exec("plan -input=false -lock=false -detailed-exitcode").then(
      () => {
        eventbus.emit("component:plan:success", this.component);
      },
      ({ code, stdout }) => {
        // Code 2 means: Succeeded, but there is a diff
        if (code == 2) {
          const result = parser.parseStdout(stdout);
          this.component._diff = result;
          eventbus.emit("component:plan:diff", this.component);
        } else {
          eventbus.emit("component:plan:failed", this.component);
          eventbus.emit("error", this.component);
          throw "failed";
        }
      }
    );
  }

  applyOutputParser() {
    return stdout => {
      for (let line of stdout.split("\n").filter(String)) {
        let match = line.match(/^(?<name>[\w\.\[\]]+): (?<rest>.+)$/);
        if (match) {
          let resource = match.groups.name;
          let resourceRest = match.groups.rest;

          if (resourceRest.startsWith("Creating...")) {
            eventbus.emit("resource:apply:creating", this.component, { resource, time: "0s" });
          } else if (resourceRest.startsWith("Refreshing state...")) {
            eventbus.emit("resource:apply:refreshing", this.component, { resource, time: "0s" });
          }

          match = resourceRest.match(/^Creation complete after (?<time>[\dhms]+)/);
          if (match) {
            eventbus.emit("resource:apply:created", this.component, { resource, time: match.groups.time });
          }

          match = resourceRest.match(/^Still creating... \((?<time>[\dhms]+) elapsed\)/);
          if (match) {
            eventbus.emit("resource:apply:creating", this.component, { resource, time: match.groups.time });
          }
        }
      }
    };
  }

  async state() {
    eventbus.emit("component:state:start", this.component);
    await this._exec("state list").then(...this._defaultCallbacks("state"));
  }

  async apply() {
    eventbus.emit("component:apply:start", this.component);
    await this._exec("apply -auto-approve -input=false -lock=false", this.applyOutputParser()).then(
      ...this._defaultCallbacks("apply")
    );
  }

  async output() {
    eventbus.emit("component:output:start", this.component);
    await this._exec("output -json").then(
      output => {
        this.component.setOutput(JSON.parse(output));
        eventbus.emit(`component:output:success`, this.component);
      },
      ({ code }) => {
        // eventbus.emit(`component:output:failed`, this.component, code);
        // eventbus.emit("error", this.component);
        // throw "failed";
      }
    );
  }

  async destroy() {
    eventbus.emit("component:destroy:start", this.component);
    await this._exec("destroy -auto-approve").then(...this._defaultCallbacks("destroy"));
  }

  async _exec(cmd, stdoutCallback) {
    stdoutCallback = stdoutCallback || (o => o);
    return new Promise((resolve, reject) => {
      const proc = spawn(`terraform ${cmd} -no-color`, {
        timeout: 0,
        shell: "/bin/bash",
        env: Object.assign({ TF_IN_AUTOMATION: 1 }, process.env),
        cwd: this.component.workingDir
      });

      let stdout = "";

      proc.stdout.on("data", output => {
        let str = output.toString();
        stdout += str;
        stdoutCallback(str);
        eventbus.emit("output:stdout", this.component, str);
      });

      proc.stderr.on("data", output => {
        eventbus.emit("output:stderr", this.component, output.toString());
      });

      proc.on("close", function(code) {
        if (code !== 0) {
          reject({ code, stdout });
        } else {
          resolve(stdout);
        }
      });
    });
  }

  _defaultCallbacks(command) {
    return [
      () => {
        eventbus.emit(`component:${command}:success`, this.component);
      },
      ({ code }) => {
        eventbus.emit(`component:${command}:failed`, this.component, code);
        eventbus.emit("error", this.component);
        throw "failed";
      }
    ];
  }
}

module.exports = Terraform;
