export const DEFAULT_CONFIG = {
  wheelbase: 106.3,
  track: 60.6,
  bodyLength: 184.8,
  bodyWidth: 73.5,
  frontOverhang: 37.2,
  rearOverhang: 41.3,
  wheelLength: 27.0,
  wheelWidth: 9.2,
  maxSteerDeg: 32.5,
};

export const degToRad = (deg) => (deg * Math.PI) / 180;
export const radToDeg = (rad) => (rad * 180) / Math.PI;
const MIN_TURN_STEER_RAD = degToRad(0.5);

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export class VehicleState {
  constructor({ x = 0, y = 0, heading = 0, steer = 0 } = {}) {
    this.x = x;
    this.y = y;
    this.heading = heading;
    this.steer = steer;
  }

  clone() {
    return new VehicleState({
      x: this.x,
      y: this.y,
      heading: this.heading,
      steer: this.steer,
    });
  }
}

export class VehicleModel {
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  setSteer(state, steerRad) {
    const maxSteer = degToRad(this.config.maxSteerDeg);
    state.steer = clamp(steerRad, -maxSteer, maxSteer);
  }

  move(state, distance) {
    const steer = state.steer;
    if (Math.abs(steer) < MIN_TURN_STEER_RAD) {
      state.x += Math.cos(state.heading) * distance;
      state.y += Math.sin(state.heading) * distance;
      return;
    }

    const R = this.config.wheelbase / Math.tan(steer);
    const dTheta = distance / R;

    const iccX = state.x - R * Math.sin(state.heading);
    const iccY = state.y + R * Math.cos(state.heading);

    const newHeading = state.heading + dTheta;

    state.x = iccX + R * Math.sin(newHeading);
    state.y = iccY - R * Math.cos(newHeading);
    state.heading = newHeading;
  }

  getWheelPositions(state) {
    const { wheelbase, track } = this.config;
    const halfTrack = track / 2;

    const rearLeft = this._transformLocalToWorld(state, 0, halfTrack);
    const rearRight = this._transformLocalToWorld(state, 0, -halfTrack);
    const frontLeft = this._transformLocalToWorld(state, wheelbase, halfTrack);
    const frontRight = this._transformLocalToWorld(state, wheelbase, -halfTrack);

    return {
      rearLeft,
      rearRight,
      frontLeft,
      frontRight,
    };
  }

  getBodyPolygon(state) {
    const { bodyLength, bodyWidth, rearOverhang } = this.config;
    const halfWidth = bodyWidth / 2;

    const rear = -rearOverhang;
    const front = rear + bodyLength;

    return [
      this._transformLocalToWorld(state, rear, halfWidth),
      this._transformLocalToWorld(state, front, halfWidth),
      this._transformLocalToWorld(state, front, -halfWidth),
      this._transformLocalToWorld(state, rear, -halfWidth),
    ];
  }

  getCenterOfBody(state) {
    const { bodyLength, rearOverhang } = this.config;
    const centerX = -rearOverhang + bodyLength / 2;
    return this._transformLocalToWorld(state, centerX, 0);
  }

  getTurningRadii(state) {
    const steer = state.steer;
    // For very small steering angles, render straight sweep guides to avoid
    // numerically huge radii that visually drift from the vehicle.
    if (Math.abs(steer) < MIN_TURN_STEER_RAD) {
      return null;
    }
    const R = this.config.wheelbase / Math.tan(steer);
    const inner = Math.abs(R) - this.config.track / 2;
    const outer = Math.abs(R) + this.config.track / 2;
    return { radius: R, inner, outer };
  }

  toWorld(state, localX, localY) {
    return this._transformLocalToWorld(state, localX, localY);
  }

  _transformLocalToWorld(state, localX, localY) {
    const cos = Math.cos(state.heading);
    const sin = Math.sin(state.heading);
    return {
      x: state.x + localX * cos - localY * sin,
      y: state.y + localX * sin + localY * cos,
    };
  }
}

export class Simulator {
  constructor(config = {}) {
    this.model = new VehicleModel(config);
    this.state = new VehicleState();
    this.lastCollision = null;
  }

  reset(state = new VehicleState()) {
    this.state = state.clone();
  }

  setSteerDeg(deg) {
    this.model.setSteer(this.state, degToRad(deg));
  }

  setSteerRad(rad) {
    this.model.setSteer(this.state, rad);
  }

  move(distance) {
    this.model.move(this.state, distance);
  }

  moveWithCollision(distance, world) {
    const next = this.state.clone();
    this.model.move(next, distance);
    const collision = detectCollision(next, this.model, world);
    if (collision) {
      if (
        this.lastCollision &&
        Math.hypot(
          this.lastCollision.x - collision.x,
          this.lastCollision.y - collision.y
        ) < 1
      ) {
        this.lastCollision = {
          ...collision,
          amount: this.lastCollision.amount,
        };
      } else {
        let amount = randomCollisionAmount();
        if (collision.kind === "car") {
          amount *= 2;
        }
        this.lastCollision = {
          ...collision,
          amount,
        };
      }
      return false;
    }
    this.lastCollision = null;
    this.state = next;
    return true;
  }

  applyCommand(cmd) {
    if (cmd.type === "setSteer") {
      this.setSteerDeg(cmd.deg);
    } else if (cmd.type === "move") {
      this.move(cmd.distance);
    } else {
      throw new Error(`Unknown command type: ${cmd.type}`);
    }
  }

  applyPlaybook(playbook, upto = playbook.length) {
    const snapshot = this.state.clone();
    for (let i = 0; i < upto; i += 1) {
      this.applyCommand(playbook[i]);
    }
    const result = this.state.clone();
    this.state = snapshot;
    return result;
  }
}

function randomCollisionAmount() {
  const min = 800;
  const max = 3000;
  const r = Math.random();
  return Math.floor(min + r * r * (max - min + 1));
}

export function buildPlaybook(commands) {
  return commands.map((cmd) => ({ ...cmd }));
}

function rectToPoly(rect) {
  return [
    { x: rect.x, y: rect.y },
    { x: rect.x + rect.width, y: rect.y },
    { x: rect.x + rect.width, y: rect.y + rect.height },
    { x: rect.x, y: rect.y + rect.height },
  ];
}

function projectPolygon(poly, axis) {
  let min = Infinity;
  let max = -Infinity;
  for (const p of poly) {
    const proj = p.x * axis.x + p.y * axis.y;
    if (proj < min) min = proj;
    if (proj > max) max = proj;
  }
  return { min, max };
}

function getAxes(poly) {
  const axes = [];
  for (let i = 0; i < poly.length; i += 1) {
    const p1 = poly[i];
    const p2 = poly[(i + 1) % poly.length];
    const edge = { x: p2.x - p1.x, y: p2.y - p1.y };
    const normal = { x: -edge.y, y: edge.x };
    const length = Math.hypot(normal.x, normal.y) || 1;
    axes.push({ x: normal.x / length, y: normal.y / length });
  }
  return axes;
}

function polygonsIntersect(a, b) {
  const axes = [...getAxes(a), ...getAxes(b)];
  for (const axis of axes) {
    const projA = projectPolygon(a, axis);
    const projB = projectPolygon(b, axis);
    if (projA.max < projB.min || projB.max < projA.min) {
      return false;
    }
  }
  return true;
}

export function detectCollision(state, model, world) {
  if (!world || !world.objects) {
    return null;
  }
  const offset = world.offset || { x: 0, y: 0 };
  const carPoly = model.getBodyPolygon(state);
  for (const obj of world.objects) {
    if (!obj.solid || obj.type !== "rect") {
      continue;
    }
    const rect = {
      x: obj.x + offset.x,
      y: obj.y + offset.y,
      width: obj.width,
      height: obj.height,
    };
    const rectPoly = rectToPoly(rect);
    if (polygonsIntersect(carPoly, rectPoly)) {
      return {
        ...getContactPoint(carPoly, rect),
        kind: obj.kind || "solid",
      };
    }
  }
  return null;
}

function getContactPoint(carPoly, rect) {
  const rectPoly = rectToPoly(rect);
  const carEdges = getEdges(carPoly);
  const rectEdges = getEdges(rectPoly);

  // 1) If any edges intersect, return the first intersection point.
  for (const e1 of carEdges) {
    for (const e2 of rectEdges) {
      const hit = segmentIntersection(e1.a, e1.b, e2.a, e2.b);
      if (hit) {
        return hit;
      }
    }
  }

  // 2) Otherwise, return the closest point between edges.
  let bestPoint = carPoly[0];
  let bestDist = Infinity;
  for (const e1 of carEdges) {
    for (const e2 of rectEdges) {
      const { p1, p2, dist2 } = closestPointsBetweenSegments(e1.a, e1.b, e2.a, e2.b);
      if (dist2 < bestDist) {
        bestDist = dist2;
        bestPoint = p1; // point on car edge
      }
    }
  }
  return bestPoint;
}

function getEdges(poly) {
  const edges = [];
  for (let i = 0; i < poly.length; i += 1) {
    edges.push({ a: poly[i], b: poly[(i + 1) % poly.length] });
  }
  return edges;
}

function segmentIntersection(a, b, c, d) {
  const r = { x: b.x - a.x, y: b.y - a.y };
  const s = { x: d.x - c.x, y: d.y - c.y };
  const rxs = r.x * s.y - r.y * s.x;
  const qpxr = (c.x - a.x) * r.y - (c.y - a.y) * r.x;
  if (Math.abs(rxs) < 1e-9 && Math.abs(qpxr) < 1e-9) {
    return null;
  }
  if (Math.abs(rxs) < 1e-9) {
    return null;
  }
  const t = ((c.x - a.x) * s.y - (c.y - a.y) * s.x) / rxs;
  const u = ((c.x - a.x) * r.y - (c.y - a.y) * r.x) / rxs;
  if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    return { x: a.x + t * r.x, y: a.y + t * r.y };
  }
  return null;
}

function closestPointsBetweenSegments(a, b, c, d) {
  const EPS = 1e-9;
  const ab = { x: b.x - a.x, y: b.y - a.y };
  const cd = { x: d.x - c.x, y: d.y - c.y };
  const ac = { x: a.x - c.x, y: a.y - c.y };

  const ab2 = ab.x * ab.x + ab.y * ab.y;
  const cd2 = cd.x * cd.x + cd.y * cd.y;
  const abcd = ab.x * cd.x + ab.y * cd.y;
  const abac = ab.x * ac.x + ab.y * ac.y;
  const cdac = cd.x * ac.x + cd.y * ac.y;

  let s = 0;
  let t = 0;

  const denom = ab2 * cd2 - abcd * abcd;
  if (denom > EPS) {
    s = (abcd * cdac - cd2 * abac) / denom;
    s = Math.max(0, Math.min(1, s));
  }
  t = (abcd * s + cdac) / (cd2 + EPS);
  if (t < 0) {
    t = 0;
    s = Math.max(0, Math.min(1, -abac / (ab2 + EPS)));
  } else if (t > 1) {
    t = 1;
    s = Math.max(0, Math.min(1, (abcd - abac) / (ab2 + EPS)));
  }

  const p1 = { x: a.x + s * ab.x, y: a.y + s * ab.y };
  const p2 = { x: c.x + t * cd.x, y: c.y + t * cd.y };
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return { p1, p2, dist2: dx * dx + dy * dy };
}
