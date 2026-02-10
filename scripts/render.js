import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Simulator, VehicleState } from "../src/core.js";
import { PaperRenderer } from "../src/renderer.js";
import { PARALLEL_PARKING_SCENARIO } from "../src/scenario.js";
import { createPaperScope } from "../src/paper-scope-node.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    step: 0,
    width: 900,
    height: 600,
    out: path.join(__dirname, "../out/frame.png"),
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--step") {
      opts.step = Number(args[i + 1]);
      i += 1;
    } else if (arg === "--width") {
      opts.width = Number(args[i + 1]);
      i += 1;
    } else if (arg === "--height") {
      opts.height = Number(args[i + 1]);
      i += 1;
    } else if (arg === "--out") {
      opts.out = args[i + 1];
      i += 1;
    }
  }

  return opts;
}

const { step, width, height, out } = parseArgs();
const { scope, canvas } = createPaperScope(width, height);

const sim = new Simulator();
const renderer = new PaperRenderer(scope);

const startState = new VehicleState(PARALLEL_PARKING_SCENARIO.startState);
const playbook = PARALLEL_PARKING_SCENARIO.playbook;

sim.reset(startState);
const snapshot = sim.applyPlaybook(playbook, step);
renderer.render(snapshot, sim.model, { scale: 65 });

const buffer = canvas.toBuffer("image/png");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, buffer);

console.log(`Wrote ${out}`);
