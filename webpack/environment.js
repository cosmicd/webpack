// This file sets all global vars used by webpack and the project.
// This file is the place to define all of the node env vars that
// that will be temporarily available while the project is running.
// These are NOT stored permanently in user profile.

// WARN: BEFORE compilation, if you have any of these vars in
// process.env (set in the shell or in package.json), the var defined
// here will be overridden by process.env. If a var is not set in process.env
// BEFORE compilation, the webpack DefinePlugin will be used to set process.env
// var value to the value given here. In fact, all of the vars given here will
// be present as process.env when you compile.
// example: The shell command 'export PORT=8000'
// (or in package.json script: PORT=8000 webpack ....)
// means  port = 8000 will be used instead of the port configured here.

const webpack = require("webpack");

// HAVE TO USE UPPER CASE VARS FOR COMPARISON WITH THE process.env vars.

const machine = {
  HOST: "0.0.0.0",
  PORT: "9001",
  IP: "192.168.33.10"
};
const project = {
  PROJECT_PATH: process.env.PROJECT_PATH,
  SRC: "app",
  BUILD: "build",
  STATIC: "static",
  NODE_MODULES: process.env.NODE_MODULES,
};
const misc = {
  // NOTE: HMR doesnt work at rootpath ('/') if you use ASSET_PATH
  // different than the rootpath.
  ASSET_PATH_PROD: "/",
  //'ASSET_PATH_PROD' : 'http://' + machine.IP + ':' + machine.PORT+'/',
  ASSET_PATH_DEV: "/"
};

module.exports.getEnv = devprod => {
  const dict = Object.assign({}, machine, project, misc); // flatten the dictionaries
  dict["NODE_ENV"] = process.env.NODE_ENV || devprod; // devprod is development or production
  dict["BABEL_ENV"] = process.env.BABEL_ENV || dict.NODE_ENV;
  let env = {};
  Object.entries(dict).forEach(([key, value]) => {
    env[key] = process.env[key] || value;
  });
  return env;
};
module.exports.stringifyDictValues = env => {
  let dict = {};
  Object.entries(env).forEach(([key, value]) => {
    dict[key] = JSON.stringify(value);
  });
  return dict;
};
module.exports.getProcessEnv = par => {
  const process_env = {
    "process.env": {
      NODE_ENV: par["NODE_ENV"],
      BABEL_ENV: par["BABEL_ENV"],
      NODE_MODULES: par["NODE_MODULES"]
    }
  };
  return process_env;
};
module.exports.setProcessEnv = dict => ({
  plugins: [new webpack.DefinePlugin(dict)]
});
