import React, { Component } from "react";
import { StackComponent } from "./stack-component";
import { connect } from "react-redux";
import { Box } from "@terrastack/ink";
import _ from "lodash";

class Row extends Component {
  render() {
    return <Box>{this.props.children}</Box>;
  }
}

class Stack extends Component {
  render() {
    if (_.isEmpty(this.props.rows)) {
      return "Nothing to see";
    } else {
      const elements = this.props.rows.map((row, index) => (
        <Row key={index}>
          {row.map(item => (
            <StackComponent key={item.name} item={item} />
          ))}
        </Row>
      ));

      return elements;
    }
  }
}

const mapStateToProps = state => {
  const rows = Object.keys(state).map(layerIndex => {
    const layer = state[layerIndex];
    return Object.keys(layer).map(name => {
      return {
        name,
        status: layer[name]
      };
    });
  });
  return { rows };
};

module.exports = { Stack: connect(mapStateToProps)(Stack) };
