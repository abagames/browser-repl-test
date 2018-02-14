const express = require("express");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");

const app = express();
const config = require("./webpack.config.js");
config.devtool = "source-map";
config.entry.push("webpack-hot-middleware/client?reload=true");
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler));
app.use(webpackHotMiddleware(compiler));

app.listen(8080, function() {
  console.log("webpack-dev-middleware listening on port 3000\n");
});

const WebSocket = require("ws");
const readline = require("readline");

const wss = new WebSocket.Server({ port: 8887 });
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

wss.on("connection", (ws, req) => {
  const ra = req.connection.remoteAddress;
  if (ra !== "127.0.0.1" && ra !== "::1") {
    ws.close();
  }
  rl.write("\n");
  ws.on("message", message => {
    console.log(message);
    rl.question("REPL> ", answer => {
      try {
        ws.send(answer);
      } catch (e) {
        console.log(`send failed: ${e}`);
      }
    });
  });
  ws.on("error", err => console.log(err));
});
