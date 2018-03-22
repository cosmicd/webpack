const path = require("path");
const express = require("express");
const { renderToString } = require("react-dom/server");
const sseExpress = require("sse-express");
const environment = require("./environment");

//...
const ssescript = JSON.stringify(
  "let eventSource = new EventSource('http://192.168.33.10:9001/updates');eventSource.addEventListener('bob', (e) => {console.log(e.data.welcomeMsg)});"
);

const server = () => {
  const node_env = "development";
  const env = environment.getEnv(node_env);
  const str_env = environment.stringifyDictValues(env); //stringify values of a dict object; required by
  const process_env = environment.getProcessEnv(str_env);
  environment.setProcessEnv(process_env);
  const static_path = path.join(env.PROJECT_PATH, env.STATIC);
  const SSR = require(static_path);

  const app = express();
  app.use(express.static(static_path));
  app.get("/", (req, res) =>
    res.status(200).send(renderMarkup(renderToString(SSR)))
  );
  app.get("/updates", sseExpress, function(req, res) {
    res.sse("connected", { welcomeMsg: "Hello Junaid!" });
    res.sse("bob", { welcomeMsg: "Hello bob!" });
  });
  app.listen(env.PORT, env.HOST, () => process.send && process.send("online"));
};
server();

//setInterval(intervalFunc, 1500);
function renderMarkup(html) {
  return `<!DOCTYPE html>
<html>
  <head>
    <title>Webpack SSR Demo</title>
    <meta charset="utf-8" />
  </head>
  <body>
    <div id="app">${html}</div>
    <div >mytext</div>
    <script src="./index.js"></script>
<script>${ssescript}</script>
  </head>
</html>
  </body>
</html>`;
}
