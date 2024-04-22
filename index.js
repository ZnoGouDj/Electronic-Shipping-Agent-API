const express = require('express');
const bodyParser = require('body-parser');
const {
  convertFleetsToFleetArray,
  initializeContainer,
  findEmptyPosition
} = require('./common.js')

const app = express();
const port = 4000;

app.use(bodyParser.json());

let ROUNDS = 0;
let ROUNDS_A = 0;
let ROUNDS_B = 0;
let CONTAINER;
let SHIPS;

app.post('/calculateRounds', handleCalculateRounds);

function handleCalculateRounds(req, res) {
  const data = req.body;

  try {
    const { anchorageSize, fleets } = data;

    for (let i = 0; i < 2; i++) {
      initializeRound(anchorageSize, fleets, i);
    }

    res.json(Math.min(ROUNDS_A, ROUNDS_B));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

function initializeRound(anchorageSize, fleets, index) {
  CONTAINER = initializeContainer(anchorageSize.width, anchorageSize.height);
  ROUNDS = 1;
  SHIPS = convertFleetsToFleetArray(fleets).sort((a, b) => {
    if (a[0] !== b[0]) {
      return b[0] - a[0];
    } else {
      return b[1] - a[1];
    }
  });

  if (index === 1) {
    SHIPS = SHIPS.map(([width, height]) => [height, width]);
  }

  packShips(SHIPS);

  if (index === 0) {
    ROUNDS_A = ROUNDS;
  } else if (index === 1) {
    ROUNDS_B = ROUNDS;
  }
}

function packShips(SHIPS) {
  SHIPS.forEach((ship, index) => {
    const [shipWidth, shipHeight] = ship;
    const emptyPosition = findEmptyPosition(CONTAINER, ship);

    if (emptyPosition) {
      const [firstEmptyPositionInDeepArray, firstEmptyPositionInRegularArray, needsRotation] = emptyPosition;

      placeShip(
        firstEmptyPositionInDeepArray,
        firstEmptyPositionInRegularArray,
        needsRotation ? [shipWidth, shipHeight] : [shipHeight, shipWidth],
        index
      );
    } else {
      console.log("CONTAINER is full, cannot pack more SHIPS.");
      placeShip(CONTAINER[0].length - 1, CONTAINER.length - 1, [shipHeight, shipWidth], index);
    }
  });
}

function placeShip(firstEmptyPositionInDeepArray, firstEmptyPositionInRegularArray, [sideA, sideB], index) {
  console.log('Placing ship at:', firstEmptyPositionInDeepArray, firstEmptyPositionInRegularArray);
  console.log('Ship dimensions:', sideA, sideB);
  console.log('SHIPS[]: ', SHIPS);

  if (canPlaceShipHorizontally(firstEmptyPositionInDeepArray, firstEmptyPositionInRegularArray, sideA, sideB)) {
      placeShipHorizontally(firstEmptyPositionInDeepArray, firstEmptyPositionInRegularArray, sideA, sideB, index);
  } else if (canPlaceShipVertically(firstEmptyPositionInDeepArray, firstEmptyPositionInRegularArray, sideA, sideB)) {
      placeShipVertically(firstEmptyPositionInDeepArray, firstEmptyPositionInRegularArray, sideA, sideB, index);
  } else {
      placeShipToTheNewContainer(sideA, sideB, index);
  }
}

function canPlaceShipHorizontally(firstEmptyPositionInDeepArray, firstEmptyPositionInRegularArray, sideA, sideB) {
  return CONTAINER[0].length - firstEmptyPositionInDeepArray >= sideA && CONTAINER.length - firstEmptyPositionInRegularArray >= sideB;
}

function canPlaceShipVertically(firstEmptyPositionInDeepArray, firstEmptyPositionInRegularArray, sideA, sideB) {
  return CONTAINER[0].length - firstEmptyPositionInDeepArray >= sideB && CONTAINER.length - firstEmptyPositionInRegularArray >= sideA;
}

function placeShipHorizontally(firstEmptyPositionInDeepArray, firstEmptyPositionInRegularArray, sideA, sideB, index) {
  for (let i = firstEmptyPositionInRegularArray; i < firstEmptyPositionInRegularArray + sideB; i++) {
      for (let j = firstEmptyPositionInDeepArray; j < firstEmptyPositionInDeepArray + sideA; j++) {
          CONTAINER[i][j] = 1;
      }
  }
  SHIPS.splice(index, 1, undefined);
  CONTAINER.forEach(row => console.log(row.join(" ")));
}

function placeShipVertically(firstEmptyPositionInDeepArray, firstEmptyPositionInRegularArray, sideA, sideB, index) {
  for (let i = firstEmptyPositionInRegularArray; i < firstEmptyPositionInRegularArray + sideA; i++) {
      for (let j = firstEmptyPositionInDeepArray; j < firstEmptyPositionInDeepArray + sideB; j++) {
          CONTAINER[i][j] = 1;
      }
  }
  SHIPS.splice(index, 1, undefined);
  CONTAINER.forEach(row => console.log(row.join(" ")));
}

function placeShipToTheNewContainer(sideA, sideB, index) {
  ROUNDS++;
  CONTAINER = initializeContainer(CONTAINER[0].length, CONTAINER.length);

  if (canPlaceShipHorizontally(0, 0, sideA, sideB)) {
    placeShipHorizontally(0, 0, sideA, sideB, index);
  } else if (canPlaceShipVertically(0, 0, sideA, sideB)) {
    placeShipVertically(0, 0, sideA, sideB, index);
  }
}

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});