# browser-repl-test

JavaScript browser REPL test.

![screenshot](https://raw.githubusercontent.com/abagames/browser-repl-test/master/docs/screenshot.gif)

I wanted to use things like the [ClojureScript browser REPL](https://clojurescript.org/guides/quick-start#browser-repl) for a plain JavaScript/TypeScript code, but I couldn't find such a library or a tool. So I was trying to create my own.

## How it works

1. Open the WebSocket in the dev server. Use the [readline.question](https://nodejs.org/api/readline.html#readline_rl_question_query_callback) to read the code and send it to the browser via the WebSocket.

```javascript
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
```

2. The browser side code receives the code with the below function and eval it. An evaluation result is sent back to the dev server.

```typescript
function initRepl() {
  if (process.env.NODE_ENV === "production") {
    return;
  }
  console.log("set REPL settings");
  const ws = new WebSocket("ws://localhost:8887");
  ws.onopen = () => {
    ws.send("REPL connecting to browser");
  };
  ws.onmessage = m => {
    const data = m.data;
    console.log(`[REPL] ${data}`);
    let result;
    try {
      const evalResult = eval(data);
      try {
        result = JSON.stringify(evalResult);
      } catch (e) {}
    } catch (e) {
      result = e;
    }
    console.log(result);
    ws.send(result);
  };
  ws.onerror = e => {
    console.log(e);
  };
  window.addEventListener("beforeunload", () => {
    ws.close();
  });
}
```

3. Use [SendToREPL VS Code extension](https://marketplace.visualstudio.com/items?itemName=nvbn.sendtorepl) to send the code snippet from the editor to the REPL.

## Limitation

* A code is evaluated in the context of the 'initRepl' function. You can't call functions that can't be seen from this module.

* You have to insert the 'initRepl' function to your code.
