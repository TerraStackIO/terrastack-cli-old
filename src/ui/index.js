import { render, Box } from "@terrastack/ink";
// import store from "./store";
import { Stack } from "./components/stack";
import React from "react";
import { Provider } from "react-redux";

const { createStore } = require("redux");

const store = createStore((state = {}, action) => {
  if (action.component == undefined) {
    return state;
  }

  let layer = action.component._layer;
  let name = action.component.name;
  let newState = {};
  switch (action.type) {
    case "ADDED":
      if (state[layer] == undefined) {
        state[layer] = {};
      }
      newState = Object.assign({}, state);
      newState[layer][name] = "added";
      return newState;
    case "START":
      if (state[layer] == undefined) {
        state[layer] = {};
      }
      newState = Object.assign({}, state);
      newState[layer][name] = "start";
      return newState;
    case "SUCCESS":
      newState = Object.assign({}, state);
      newState[layer][name] = "success";
      return newState;
    case "FAILED":
      newState = Object.assign({}, state);
      newState[layer][name] = "failed";
      return newState;
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

  render(
    <Provider store={store}>
      <Stack />
    </Provider>
  );
};

module.exports = {
  applyVisualization
};
