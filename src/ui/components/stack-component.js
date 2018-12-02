import React, { Component } from "react";
import { Box, Text } from "@terrastack/ink";

class StackComponent extends Component {
  render() {
    return (
      <Box
        border={1}
        borderColor={this.color()}
        paddingLeft={2}
        paddingRight={2}
      >
        <Text>{this.props.item.name}</Text>
      </Box>
    );
  }

  color() {
    switch (this.props.item.status) {
      case "start":
        return "cyan";
      case "success":
        return "green";
      case "diff":
        return "yellow";
      case "failed":
        return "red";
      default:
        return "white";
    }
  }
}

module.exports = { StackComponent };
