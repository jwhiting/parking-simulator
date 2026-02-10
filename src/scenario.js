import { buildPlaybook } from "./core.js";

export const PARALLEL_PARKING_SCENARIO = {
  name: "Parallel Parking",
  startState: { x: -2.5, y: -1.2, heading: 0, steer: 0 },
  playbook: buildPlaybook([
    { type: "setSteer", deg: -30 },
    { type: "move", distance: -2.6 },
    { type: "setSteer", deg: 30 },
    { type: "move", distance: -2.2 },
    { type: "setSteer", deg: 0 },
    { type: "move", distance: 0.6 },
  ]),
};
