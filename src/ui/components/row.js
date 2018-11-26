const log4js = require("log4js");
const PropTypes = require("prop-types");
import { Component } from "react";

class Row extends Component {
  constructor(props) {
    super(props);

    this.switchFrame = this.switchFrame.bind(this);
  }

  render(props) {
    log4js.getLogger("vis").info(props);
    let renderedChilds = [];
    for (const child of props.children) {
      let childRows = renderToString(child).split("\n");
      renderedChilds.push(childRows);
    }

    let rows = [];
    let maxRows = Math.max(...renderedChilds.map(r => r.length));

    for (const row of Array(maxRows).keys()) {
      // TODO handle elements which are not the same height
      rows.push(renderedChilds.map(c => c[row]).join(props.separator));
    }

    return h("div", {}, rows.join("\n"));
  }

  componentDidMount() {
    this.timer = setInterval(this.switchFrame, 100);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  switchFrame() {
    this.forceUpdate();
  }
}

Row.propTypes = {
  children: PropTypes.node
};
Row.defaultProps = {
  separator: " "
};

module.exports = { Row };
