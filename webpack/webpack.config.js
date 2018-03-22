// Webpack entry config file. NOTE: env[var] = process.env[var] 
// is achieved below and shared with all parts of webpack config.

const baseConfig = require("./lib/tasks/base").baseConfig; // config used both in dev and prod.
//const projectConfig = require(path.join(config_parts_path,'project')).projectConfig;// config used both in dev and prod.
const devConfig = require("./lib/tasks/dev").devConfig; // dev specific
const prodConfig = require("./lib/tasks/prod").prodConfig; // prod specific
const ssrConfig = require("./lib/tasks/ssr").ssrConfig; // server-side-rendering
const environment = require("./environment"); // import config globals
// Need a tool to merge configs: "concatenates arrays and merges objects creating a new object. If functions are encountered, it will execute them, run the results through the algorithm, and then wrap the returned values within a function again.".
const merge = require("webpack-merge");

module.exports = arg => {
  const devprod = arg === "ssr" ? "development" : arg;
  const env = environment.getEnv(devprod);
  const str_env = environment.stringifyDictValues(env); //stringify values of a dict object; required by
  const process_env = environment.getProcessEnv(str_env);
  if (arg === "ssr") {
    return merge([ssrConfig(env), environment.setProcessEnv(process_env)]);
  } else {
    const choiceConfig =
      env.NODE_ENV === "development" ? devConfig : prodConfig;
    return merge([
      choiceConfig(env),
      baseConfig(env),
      environment.setProcessEnv(process_env)
    ]);
  }
};
