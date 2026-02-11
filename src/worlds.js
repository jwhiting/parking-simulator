export const EMPTY_WORLD = {
  name: "Empty",
  objects: [
    {
      type: "rect",
      x: -223.8,
      y: -223.8,
      width: 447.6,
      height: 447.6,
      fill: null,
      stroke: "#b34b2e",
      strokeWidth: 2,
    },
  ],
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
  const carWidth = 73.5;
  const carLength = 184.8;
  const stallWidth = carWidth * 1.5;
  const stallDepth = carLength * (5.6 / 4.8);
  const spaces = 10;
  const stallMargin = stallWidth * 3.8;
  const lotWidth = spaces * stallWidth + stallMargin * 2;
  const lotHeight = stallDepth * (40 / 5.6);
  const stroke = carWidth * 0.015;

  // asphalt background
  objects.push({
    type: "rect",
    x: -lotWidth / 2,
    y: -lotHeight / 2,
    width: lotWidth,
    height: lotHeight,
    fill: "#dad3c9",
    stroke: "#cbbfb2",
    strokeWidth: stroke * 1.5,
  });

  // center driving lane lines
  objects.push({
    type: "line",
    x1: -lotWidth / 2 + 2,
    y1: 0,
    x2: lotWidth / 2 - 2,
    y2: 0,
    stroke: "#c7bcae",
    strokeWidth: stroke * 1.5,
    dash: [carWidth * 0.15, carWidth * 0.175],
  });

  // parking rows (top and bottom)
  const rowOffset = stallDepth * (2.2 / 5.2);
  addParkingRow(objects, {
    x: -lotWidth / 2 + stallWidth * 2.8,
    y: rowOffset,
    spaces,
    stallWidth,
    stallDepth,
  });
  addParkingRow(objects, {
    x: -lotWidth / 2 + stallWidth * 2.8,
    y: -stallDepth * (7.4 / 5.2),
    spaces,
    stallWidth,
    stallDepth,
  });

  // parked cars top row
  for (let i = 0; i < spaces; i += 1) {
    if (i === 3 || i === 6) {
      continue; // open spots
    }
    addParkedCar(objects, {
      x: -lotWidth / 2 + stallWidth * 2.8 + i * stallWidth + (stallWidth - carWidth) / 2,
      y: rowOffset + carWidth * 0.2,
      width: carWidth,
      height: carLength,
      color: i % 2 === 0 ? "#9aa3a9" : "#8d8a85",
    });
  }

  // parked cars bottom row
  for (let i = 0; i < spaces; i += 1) {
    if (i === 4 || i === 8) {
      continue; // open spots
    }
    addParkedCar(objects, {
      x: -lotWidth / 2 + stallWidth * 2.8 + i * stallWidth + (stallWidth - carWidth) / 2,
      y: -(stallDepth * (7.4 / 5.2) - carWidth * 0.2),
      width: carWidth,
      height: carLength,
      color: i % 2 === 0 ? "#a28a78" : "#7f8a8f",
    });
  }

  // curbs
  objects.push({
    type: "rect",
    x: -lotWidth / 2 + carWidth,
    y: stallDepth * (8.2 / 5.2),
    width: lotWidth - carWidth * 2,
    height: carWidth * 0.3,
    fill: "#bfb3a5",
    stroke: "#a89988",
    strokeWidth: stroke,
  });
  objects.push({
    type: "rect",
    x: -lotWidth / 2 + carWidth,
    y: -stallDepth * (8.7 / 5.2),
    width: lotWidth - carWidth * 2,
    height: carWidth * 0.3,
    fill: "#bfb3a5",
    stroke: "#a89988",
    strokeWidth: stroke,
  });

  return {
    name: "Parking Lot",
    objects,
  };
})();

export const TIGHT_PARKING_LOT_WORLD = (() => {
  const objects = [];
  const carWidth = 73.5;
  const carLength = 184.8;
  const stallWidth = carWidth * 1.3;
  const stallDepth = carLength * (5.2 / 4.8);
  const spaces = 10;
  const stallMargin = stallWidth * (7 / 2.6);
  const lotWidth = spaces * stallWidth + stallMargin * 2;
  const lotHeight = stallDepth * (36 / 5.2);
  const stroke = carWidth * 0.015;

  objects.push({
    type: "rect",
    x: -lotWidth / 2,
    y: -lotHeight / 2,
    width: lotWidth,
    height: lotHeight,
    fill: "#dad3c9",
    stroke: "#cbbfb2",
    strokeWidth: stroke * 1.5,
  });

  objects.push({
    type: "line",
    x1: -lotWidth / 2 + 2,
    y1: 0,
    x2: lotWidth / 2 - 2,
    y2: 0,
    stroke: "#c7bcae",
    strokeWidth: stroke * 1.5,
    dash: [carWidth * 0.15, carWidth * 0.175],
  });

  const rowOffset = stallDepth * 0.5;
  addParkingRow(objects, {
    x: -lotWidth / 2 + stallWidth * (3.5 / 2.6),
    y: rowOffset,
    spaces,
    stallWidth,
    stallDepth,
  });
  addParkingRow(objects, {
    x: -lotWidth / 2 + stallWidth * (3.5 / 2.6),
    y: -stallDepth * 1.5,
    spaces,
    stallWidth,
    stallDepth,
  });

  for (let i = 0; i < spaces; i += 1) {
    if (i === 4 || i === 7) {
      continue;
    }
    addParkedCar(objects, {
      x: -lotWidth / 2 + stallWidth * (3.5 / 2.6) + i * stallWidth + (stallWidth - carWidth) / 2,
      y: rowOffset + carWidth * 0.2,
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
      x: -lotWidth / 2 + stallWidth * (3.5 / 2.6) + i * stallWidth + (stallWidth - carWidth) / 2,
      y: -stallDepth * 1.5 + carWidth * 0.2,
      width: carWidth,
      height: carLength,
      color: i % 2 === 0 ? "#a28a78" : "#7f8a8f",
    });
  }

  objects.push({
    type: "rect",
    x: -lotWidth / 2 + carWidth,
    y: rowOffset + stallDepth + carWidth * 0.3,
    width: lotWidth - carWidth * 2,
    height: 6,
    fill: "#bfb3a5",
    stroke: "#a89988",
    strokeWidth: stroke,
  });
  objects.push({
    type: "rect",
    x: -lotWidth / 2 + carWidth,
    y: -stallDepth * 1.5 - carWidth * 0.6,
    width: lotWidth - carWidth * 2,
    height: 6,
    fill: "#bfb3a5",
    stroke: "#a89988",
    strokeWidth: stroke,
  });

  return {
    name: "Tight Parking Lot",
    objects,
  };
})();

export const APARTMENT_PARKING_WORLD = (() => {
  const objects = [];
  const carWidth = 73.5;
  const carLength = 184.8;
  const drivewayWidth = 108;
  const totalWidth = 1128;
  const buildingWidth = totalWidth - 2 * drivewayWidth;
  const buildingHeight = 1.5 * carLength;
  const courtyardHeight = 180;
  const courtyardWidth = 648;
  const lotHeight = 306;
  const gap = (lotHeight - 2 * carWidth) / 3;
  const roadHeight = carWidth * 1.6;

  const buildingTop = carWidth * 3;
  const buildingBottom = buildingTop - buildingHeight;
  const courtyardTop = buildingBottom;
  const courtyardBottom = courtyardTop - courtyardHeight;
  const courtyardLeft = -courtyardWidth / 2;
  const courtyardRight = courtyardWidth / 2;
  const lotTop = courtyardBottom;
  const lotBottom = lotTop - lotHeight;
  const spotHeight = 120;
  const spotWidth = 240;
  const spotGapSouth = lotHeight - spotHeight * 2;
  const spotsLeft = -spotWidth;
  const spotsTopRowY = lotTop - spotHeight;
  const spotsBottomRowY = spotsTopRowY - spotHeight;
  const seSpotCenter = {
    x: spotWidth / 2,
    y: spotsBottomRowY + spotHeight / 2,
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
    x1: courtyardRight,
    y1: courtyardBottom,
    x2: courtyardRight,
    y2: courtyardTop,
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

  const rearOverhang = 41.3;
  return {
    name: "Apartment Parking",
    objects,
    offset: {
      x: -rearOverhang,
      y: -seSpotCenter.y,
    },
  };
})();
