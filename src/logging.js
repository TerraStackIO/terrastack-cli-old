const log4js = require("log4js");
const chalk = require("chalk");

log4js.configure({
  appenders: {
    multi: {
      type: "multiFile",
      base: "logs/",
      property: "categoryName",
      extension: ".log"
    }
  },
  categories: {
    default: { appenders: ["multi"], level: "debug" }
  }
});

const applyLogger = base => {
  let loggers = {};
  let buffer = [];

  base.events.on("component:before", function(component) {
    loggers[component.name] = log4js.getLogger(component.name);
  });

  base.events.on("output:*", function(component, output) {
    loggers[component.name].info(output.trim());
    buffer.push(output);
  });

  base.events.on("component:**", function(component) {
    console.log(`${component.name}: ${this.event}`);
  });

  base.events.on("error", function(component) {
    console.log(chalk.red.bold.underline(`Error: ${component.name}`));
    console.log(`Recent output: ${buffer.join("")}`);
  });
};

module.exports = applyLogger;
