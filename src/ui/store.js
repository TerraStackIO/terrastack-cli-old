const { createStore } = require("redux");

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
      if (state[layer] == undefined) {
        state[layer] = {};
      }

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

module.exports = store;
