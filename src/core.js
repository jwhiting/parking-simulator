export const DEFAULT_CONFIG = {
  wheelbase: 2.9,
  track: 1.65,
  bodyLength: 4.8,
  bodyWidth: 2.0,
  frontOverhang: 0.9,
  rearOverhang: 1.0,
  wheelLength: 0.7,
  wheelWidth: 0.25,
  maxSteerDeg: 40,
};

export const degToRad = (deg) => (deg * Math.PI) / 180;
export const radToDeg = (rad) => (rad * 180) / Math.PI;

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
    if (Math.abs(steer) < 1e-6) {
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
    if (Math.abs(steer) < 1e-6) {
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

export function buildPlaybook(commands) {
  return commands.map((cmd) => ({ ...cmd }));
}
