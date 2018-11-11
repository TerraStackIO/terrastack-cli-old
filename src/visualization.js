const { h, render, Component } = require("ink");
const { Provider, connect } = require("ink-redux");
const { createStore } = require("redux");

const store = createStore((state = 0, action) => {
  switch (action.type) {
    case "INCREMENT":
      return state + 1;
    default:
      return state;
  }
});

const applyVisualization = base => {
  let buffer = [];

  base.events.on("component:added", function(component) {
    store.dispatch({ type: "INCREMENT" });
  });

  base.events.on("output:*", function(_component, output) {
    buffer.push(output);
  });

  base.events.on("error", function(component) {
    // console.log(chalk.red.bold.underline(`Error: ${component.name}`));
    // console.log(`Recent output: ${_.takeRight(buffer, 50).join("")}`);
  });

  render(h(Provider, { store }, h(ConnectedCounter)));
};

class Counter extends Component {
  render(props) {
    return `Component Counter: ${props.counter}`;
  }
}

const mapStateToProps = state => ({
  counter: state
});

const ConnectedCounter = connect(mapStateToProps)(Counter);

module.exports = applyVisualization;
