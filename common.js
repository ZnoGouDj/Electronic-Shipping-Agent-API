function convertFleetsToFleetArray(fleets) {
    const fleetArray = [];
    fleets.forEach(fleet => {
      const { width, height } = fleet.singleShipDimensions;
      const shipCount = fleet.shipCount;

      const biggestDimension = Math.max(width, height);
      const smallestDimension = Math.min(width, height);

      for (let i = 0; i < shipCount; i++) {
        fleetArray.push([biggestDimension, smallestDimension]);
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

function findEmptyPosition(container, ship) {
    for (let i = 0; i < container.length; i++) {
      for (let j = 0; j < container[i].length; j++) {
        if (container[i][j] === 0 && willCurrentShipFit(container, i, j, ship)) {
          return [j, i, false];
        } else if (container[i][j] === 0 && willCurrentShipFitIfRotated(container, i, j, ship)) {
          return [j, i, true];
        }
      }
    }
    return null;
}

exports.findEmptyPosition = findEmptyPosition;

function willCurrentShipFit(container, i, j, ship) {
  if (i + ship[1] > container.length || j + ship[0] > container[0].length) {
      return false;
  }

  for (let x = i; x < i + ship[1]; x++) {
      for (let y = j; y < j + ship[0]; y++) {
          if (container[x][y] === 1) {
              return false;
          }
      }
  }

  return true;
}

function willCurrentShipFitIfRotated(container, i, j, ship) {
  const rotatedShip = [ship[1], ship[0]];

  if (i + rotatedShip[1] > container.length || j + rotatedShip[0] > container[0].length) {
      return false;
  }

  for (let x = i; x < i + rotatedShip[1]; x++) {
      for (let y = j; y < j + rotatedShip[0]; y++) {
          if (container[x][y] === 1) {
              return false;
          }
      }
  }

  return true;
}

function canPlaceShipHorizontally(firstEmptyPositionInDeepArray, firstEmptyPositionInRegularArray, sideA, sideB, CONTAINER) {
  return CONTAINER[0].length - firstEmptyPositionInDeepArray >= sideA && CONTAINER.length - firstEmptyPositionInRegularArray >= sideB;
}

exports.canPlaceShipHorizontally = canPlaceShipHorizontally;

function canPlaceShipVertically(firstEmptyPositionInDeepArray, firstEmptyPositionInRegularArray, sideA, sideB, CONTAINER) {
  return CONTAINER[0].length - firstEmptyPositionInDeepArray >= sideB && CONTAINER.length - firstEmptyPositionInRegularArray >= sideA;
}

exports.canPlaceShipVertically = canPlaceShipVertically;

function placeShipHorizontally(firstEmptyPositionInDeepArray, firstEmptyPositionInRegularArray, sideA, sideB, index, CONTAINER, SHIPS) {
  for (let i = firstEmptyPositionInRegularArray; i < firstEmptyPositionInRegularArray + sideB; i++) {
      for (let j = firstEmptyPositionInDeepArray; j < firstEmptyPositionInDeepArray + sideA; j++) {
          CONTAINER[i][j] = 1;
      }
  }
  SHIPS.splice(index, 1, undefined);
  CONTAINER.forEach(row => console.log(row.join(" ")));
}

exports.placeShipHorizontally = placeShipHorizontally;

function placeShipVertically(firstEmptyPositionInDeepArray, firstEmptyPositionInRegularArray, sideA, sideB, index, CONTAINER, SHIPS) {
  for (let i = firstEmptyPositionInRegularArray; i < firstEmptyPositionInRegularArray + sideA; i++) {
      for (let j = firstEmptyPositionInDeepArray; j < firstEmptyPositionInDeepArray + sideB; j++) {
          CONTAINER[i][j] = 1;
      }
  }
  SHIPS.splice(index, 1, undefined);
  CONTAINER.forEach(row => console.log(row.join(" ")));
}

exports.placeShipVertically = placeShipVertically;