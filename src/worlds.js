export const EMPTY_WORLD = {
  name: "Empty",
  objects: [],
};

function addParkingRow(objects, { x, y, spaces, stallWidth, stallDepth, angle = 0 }) {
  for (let i = 0; i < spaces; i += 1) {
    const sx = x + i * stallWidth;
    objects.push({
      type: "rect",
      x: sx,
      y,
      width: stallWidth,
      height: stallDepth,
      fill: null,
      stroke: "#d6d1c9",
      strokeWidth: 0.03,
      rotation: angle,
    });
  }
}

function addParkedCar(objects, { x, y, width, height, color = "#9aa3a9" }) {
  objects.push({
    type: "rect",
    x,
    y,
    width,
    height,
    fill: color,
    stroke: "#4a4f55",
    strokeWidth: 0.03,
    solid: true,
    kind: "car",
  });
}

export const PARKING_LOT_WORLD = (() => {
  const objects = [];
  const carWidth = 73.5;
  const carLength = 184.8;
  const spotWidth = 8.5 * 12;
  const spotHeight = 18 * 12;
  const spotPadding = Math.max(0, (spotWidth - carWidth) / 2);
  const aisleHeight = 24 * 12;
  const curbHeight = carWidth * 0.3;
  const spaces = 12;
  const lotWidth = spotWidth * spaces;
  const lotHeight = curbHeight * 2 + spotHeight * 2 + aisleHeight;
  const stroke = carWidth * 0.015;

  const lotTop = lotHeight / 2;
  const lotBottom = -lotHeight / 2;
  const northCurbBottom = lotTop - curbHeight;
  const northRowBottom = northCurbBottom - spotHeight;
  const aisleTop = northRowBottom;
  const aisleBottom = aisleTop - aisleHeight;
  const southRowBottom = aisleBottom - spotHeight;
  const southCurbBottom = southRowBottom - curbHeight;

  // asphalt background
  objects.push({
    type: "rect",
    x: -lotWidth / 2,
    y: lotBottom,
    width: lotWidth,
    height: lotHeight,
    fill: "#dad3c9",
    stroke: "#cbbfb2",
    strokeWidth: stroke * 1.5,
  });

  // curbs
  objects.push({
    type: "rect",
    x: -lotWidth / 2,
    y: northCurbBottom,
    width: lotWidth,
    height: curbHeight,
    fill: "#bfb3a5",
    stroke: "#a89988",
    strokeWidth: stroke,
    solid: true,
  });
  objects.push({
    type: "rect",
    x: -lotWidth / 2,
    y: southCurbBottom,
    width: lotWidth,
    height: curbHeight,
    fill: "#bfb3a5",
    stroke: "#a89988",
    strokeWidth: stroke,
    solid: true,
  });

  // center driving lane line
  objects.push({
    type: "line",
    x1: -lotWidth / 2,
    y1: (aisleTop + aisleBottom) / 2,
    x2: lotWidth / 2,
    y2: (aisleTop + aisleBottom) / 2,
    stroke: "#c7bcae",
    strokeWidth: stroke * 1.5,
    dash: [carWidth * 0.15, carWidth * 0.175],
  });

  // parking rows (north/south)
  addParkingRow(objects, {
    x: -lotWidth / 2,
    y: northRowBottom,
    spaces,
    stallWidth: spotWidth,
    stallDepth: spotHeight,
  });
  addParkingRow(objects, {
    x: -lotWidth / 2,
    y: southRowBottom,
    spaces,
    stallWidth: spotWidth,
    stallDepth: spotHeight,
  });

  // parked cars north row
  for (let i = 0; i < spaces; i += 1) {
    if (i === 3 || i === 6) {
      continue;
    }
    addParkedCar(objects, {
      x: -lotWidth / 2 + i * spotWidth + spotPadding,
      y: northRowBottom + spotPadding,
      width: carWidth,
      height: carLength,
      color: i % 2 === 0 ? "#9aa3a9" : "#8d8a85",
    });
  }

  // parked cars south row
  for (let i = 0; i < spaces; i += 1) {
    if (i === 4 || i === 8) {
      continue;
    }
    addParkedCar(objects, {
      x: -lotWidth / 2 + i * spotWidth + spotPadding,
      y: southRowBottom + spotPadding,
      width: carWidth,
      height: carLength,
      color: i % 2 === 0 ? "#a28a78" : "#7f8a8f",
    });
  }

  return {
    name: "Parking Lot",
    objects,
    start: {
      x: 0,
      y: (aisleTop + aisleBottom) / 2 + aisleHeight * 0.25,
      heading: 0,
      steer: 0,
    },
    camera: {
      x: 0,
      y: (aisleTop + aisleBottom) / 2,
      zoom: 0.6,
    },
  };
})();

export const TIGHT_PARKING_LOT_WORLD = (() => {
  const objects = [];
  const carWidth = 73.5;
  const carLength = 184.8;
  const spotWidth = 7.5 * 12;
  const spotHeight = 16 * 12;
  const spotPadding = Math.max(0, (spotWidth - carWidth) / 2);
  const aisleHeight = 24 * 12;
  const curbHeight = carWidth * 0.3;
  const spaces = 12;
  const lotWidth = spotWidth * spaces;
  const lotHeight = curbHeight * 2 + spotHeight * 2 + aisleHeight;
  const stroke = carWidth * 0.015;

  const lotTop = lotHeight / 2;
  const lotBottom = -lotHeight / 2;
  const northCurbBottom = lotTop - curbHeight;
  const northRowBottom = northCurbBottom - spotHeight;
  const aisleTop = northRowBottom;
  const aisleBottom = aisleTop - aisleHeight;
  const southRowBottom = aisleBottom - spotHeight;
  const southCurbBottom = southRowBottom - curbHeight;

  objects.push({
    type: "rect",
    x: -lotWidth / 2,
    y: lotBottom,
    width: lotWidth,
    height: lotHeight,
    fill: "#dad3c9",
    stroke: "#cbbfb2",
    strokeWidth: stroke * 1.5,
  });

  objects.push({
    type: "rect",
    x: -lotWidth / 2,
    y: northCurbBottom,
    width: lotWidth,
    height: curbHeight,
    fill: "#bfb3a5",
    stroke: "#a89988",
    strokeWidth: stroke,
    solid: true,
  });
  objects.push({
    type: "rect",
    x: -lotWidth / 2,
    y: southCurbBottom,
    width: lotWidth,
    height: curbHeight,
    fill: "#bfb3a5",
    stroke: "#a89988",
    strokeWidth: stroke,
    solid: true,
  });

  objects.push({
    type: "line",
    x1: -lotWidth / 2,
    y1: (aisleTop + aisleBottom) / 2,
    x2: lotWidth / 2,
    y2: (aisleTop + aisleBottom) / 2,
    stroke: "#c7bcae",
    strokeWidth: stroke * 1.5,
    dash: [carWidth * 0.15, carWidth * 0.175],
  });

  addParkingRow(objects, {
    x: -lotWidth / 2,
    y: northRowBottom,
    spaces,
    stallWidth: spotWidth,
    stallDepth: spotHeight,
  });
  addParkingRow(objects, {
    x: -lotWidth / 2,
    y: southRowBottom,
    spaces,
    stallWidth: spotWidth,
    stallDepth: spotHeight,
  });

  for (let i = 0; i < spaces; i += 1) {
    if (i === 4 || i === 7) {
      continue;
    }
    addParkedCar(objects, {
      x: -lotWidth / 2 + i * spotWidth + spotPadding,
      y: northRowBottom + spotPadding,
      width: carWidth,
      height: carLength,
      color: i % 2 === 0 ? "#9aa3a9" : "#8d8a85",
    });
  }

  for (let i = 0; i < spaces; i += 1) {
    if (i === 2 || i === 8) {
      continue;
    }
    addParkedCar(objects, {
      x: -lotWidth / 2 + i * spotWidth + spotPadding,
      y: southRowBottom + spotPadding,
      width: carWidth,
      height: carLength,
      color: i % 2 === 0 ? "#a28a78" : "#7f8a8f",
    });
  }

  return {
    name: "Tight Parking Lot",
    objects,
    start: {
      x: 0,
      y: (aisleTop + aisleBottom) / 2 + aisleHeight * 0.25,
      heading: 0,
      steer: 0,
    },
    camera: {
      x: 0,
      y: (aisleTop + aisleBottom) / 2,
      zoom: 0.6,
    },
  };
})();

export const APARTMENT_PARKING_WORLD = (() => {
  const objects = [];
  const carWidth = 73.5;
  const carLength = 184.8;
  const drivewayWidth = 108;
  const totalWidth = 1128;
  const buildingWidth = totalWidth - 2 * drivewayWidth;
  const buildingHeight = 1.5 * carLength * 2;
  const courtyardHeight = 180;
  const courtyardWidth = 648;
  const courtyardWidthNorth = 648 - 144;
  const lotHeight = 306;
  const gap = (lotHeight - 2 * carWidth) / 3;
  const roadHeight = carWidth * 1.6 * 3;

  const buildingTop = carWidth * 3;
  const buildingBottom = buildingTop - buildingHeight;
  const courtyardTop = buildingBottom;
  const courtyardBottom = courtyardTop - courtyardHeight;
  const courtyardLeft = -courtyardWidth / 2;
  const courtyardRight = courtyardWidth / 2;
  const courtyardLeftNorth = -courtyardWidthNorth / 2;
  const courtyardRightNorth = courtyardWidthNorth / 2;
  const lotTop = courtyardBottom;
  const lotBottom = lotTop - lotHeight;
  const spotHeight = 120;
  const spotWidth = 240;
  const spotGapSouth = lotHeight - spotHeight * 2;
  const spotsLeft = -spotWidth;
  const spotsTopRowY = lotTop - spotHeight;
  const spotsBottomRowY = spotsTopRowY - spotHeight;
  const spotCenters = {
    NW: { x: -spotWidth / 2, y: spotsTopRowY + spotHeight / 2 },
    NE: { x: spotWidth / 2, y: spotsTopRowY + spotHeight / 2 },
    SW: { x: -spotWidth / 2, y: spotsBottomRowY + spotHeight / 2 },
    SE: { x: spotWidth / 2, y: spotsBottomRowY + spotHeight / 2 },
  };

  // ground
  objects.push({
    type: "rect",
    x: -totalWidth / 2 - carWidth,
    y: lotBottom - carWidth * 2,
    width: totalWidth + carWidth * 2,
    height: (buildingTop + roadHeight) - (lotBottom - carWidth * 2),
    fill: "#f3eee6",
    stroke: "#cbbfb2",
    strokeWidth: carWidth * 0.015,
  });

  // gravel pad (driveways + parking area)
  objects.push({
    type: "rect",
    x: -totalWidth / 2,
    y: lotBottom,
    width: totalWidth,
    height: (buildingTop - lotBottom),
    fill: "#c2beb6",
    stroke: null,
  });

  const wallThickness = 24;
  // perimeter walls around gravel pad
  objects.push({
    type: "rect",
    x: -totalWidth / 2 - wallThickness,
    y: lotBottom - wallThickness,
    width: totalWidth + wallThickness * 2,
    height: wallThickness,
    fill: "#8f857a",
    stroke: "#6f6458",
    strokeWidth: carWidth * 0.01,
    solid: true,
  });
  objects.push({
    type: "rect",
    x: -totalWidth / 2 - wallThickness,
    y: buildingTop,
    width: totalWidth + wallThickness * 2,
    height: wallThickness,
    fill: "#8f857a",
    stroke: "#6f6458",
    strokeWidth: carWidth * 0.01,
    solid: false,
  });
  objects.push({
    type: "rect",
    x: -totalWidth / 2 - wallThickness,
    y: lotBottom - wallThickness,
    width: wallThickness,
    height: buildingTop - lotBottom + wallThickness * 2,
    fill: "#8f857a",
    stroke: "#6f6458",
    strokeWidth: carWidth * 0.01,
    solid: true,
  });
  objects.push({
    type: "rect",
    x: totalWidth / 2,
    y: lotBottom - wallThickness,
    width: wallThickness,
    height: buildingTop - lotBottom + wallThickness * 2,
    fill: "#8f857a",
    stroke: "#6f6458",
    strokeWidth: carWidth * 0.01,
    solid: true,
  });

  // road north of building
  objects.push({
    type: "rect",
    x: -totalWidth / 2 - carWidth,
    y: buildingTop,
    width: totalWidth + carWidth * 2,
    height: roadHeight,
    fill: "#c2beb6",
    stroke: "#c7bcae",
    strokeWidth: carWidth * 0.012,
  });

  // building block
  objects.push({
    type: "rect",
    x: -buildingWidth / 2,
    y: buildingBottom,
    width: buildingWidth,
    height: buildingHeight,
    fill: "#ffffff",
    stroke: "#9a8b7c",
    strokeWidth: carWidth * 0.012,
    solid: true,
  });

  // driveways left/right (north to south along building + courtyard)
  objects.push({
    type: "rect",
    x: -buildingWidth / 2 - drivewayWidth,
    y: courtyardBottom,
    width: drivewayWidth,
    height: buildingHeight + courtyardHeight,
    fill: null,
    stroke: "#c7bcae",
    strokeWidth: carWidth * 0.012,
  });
  objects.push({
    type: "rect",
    x: buildingWidth / 2,
    y: courtyardBottom,
    width: drivewayWidth,
    height: buildingHeight + courtyardHeight,
    fill: null,
    stroke: "#c7bcae",
    strokeWidth: carWidth * 0.012,
  });

  // courtyard fill
  objects.push({
    type: "rect",
    x: courtyardLeft,
    y: courtyardBottom,
    width: courtyardWidth,
    height: courtyardHeight,
    fill: "#e2d9cf",
    stroke: "#c7bcae",
    strokeWidth: carWidth * 0.012,
    solid: true,
  });
  // courtyard fill (north clone)
  objects.push({
    type: "rect",
    x: courtyardLeftNorth,
    y: courtyardBottom + courtyardHeight,
    width: courtyardWidthNorth,
    height: courtyardHeight,
    fill: "#e2d9cf",
    stroke: "#c7bcae",
    strokeWidth: carWidth * 0.012,
    solid: true,
  });

  // courtyard walls (lines)
  objects.push({
    type: "line",
    x1: courtyardLeft,
    y1: courtyardTop,
    x2: courtyardRight,
    y2: courtyardTop,
    stroke: "#9a8b7c",
    strokeWidth: carWidth * 0.02,
  });
  objects.push({
    type: "line",
    x1: courtyardLeftNorth,
    y1: courtyardTop + courtyardHeight,
    x2: courtyardRightNorth,
    y2: courtyardTop + courtyardHeight,
    stroke: "#9a8b7c",
    strokeWidth: carWidth * 0.02,
  });
  objects.push({
    type: "line",
    x1: courtyardLeft,
    y1: courtyardBottom,
    x2: courtyardRight,
    y2: courtyardBottom,
    stroke: "#9a8b7c",
    strokeWidth: carWidth * 0.02,
  });
  objects.push({
    type: "line",
    x1: courtyardLeft,
    y1: courtyardBottom,
    x2: courtyardLeft,
    y2: courtyardTop,
    stroke: "#9a8b7c",
    strokeWidth: carWidth * 0.02,
  });
  objects.push({
    type: "line",
    x1: courtyardLeftNorth,
    y1: courtyardTop,
    x2: courtyardLeftNorth,
    y2: courtyardTop + courtyardHeight,
    stroke: "#9a8b7c",
    strokeWidth: carWidth * 0.02,
  });
  objects.push({
    type: "line",
    x1: courtyardRight,
    y1: courtyardBottom,
    x2: courtyardRight,
    y2: courtyardTop,
    stroke: "#9a8b7c",
    strokeWidth: carWidth * 0.02,
  });
  objects.push({
    type: "line",
    x1: courtyardRightNorth,
    y1: courtyardTop,
    x2: courtyardRightNorth,
    y2: courtyardTop + courtyardHeight,
    stroke: "#9a8b7c",
    strokeWidth: carWidth * 0.02,
  });

  // 2x2 dotted parking rectangles (10ft x 20ft) against courtyard wall
  for (let row = 0; row < 2; row += 1) {
    for (let col = 0; col < 2; col += 1) {
      objects.push({
        type: "rect",
        x: spotsLeft + col * spotWidth,
        y: spotsTopRowY - row * spotHeight,
        width: spotWidth,
        height: spotHeight,
        fill: null,
        stroke: "#9b8f82",
        strokeWidth: carWidth * 0.02,
        dash: [24, 16],
      });
    }
  }

  // dotted car outlines centered in each spot
  const dottedCarWidth = carLength;
  const dottedCarHeight = carWidth;
  for (let row = 0; row < 2; row += 1) {
    for (let col = 0; col < 2; col += 1) {
      objects.push({
        type: "rect",
        x: spotsLeft + col * spotWidth + (spotWidth - dottedCarWidth) / 2,
        y: spotsTopRowY - row * spotHeight + (spotHeight - dottedCarHeight) / 2,
        width: dottedCarWidth,
        height: dottedCarHeight,
        fill: null,
        stroke: "#b2a79b",
        strokeWidth: carWidth * 0.015,
        dash: [18, 12],
      });
    }
  }

  return {
    name: "Apartment Parking",
    objects,
    offset: { x: 0, y: 0 },
    spots: spotCenters,
    cameraFn: (view) => {
      const minX = -totalWidth / 2 - carWidth;
      const maxX = totalWidth / 2 + carWidth;
      const minY = lotBottom - carWidth * 2;
      const maxY = buildingTop + roadHeight;
      const worldWidth = maxX - minX;
      const worldHeight = maxY - minY;
      const padding = 140;
      const zoomX = (view.width - padding * 2) / worldWidth;
      const zoomY = (view.height - padding * 2) / worldHeight;
      return {
        x: (minX + maxX) / 2,
        y: (minY + maxY) / 2 - 420,
        zoom: Math.max(0.1, Math.min(zoomX, zoomY)) * 0.6,
      };
    },
  };
})();
