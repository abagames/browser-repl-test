import { Engine, Render, Bodies, World } from "matter-js";
import * as util from "./util";

let engine: Engine;
let render: Render;
let ticks = 0;
let rectSize: number;
let rectAddingInterval: number;

window.onload = () => {
  engine = Engine.create();
  render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: 200,
      height: 150,
      wireframes: false
    }
  });
  const ground = Bodies.rectangle(90, 140, 200, 15, { isStatic: true });
  World.add(engine.world, ground);
  Engine.run(engine);
  Render.run(render);
  util.init(engine);
  initRepl();
  rectSize = 20;
  rectAddingInterval = 60;
  util.addCircle(100, 0, 20);
  update();
};

function update() {
  requestAnimationFrame(update);
  if (ticks % rectAddingInterval === 0) {
    const box = Bodies.rectangle(
      Math.random() * 200,
      -rectSize,
      rectSize,
      rectSize
    );
    World.add(engine.world, box);
  }
  ticks++;
}

declare const process;

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
