function convertFleetsToFleetArray(fleets) {
    const fleetArray = [];
    fleets.forEach(fleet => {
      const { width, height } = fleet.singleShipDimensions;
      const shipCount = fleet.shipCount;
      for (let i = 0; i < shipCount; i++) {
        fleetArray.push([width, height]);
      }
    });
    return fleetArray;
}

exports.convertFleetsToFleetArray = convertFleetsToFleetArray;

function initializeContainer(width, height) {
    const container = [];
    for (let i = 0; i < height; i++) {
      container.push(Array(width).fill(0));
    }
    return container;
}

exports.initializeContainer = initializeContainer;

function findEmptyPosition(container) {
    for (let i = 0; i < container.length; i++) {
      for (let j = 0; j < container[i].length; j++) {
        if (container[i][j] === 0) {
          return [j, i];
        }
      }
    }
    return null;
}

exports.findEmptyPosition = findEmptyPosition;

function findAnotherEmptyPosition(container) {
  for (let i = 0; i < container.length; i++) {
    if (container[i][0] === 0) {
      return [0, i];
    }
  }
  return null;
}

exports.findAnotherEmptyPosition = findAnotherEmptyPosition;