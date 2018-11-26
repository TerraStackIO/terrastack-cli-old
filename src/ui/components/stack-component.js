import React, { Component } from "react";
import { Box, Text } from "@terrastack/ink";

class StackComponent extends Component {
  render() {
    return (
      <Box border={1} borderColor={this.color()}>
        <Text>
          {this.props.item.name} - {this.props.item.status}
        </Text>
      </Box>
    );
  }

  color() {
    if (this.props.item.status === "success") {
      return "green";
    } else {
      return "white";
    }
  }
}

module.exports = { StackComponent };
