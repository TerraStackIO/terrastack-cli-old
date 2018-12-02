import React, { Component } from "react";
import { StackComponent } from "./stack-component";
import { connect } from "react-redux";
import { Box, Text } from "@terrastack/ink";
import _ from "lodash";

class Row extends Component {
  render() {
    return (
      <Box
        borderBottom={1}
        borderTop={this.props.index == 0 ? 1 : 0}
        borderStyle={"classic"}
      >
        {this.props.children}
      </Box>
    );
  }
}

class Header extends Component {
  render() {
    return (
      <Box>
        <Text bold>Stack: {this.props.stack.name}</Text>
      </Box>
    );
  }
}

class Footer extends Component {
  render() {
    if (_.isEmpty(this.props.issues)) return " ";
    const issues = this.props.issues.map(issue => {
      return `${issue.component.name}: ${JSON.stringify(issue.component._diff, null, 2)}`;
    });
    return (
      <Box marginTop={1}>
        <Text italic underline>
          Note: {issues.join(",")}
        </Text>
      </Box>
    );
  }
}

class Logs extends Component {
  render() {
    if (_.isEmpty(this.props.issues)) return " ";
    const issues = this.props.issues.map(issue => {
      return `${issue.component.name}: ${issue.reason}`;
    });
    return (
      <Box marginTop={1}>
        <Text italic underline>
          Note: {issues.join(",")}
        </Text>
      </Box>
    );
  }
}

class Stack extends Component {
  render() {
    if (_.isEmpty(this.props.rows)) {
      return "Nothing to see";
    } else {
      const elements = this.props.rows.map((row, index) => (
        <Row key={index} index={index}>
          <Box border={1} borderColor="black">
            <Text>Step: {index}</Text>
          </Box>
          {row.map(item => (
            <StackComponent key={item.name} item={item} />
          ))}
        </Row>
      ));

      return (
        <Box flexDirection="column">
          <Header stack={this.props.stack} />
          {elements}
          <Footer issues={this.props.issues} />
        </Box>
      );
    }
  }
}

const mapStateToProps = state => {
  const rows = Object.keys(state["components"]).map(layerIndex => {
    const layer = state["components"][layerIndex];
    return Object.keys(layer).map(name => {
      return { name, status: layer[name] };
    });
  });
  return { rows, stack: state.stack, issues: state.issues };
};

module.exports = { Stack: connect(mapStateToProps)(Stack) };
