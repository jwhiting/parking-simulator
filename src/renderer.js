import { radToDeg } from "./core.js";

export class PaperRenderer {
  constructor(paperScope, config = {}) {
    this.paper = paperScope;
    this.config = config;
    this.layers = {
      background: new this.paper.Layer(),
      world: new this.paper.Layer(),
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
    this.layers.world.removeChildren();
    this.layers.car.removeChildren();
    this.layers.overlay.removeChildren();
  }

  render(state, model, options = {}) {
    this.clear();
    const {
      showTurnInfo = false,
      showContactCircles = true,
      scale = 60,
      camera = { x: 0, y: 0 },
      world = null,
      collisionPoint = null,
    } = options;

    const carGroup = new this.paper.Group();
    carGroup.applyMatrix = false;

    const body = this._drawBody(state, model);
    const wheels = this._drawWheels(state, model);

    carGroup.addChildren([body, ...wheels]);

    if (world) {
      this._drawWorld(world);
    }

    this.layers.car.addChild(carGroup);

    const overlayGroup = new this.paper.Group();
    overlayGroup.applyMatrix = false;
    this.layers.overlay.addChild(overlayGroup);

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

    if (collisionPoint) {
      overlayGroup.addChild(this._drawCollisionMarker(collisionPoint));
    }

    this.paper.view.zoom = scale;
    this.paper.view.center = new this.paper.Point(camera.x, -camera.y);
    this.paper.view.draw();
    this.paper.view.update();
  }

  _drawCollisionMarker(point) {
    const circle = new this.paper.Path.Circle({
      center: new this.paper.Point(point.x, -point.y),
      radius: 18,
      strokeColor: "#d12c2c",
      strokeWidth: 6,
      fillColor: null,
    });
    const group = new this.paper.Group([circle]);
    if (point.amount) {
      const label = new this.paper.PointText({
        point: new this.paper.Point(point.x + 22, -point.y - 10),
        content: `$${point.amount}`,
        fillColor: "#d12c2c",
        fontSize: 42,
        fontWeight: "bold",
      });
      group.addChild(label);
    }
    return group;
  }

  _drawBody(state, model) {
    const poly = model.getBodyPolygon(state);
    const path = new this.paper.Path({
      segments: poly.map((p) => new this.paper.Point(p.x, -p.y)),
      closed: true,
      strokeColor: "#1c1b1a",
      strokeWidth: 0.04,
      fillColor: "#f8f6f2",
    });

    const outline = path.clone();
    outline.strokeColor = "#141312";
    outline.strokeWidth = 0.07;
    outline.fillColor = null;

    const { bodyLength, bodyWidth, rearOverhang, wheelbase, wheelLength } = model.config;
    const rear = -rearOverhang;
    const front = rear + bodyLength;
    const halfWidth = bodyWidth / 2;

    const windshieldMargin = 6;
    const windshieldDepth = wheelLength;
    const windshieldFrontX = wheelbase - 0.45 - 12;
    const windshieldRearX = windshieldFrontX - windshieldDepth;
    const windshieldLocal = [
      { x: windshieldRearX, y: halfWidth - windshieldMargin },
      { x: windshieldFrontX, y: halfWidth - windshieldMargin },
      { x: windshieldFrontX, y: -(halfWidth - windshieldMargin) },
      { x: windshieldRearX, y: -(halfWidth - windshieldMargin) },
    ];
    const windshieldWorld = windshieldLocal.map((p) => model.toWorld(state, p.x, p.y));
    const windshield = new this.paper.Path({
      segments: windshieldWorld.map((p) => new this.paper.Point(p.x, -p.y)),
      closed: true,
      fillColor: "#2b3a45",
      strokeColor: "#111111",
      strokeWidth: 1,
    });

    const driverLocalX = (windshieldFrontX + windshieldRearX) / 2;
    const driverLocalY = Math.min(halfWidth * 0.45, halfWidth - windshieldMargin - 4);
    const driverWorld = model.toWorld(state, driverLocalX, driverLocalY);
    const driver = new this.paper.Path.Circle({
      center: new this.paper.Point(driverWorld.x, -driverWorld.y),
      radius: 4,
      fillColor: "#d9b39a",
      strokeColor: "#6d5348",
      strokeWidth: 1,
    });

    const group = new this.paper.Group([path, outline, windshield, driver]);
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
      return this._drawContactLines(state, model);
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
        strokeWidth: 2,
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

  _drawContactLines(state, model) {
    const wheels = model.getWheelPositions(state);
    const { wheelWidth, bodyWidth } = model.config;
    const halfBody = bodyWidth / 2;
    const outerSide = halfBody;
    const innerSide = -halfBody;

    const outerChassisPoint = model.toWorld(state, model.config.wheelbase, outerSide);
    const innerChassisPoint = model.toWorld(state, 0, innerSide);

    const dir = {
      x: Math.cos(state.heading),
      y: Math.sin(state.heading),
    };
    const lineSpan = model.config.bodyLength * 3;

    const lineThrough = (point, color, width, opacity = 0.2) =>
      new this.paper.Path.Line({
        from: new this.paper.Point(
          point.x - dir.x * lineSpan,
          -(point.y - dir.y * lineSpan)
        ),
        to: new this.paper.Point(
          point.x + dir.x * lineSpan,
          -(point.y + dir.y * lineSpan)
        ),
        strokeColor: color,
        strokeWidth: width,
        opacity,
      });

    const rearLeft = lineThrough(wheels.rearLeft, "#3a6ea5", wheelWidth, 0.2);
    const rearRight = lineThrough(wheels.rearRight, "#3a6ea5", wheelWidth, 0.2);
    const frontLeft = lineThrough(wheels.frontLeft, "#3a9f66", wheelWidth, 0.2);
    const frontRight = lineThrough(wheels.frontRight, "#3a9f66", wheelWidth, 0.2);

    const outer = lineThrough(outerChassisPoint, "#b34b2e", 2, 0.8);
    const inner = lineThrough(innerChassisPoint, "#b34b2e", 2, 0.8);

    return new this.paper.Group([
      rearLeft,
      rearRight,
      frontLeft,
      frontRight,
      outer,
      inner,
    ]);
  }

  _drawWorld(world) {
    const layer = this.layers.world;
    if (!world || !world.objects) {
      return;
    }
    const offset = world.offset || { x: 0, y: 0 };

    world.objects.forEach((obj) => {
      if (obj.type === "rect") {
        const path = new this.paper.Path.Rectangle({
          from: new this.paper.Point(obj.x + offset.x, -(obj.y + offset.y)),
          to: new this.paper.Point(
            obj.x + obj.width + offset.x,
            -(obj.y + obj.height + offset.y)
          ),
          fillColor: obj.fill || null,
          strokeColor: obj.stroke || null,
          strokeWidth: obj.strokeWidth || 0.02,
        });
        if (obj.dash) {
          path.dashArray = obj.dash;
        }
        if (obj.rotation) {
          path.rotate(-obj.rotation);
        }
        layer.addChild(path);
      } else if (obj.type === "line") {
        const path = new this.paper.Path.Line({
          from: new this.paper.Point(obj.x1 + offset.x, -(obj.y1 + offset.y)),
          to: new this.paper.Point(obj.x2 + offset.x, -(obj.y2 + offset.y)),
          strokeColor: obj.stroke || "#d6d1c9",
          strokeWidth: obj.strokeWidth || 0.03,
          dashArray: obj.dash || null,
        });
        layer.addChild(path);
      } else if (obj.type === "poly") {
        const path = new this.paper.Path({
          segments: obj.points.map(
            (p) => new this.paper.Point(p.x + offset.x, -(p.y + offset.y))
          ),
          closed: true,
          fillColor: obj.fill || null,
          strokeColor: obj.stroke || null,
          strokeWidth: obj.strokeWidth || 0.02,
        });
        layer.addChild(path);
      }
    });
  }
}
