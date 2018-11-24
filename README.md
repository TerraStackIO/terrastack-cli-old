# terrastack-cli

[Terrastack](https://github.com/TerraStackIO/terrastack) CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/terrastack-cli.svg)](https://npmjs.org/package/terrastack-cli)
[![Downloads/week](https://img.shields.io/npm/dw/terrastack-cli.svg)](https://npmjs.org/package/terrastack-cli)
[![License](https://img.shields.io/npm/l/terrastack-cli.svg)](https://github.com/terrastackio/terrastack-cli/blob/master/package.json)

<!-- toc -->
* [terrastack-cli](#terrastack-cli)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g terrastack-cli
$ terrastack COMMAND
running command...
$ terrastack (-v|--version|version)
terrastack-cli/0.2.0 darwin-x64 node-v10.10.0
$ terrastack --help [COMMAND]
USAGE
  $ terrastack COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`terrastack component`](#terrastack-component)
* [`terrastack help [COMMAND]`](#terrastack-help-command)
* [`terrastack stack:apply`](#terrastack-stackapply)
* [`terrastack stack:destroy`](#terrastack-stackdestroy)
* [`terrastack stack:info`](#terrastack-stackinfo)
* [`terrastack stack:plan`](#terrastack-stackplan)

## `terrastack component`

Init a new component from a Terraform module

```
USAGE
  $ terrastack component

OPTIONS
  -d, --description=description  Brief description for package
  -n, --name=name                (required) name of component
  -t, --tag=tag                  (required) Which tag (version) to set for package
```

_See code: [src/commands/component.js](https://github.com/terrastackio/terrastack-cli/blob/v0.2.0/src/commands/component.js)_

## `terrastack help [COMMAND]`

display help for terrastack

```
USAGE
  $ terrastack help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.2/src/commands/help.ts)_

## `terrastack stack:apply`

Apply the stack

```
USAGE
  $ terrastack stack:apply
```

_See code: [src/commands/stack/apply.js](https://github.com/terrastackio/terrastack-cli/blob/v0.2.0/src/commands/stack/apply.js)_

## `terrastack stack:destroy`

Destroy the stack

```
USAGE
  $ terrastack stack:destroy
```

_See code: [src/commands/stack/destroy.js](https://github.com/terrastackio/terrastack-cli/blob/v0.2.0/src/commands/stack/destroy.js)_

## `terrastack stack:info`

Get info about the stack

```
USAGE
  $ terrastack stack:info
```

_See code: [src/commands/stack/info.js](https://github.com/terrastackio/terrastack-cli/blob/v0.2.0/src/commands/stack/info.js)_

## `terrastack stack:plan`

Plan the stack

```
USAGE
  $ terrastack stack:plan
```

_See code: [src/commands/stack/plan.js](https://github.com/terrastackio/terrastack-cli/blob/v0.2.0/src/commands/stack/plan.js)_
<!-- commandsstop -->
