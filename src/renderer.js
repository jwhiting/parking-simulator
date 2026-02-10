import { radToDeg } from "./core.js";

export class PaperRenderer {
  constructor(paperScope, config = {}) {
    this.paper = paperScope;
    this.config = config;
    this.layers = {
      background: new this.paper.Layer(),
      car: new this.paper.Layer(),
      overlay: new this.paper.Layer(),
    };
    this.layers.background.activate();
    this.background = new this.paper.Path.Rectangle({
      from: this.paper.view.bounds.topLeft,
      to: this.paper.view.bounds.bottomRight,
      fillColor: "#f5f1ea",
    });
    this.layers.background.addChild(this.background);
  }

  clear() {
    this.layers.car.removeChildren();
    this.layers.overlay.removeChildren();
  }

  render(state, model, options = {}) {
    this.clear();
    const { showTurnInfo = false, showContactCircles = true, scale = 60 } = options;

    const carGroup = new this.paper.Group();
    carGroup.applyMatrix = false;

    const body = this._drawBody(state, model);
    const wheels = this._drawWheels(state, model);

    carGroup.addChildren([body, ...wheels]);

    this.layers.car.addChild(carGroup);
    carGroup.position = this.paper.view.center;
    carGroup.scale(scale);

    const overlayGroup = new this.paper.Group();
    overlayGroup.applyMatrix = false;
    this.layers.overlay.addChild(overlayGroup);
    overlayGroup.matrix = carGroup.matrix.clone();

    this.background.remove();
    this.background = new this.paper.Path.Rectangle({
      from: this.paper.view.bounds.topLeft,
      to: this.paper.view.bounds.bottomRight,
      fillColor: "#f5f1ea",
    });
    this.layers.background.addChild(this.background);

    if (showContactCircles) {
      const contact = this._drawContactCircles(state, model);
      if (contact) {
        overlayGroup.addChild(contact);
      }
    }
    if (showTurnInfo) {
      const turnGroup = this._drawTurnInfo(state, model);
      if (turnGroup) {
        overlayGroup.addChild(turnGroup);
      }
    }

    this.paper.view.update();
  }

  _drawBody(state, model) {
    const poly = model.getBodyPolygon(state);
    const path = new this.paper.Path({
      segments: poly.map((p) => new this.paper.Point(p.x, -p.y)),
      closed: true,
      strokeColor: "#1c1b1a",
      strokeWidth: 0.04,
      fillColor: "#c6c4c2",
    });

    const outline = path.clone();
    outline.strokeColor = "#141312";
    outline.strokeWidth = 0.07;
    outline.fillColor = null;

    const group = new this.paper.Group([path, outline]);
    return group;
  }

  _drawWheels(state, model) {
    const { wheelLength, wheelWidth } = model.config;
    const wheels = model.getWheelPositions(state);
    const steer = state.steer;

    const drawWheel = (position, angle) => {
      const rect = new this.paper.Path.Rectangle({
        point: new this.paper.Point(-wheelLength / 2, -wheelWidth / 2),
        size: new this.paper.Size(wheelLength, wheelWidth),
        radius: wheelWidth * 0.2,
        fillColor: "#1f1f1f",
        strokeColor: "#101010",
        strokeWidth: 0.02,
      });
      rect.rotate(-radToDeg(angle));
      rect.position = new this.paper.Point(position.x, -position.y);
      return rect;
    };

    return [
      drawWheel(wheels.rearLeft, state.heading),
      drawWheel(wheels.rearRight, state.heading),
      drawWheel(wheels.frontLeft, state.heading + steer),
      drawWheel(wheels.frontRight, state.heading + steer),
    ];
  }

  _drawTurnInfo(state, model) {
    const info = model.getTurningRadii(state);
    if (!info) {
      return null;
    }

    const { radius, inner, outer } = info;
    const color = "#b34b2e";

    const iccX = state.x - radius * Math.sin(state.heading);
    const iccY = state.y + radius * Math.cos(state.heading);

    const innerPath = new this.paper.Path.Circle({
      center: new this.paper.Point(iccX, -iccY),
      radius: inner,
      strokeColor: color,
      dashArray: [0.15, 0.15],
      strokeWidth: 0.02,
    });
    const outerPath = new this.paper.Path.Circle({
      center: new this.paper.Point(iccX, -iccY),
      radius: outer,
      strokeColor: color,
      dashArray: [0.15, 0.15],
      strokeWidth: 0.02,
    });

    const centerDot = new this.paper.Path.Circle({
      center: new this.paper.Point(iccX, -iccY),
      radius: 0.06,
      fillColor: color,
    });

    return new this.paper.Group([innerPath, outerPath, centerDot]);
  }

  _drawContactCircles(state, model) {
    const info = model.getTurningRadii(state);
    if (!info) {
      return null;
    }

    const wheels = model.getWheelPositions(state);
    const { wheelWidth } = model.config;

    const R = info.radius;
    const turnRight = R < 0;

    const body = model.getBodyPolygon(state);
    const halfBody = model.config.bodyWidth / 2;
    const outerSide = turnRight ? halfBody : -halfBody;
    const innerSide = -outerSide;

    let outerChassisPoint = body[1]; // front-left corner
    if (!turnRight) {
      outerChassisPoint = body[2]; // front-right corner
    }

    // Inner extent is the chassis near the inner wheel well at rear axle center.
    const innerChassisPoint = model.toWorld(state, 0, innerSide);

    const iccX = state.x - R * Math.sin(state.heading);
    const iccY = state.y + R * Math.cos(state.heading);

    const trackCircle = (point, color) => {
      const radius = Math.hypot(point.x - iccX, point.y - iccY);
      return new this.paper.Path.Circle({
        center: new this.paper.Point(iccX, -iccY),
        radius,
        strokeColor: color,
        strokeWidth: wheelWidth,
        fillColor: null,
        opacity: 0.2,
      });
    };

    const rearLeft = trackCircle(wheels.rearLeft, "#3a6ea5");
    const rearRight = trackCircle(wheels.rearRight, "#3a6ea5");
    const frontLeft = trackCircle(wheels.frontLeft, "#3a9f66");
    const frontRight = trackCircle(wheels.frontRight, "#3a9f66");

    const chassisCircle = (point) => {
      const radius = Math.hypot(point.x - iccX, point.y - iccY);
      return new this.paper.Path.Circle({
        center: new this.paper.Point(iccX, -iccY),
        radius,
        strokeColor: "#b34b2e",
        strokeWidth: 0.05,
        fillColor: null,
        opacity: 0.8,
      });
    };

    const outer = chassisCircle(outerChassisPoint);
    const inner = chassisCircle(innerChassisPoint);

    return new this.paper.Group([
      rearLeft,
      rearRight,
      frontLeft,
      frontRight,
      outer,
      inner,
    ]);
  }
}
