const { h, render, renderToString, Color, Component, Text } = require("ink");
const { Provider, connect } = require("ink-redux");
const { createStore } = require("redux");
const Box = require("ink-box");
const Spinner = require("ink-spinner");
const log4js = require("log4js");
const PropTypes = require("prop-types");

const store = createStore((state = {}, action) => {
  if (action.component == undefined) {
    return state;
  }

  let layer = action.component._layer;
  let name = action.component.name;

  switch (action.type) {
    case "ADDED":
      if (state[layer] == undefined) {
        state[layer] = {};
      }
      state[layer][name] = "added";
      return state;
    case "START":
      state[layer][name] = "start";
      return state;
    case "SUCCESS":
      state[layer][name] = "success";
      return state;
    case "FAILED":
      state[layer][name] = "failed";
      return state;
    default:
      return state;
  }
});

const applyVisualization = base => {
  let buffer = [];

  base.events.on("component:added", function(component) {
    store.dispatch({ type: "ADDED", component: component });
  });

  base.events.on("component:*:start", function(component) {
    store.dispatch({ type: "START", component: component });
  });

  base.events.on("component:*:success", function(component) {
    store.dispatch({ type: "SUCCESS", component: component });
  });

  base.events.on("component:*:failed", function(component) {
    store.dispatch({ type: "FAILED", component: component });
  });

  base.events.on("output:*", function(_component, output) {
    buffer.push(output);
  });

  base.events.on("error", function(component) {
    // console.log(chalk.red.bold.underline(`Error: ${component.name}`));
    // console.log(`Recent output: ${_.takeRight(buffer, 50).join("")}`);
  });

  render(h(Provider, { store }, h(ConnectedStack)));
};

class Stack extends Component {
  render(props) {
    let entries = [];
    for (let layer in props.componentChunks) {
      let chunk = props.componentChunks[layer];
      let rowEntries = [];
      for (let name in chunk) {
        let state = chunk[name];
        rowEntries.push(h(StackComponent, { name, state }));
      }
      entries.push(h(Row, {}, ...rowEntries));
    }
    return h("div", {}, ...entries);
  }
}

const StackComponent = props => {
  let state = h("span", {}, "□");
  switch (props.state) {
    case "start":
      state = h(Spinner);
      break;
    case "success":
      state = h(Color, { green: true }, "✔");
      break;
    case "failed":
      state = h(Color, { red: true }, "✖");
      break;
  }
  return h(
    Box,
    { borderStyle: "round", padding: { left: 1, right: 1 } },
    state,
    h(Text, { bold: true }, ` ${props.name}`)
  );
};

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

const mapStateToProps = state => ({
  componentChunks: state
});

const ConnectedStack = connect(mapStateToProps)(Stack);

module.exports = applyVisualization;
