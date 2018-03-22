const path = require("path");
const express = require("express");

const environment = require("./environment");
const node_env = "production";
const env = environment.getEnv(node_env);
const str_env = environment.stringifyDictValues(env); //stringify values of a dict object; required by
const process_env = environment.getProcessEnv(str_env);
environment.setProcessEnv(process_env);
const static_path = path.join(env.PROJECT_PATH, env.BUILD);
const app = express();
app.use(express.static(static_path));
// And run the server
app.listen(env.PORT, env.HOST, function() {
  console.log("Server running on port " + env.PORT);
});
