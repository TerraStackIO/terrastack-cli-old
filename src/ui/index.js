import { render } from "@terrastack/ink";
import createStore from "./store";
import { Stack } from "./components/stack";
import React from "react";
import { Provider } from "react-redux";

const applyVisualization = base => {
  let buffer = [];
  const store = createStore(base);

  base.events.on("component:added", function(component) {
    store.dispatch({ type: "ADDED", component: component });
  });

  base.events.on("component:plan:start", function(component) {
    store.dispatch({ type: "START", component: component });
  });

  base.events.on("component:apply:start", function(component) {
    store.dispatch({ type: "START", component: component });
  });

  base.events.on("component:destroy:start", function(component) {
    store.dispatch({ type: "START", component: component });
  });

  base.events.on("component:plan:diff", function(component) {
    store.dispatch({ type: "DIFF", component: component });
  });

  base.events.on("component:plan:success", function(component) {
    store.dispatch({ type: "SUCCESS", component: component });
  });

  base.events.on("component:apply:success", function(component) {
    store.dispatch({ type: "SUCCESS", component: component });
  });

  base.events.on("component:destroy:success", function(component) {
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
