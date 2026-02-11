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
