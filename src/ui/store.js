const { createStore } = require("redux");
const _ = require("lodash");

const wrappedCreateStore = stack => {
  const reducer = (state = {}, action) => {
    if (action.component == undefined) {
      return state;
    }

    let layer = action.component._layer;
    let name = action.component.name;
    let newState = {};
    switch (action.type) {
      case "ADDED":
        newState = Object.assign({}, state);
        newState["components"][layer][name] = "added";
        return newState;
      case "START":
        newState = Object.assign({}, state);
        newState["components"][layer][name] = "start";
        return newState;
      case "SUCCESS":
        newState = Object.assign({}, state);
        newState["components"][layer][name] = "success";
        return newState;
      case "DIFF":
        newState = Object.assign({}, state);
        newState["components"][layer][name] = "diff";
        newState["issues"].push({
          component: action.component,
          reason: "diff"
        });
        return newState;
      case "FAILED":
        newState = Object.assign({}, state);
        newState["components"][layer][name] = "failed";
        newState["issues"].push({
          component: action.component,
          reason: "failed"
        });
        return newState;
      default:
        return state;
    }
  };

  let components = {};

  _.flatten(stack.componentChunks).forEach(component => {
    if (components[component._layer] === undefined) {
      components[component._layer] = {};
    }
    components[component._layer][component.name] = "init";
  });

  const initialState = {
    stack: { name: stack.stack.name },
    issues: [],
    components
  };

  return createStore(reducer, initialState);
};
module.exports = wrappedCreateStore;
