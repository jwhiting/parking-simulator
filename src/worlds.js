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
  });
}

export const PARKING_LOT_WORLD = (() => {
  const objects = [];
  const stallWidth = 3.0;
  const stallDepth = 5.6;
  const carWidth = 2.0;
  const carLength = 4.8;
  const lotWidth = 44;
  const lotHeight = 40;

  // asphalt background
  objects.push({
    type: "rect",
    x: -lotWidth / 2,
    y: -lotHeight / 2,
    width: lotWidth,
    height: lotHeight,
    fill: "#dad3c9",
    stroke: "#cbbfb2",
    strokeWidth: 0.05,
  });

  // center driving lane lines
  objects.push({
    type: "line",
    x1: -lotWidth / 2 + 2,
    y1: 0,
    x2: lotWidth / 2 - 2,
    y2: 0,
    stroke: "#c7bcae",
    strokeWidth: 0.05,
    dash: [0.3, 0.35],
  });

  // parking rows (top and bottom)
  addParkingRow(objects, {
    x: -18,
    y: 3.0,
    spaces: 10,
    stallWidth,
    stallDepth,
  });
  addParkingRow(objects, {
    x: -18,
    y: -(stallDepth + 3.0),
    spaces: 10,
    stallWidth,
    stallDepth,
  });

  // parked cars top row
  for (let i = 0; i < 10; i += 1) {
    if (i === 3 || i === 6) {
      continue; // open spots
    }
    addParkedCar(objects, {
      x: -18 + i * stallWidth + (stallWidth - carWidth) / 2,
      y: 3.2,
      width: carWidth,
      height: carLength,
      color: i % 2 === 0 ? "#9aa3a9" : "#8d8a85",
    });
  }

  // parked cars bottom row
  for (let i = 0; i < 10; i += 1) {
    if (i === 4 || i === 8) {
      continue; // open spots
    }
    addParkedCar(objects, {
      x: -18 + i * stallWidth + (stallWidth - carWidth) / 2,
      y: -(stallDepth + 2.7),
      width: carWidth,
      height: carLength,
      color: i % 2 === 0 ? "#a28a78" : "#7f8a8f",
    });
  }

  // curbs
  objects.push({
    type: "rect",
    x: -lotWidth / 2 + 1,
    y: stallDepth + 4.5,
    width: lotWidth - 2,
    height: 0.6,
    fill: "#bfb3a5",
    stroke: "#a89988",
    strokeWidth: 0.02,
  });
  objects.push({
    type: "rect",
    x: -lotWidth / 2 + 1,
    y: -(stallDepth + 5.1),
    width: lotWidth - 2,
    height: 0.6,
    fill: "#bfb3a5",
    stroke: "#a89988",
    strokeWidth: 0.02,
  });

  return {
    name: "Parking Lot",
    objects,
  };
})();

export const TIGHT_PARKING_LOT_WORLD = (() => {
  const objects = [];
  const stallWidth = 2.6;
  const stallDepth = 5.2;
  const carWidth = 2.0;
  const carLength = 4.8;
  const lotWidth = 40;
  const lotHeight = 36;

  objects.push({
    type: "rect",
    x: -lotWidth / 2,
    y: -lotHeight / 2,
    width: lotWidth,
    height: lotHeight,
    fill: "#dad3c9",
    stroke: "#cbbfb2",
    strokeWidth: 0.05,
  });

  objects.push({
    type: "line",
    x1: -lotWidth / 2 + 2,
    y1: 0,
    x2: lotWidth / 2 - 2,
    y2: 0,
    stroke: "#c7bcae",
    strokeWidth: 0.05,
    dash: [0.3, 0.35],
  });

  addParkingRow(objects, {
    x: -16.5,
    y: 2.6,
    spaces: 10,
    stallWidth,
    stallDepth,
  });
  addParkingRow(objects, {
    x: -16.5,
    y: -(stallDepth + 2.6),
    spaces: 10,
    stallWidth,
    stallDepth,
  });

  for (let i = 0; i < 10; i += 1) {
    if (i === 4 || i === 7) {
      continue;
    }
    addParkedCar(objects, {
      x: -16.5 + i * stallWidth + (stallWidth - carWidth) / 2,
      y: 2.9,
      width: carWidth,
      height: carLength,
      color: i % 2 === 0 ? "#9aa3a9" : "#8d8a85",
    });
  }

  for (let i = 0; i < 10; i += 1) {
    if (i === 2 || i === 8) {
      continue;
    }
    addParkedCar(objects, {
      x: -16.5 + i * stallWidth + (stallWidth - carWidth) / 2,
      y: -(stallDepth + 2.3),
      width: carWidth,
      height: carLength,
      color: i % 2 === 0 ? "#a28a78" : "#7f8a8f",
    });
  }

  objects.push({
    type: "rect",
    x: -lotWidth / 2 + 1,
    y: stallDepth + 4.0,
    width: lotWidth - 2,
    height: 0.6,
    fill: "#bfb3a5",
    stroke: "#a89988",
    strokeWidth: 0.02,
  });
  objects.push({
    type: "rect",
    x: -lotWidth / 2 + 1,
    y: -(stallDepth + 4.4),
    width: lotWidth - 2,
    height: 0.6,
    fill: "#bfb3a5",
    stroke: "#a89988",
    strokeWidth: 0.02,
  });

  return {
    name: "Tight Parking Lot",
    objects,
  };
})();

export const APARTMENT_PARKING_WORLD = (() => {
  const objects = [];
  const carWidth = 2.0;
  const carLength = 4.8;
  const buildingWidth = 4 * carLength;
  const buildingHeight = 1.5 * carLength;
  const drivewayPadding = carWidth * 0.2;
  const drivewayWidth = carWidth + 2 * drivewayPadding;
  const courtyardHeight = carLength;
  const gap = carWidth * 0.5;
  const lotHeight = 2 * carWidth + 3 * gap;
  const totalWidth = buildingWidth + 2 * drivewayWidth;
  const roadHeight = carWidth + 1.2;

  const buildingTop = 6.0;
  const buildingBottom = buildingTop - buildingHeight;
  const courtyardTop = buildingBottom;
  const courtyardBottom = courtyardTop - courtyardHeight;
  const lotTop = courtyardBottom;
  const lotBottom = lotTop - lotHeight;
  const midY = lotTop - gap - carWidth - gap / 2;
  const seSpotCenter = {
    x: totalWidth / 4,
    y: (lotBottom + midY) / 2,
  };

  // ground
  objects.push({
    type: "rect",
    x: -totalWidth / 2 - 2,
    y: lotBottom - 4,
    width: totalWidth + 4,
    height: (buildingTop + roadHeight) - (lotBottom - 4),
    fill: "#dad3c9",
    stroke: "#cbbfb2",
    strokeWidth: 0.05,
  });

  // road north of building
  objects.push({
    type: "rect",
    x: -totalWidth / 2 - 2,
    y: buildingTop,
    width: totalWidth + 4,
    height: roadHeight,
    fill: "#e2d9cf",
    stroke: "#c7bcae",
    strokeWidth: 0.03,
  });

  // building block
  objects.push({
    type: "rect",
    x: -buildingWidth / 2,
    y: buildingBottom,
    width: buildingWidth,
    height: buildingHeight,
    fill: "#c5b8a9",
    stroke: "#9a8b7c",
    strokeWidth: 0.04,
  });

  // driveways left/right (north to south along building + courtyard)
  objects.push({
    type: "rect",
    x: -buildingWidth / 2 - drivewayWidth,
    y: courtyardBottom,
    width: drivewayWidth,
    height: buildingHeight + courtyardHeight,
    fill: "#e2d9cf",
    stroke: "#c7bcae",
    strokeWidth: 0.03,
  });
  objects.push({
    type: "rect",
    x: buildingWidth / 2,
    y: courtyardBottom,
    width: drivewayWidth,
    height: buildingHeight + courtyardHeight,
    fill: "#e2d9cf",
    stroke: "#c7bcae",
    strokeWidth: 0.03,
  });

  // courtyard walls (lines)
  objects.push({
    type: "line",
    x1: -buildingWidth / 2,
    y1: courtyardTop,
    x2: buildingWidth / 2,
    y2: courtyardTop,
    stroke: "#9a8b7c",
    strokeWidth: 0.06,
  });
  objects.push({
    type: "line",
    x1: -buildingWidth / 2,
    y1: courtyardBottom,
    x2: buildingWidth / 2,
    y2: courtyardBottom,
    stroke: "#9a8b7c",
    strokeWidth: 0.06,
  });
  objects.push({
    type: "line",
    x1: -buildingWidth / 2,
    y1: courtyardBottom,
    x2: -buildingWidth / 2,
    y2: courtyardTop,
    stroke: "#9a8b7c",
    strokeWidth: 0.06,
  });
  objects.push({
    type: "line",
    x1: buildingWidth / 2,
    y1: courtyardBottom,
    x2: buildingWidth / 2,
    y2: courtyardTop,
    stroke: "#9a8b7c",
    strokeWidth: 0.06,
  });

  // rear parking lot pad
  objects.push({
    type: "rect",
    x: -totalWidth / 2,
    y: lotBottom,
    width: totalWidth,
    height: lotHeight,
    fill: "#e2d9cf",
    stroke: "#c7bcae",
    strokeWidth: 0.03,
  });

  // 2x2 dotted divider lines
  objects.push({
    type: "line",
    x1: 0,
    y1: lotBottom,
    x2: 0,
    y2: lotTop,
    stroke: "#c7bcae",
    strokeWidth: 0.04,
    dash: [0.3, 0.25],
  });
  objects.push({
    type: "line",
    x1: -totalWidth / 2,
    y1: midY,
    x2: totalWidth / 2,
    y2: midY,
    stroke: "#c7bcae",
    strokeWidth: 0.04,
    dash: [0.3, 0.25],
  });

  const rearOverhang = 1.0;
  return {
    name: "Apartment Parking",
    objects,
    offset: {
      x: -rearOverhang,
      y: -seSpotCenter.y,
    },
  };
})();
