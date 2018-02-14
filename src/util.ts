import { Engine, World, Bodies } from "matter-js";

let engine: Engine;

export function init(_engine: Engine) {
  engine = _engine;
}

export function addCircle(x: number, y: number, radius: number = 100) {
  World.add(engine.world, Bodies.circle(x, y, radius));
}
