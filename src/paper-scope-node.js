import paper from "paper";
import { createCanvas } from "canvas";

export function createPaperScope(width, height) {
  const canvas = createCanvas(width, height);
  const scope = new paper.PaperScope();
  scope.setup(canvas);
  return { scope, canvas };
}
