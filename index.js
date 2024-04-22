const express = require('express');
const bodyParser = require('body-parser');
const {
  convertFleetsToFleetArray,
  initializeContainer,
  findEmptyPosition,
  canPlaceShipVertically,
  canPlaceShipHorizontally,
  placeShipVertically,
  placeShipHorizontally
} = require('./common.js')

const app = express();
const port = 4000;

app.use(bodyParser.json());

let ROUNDS = 0;
let ROUNDS_A = 0;
let ROUNDS_B = 0;
let CONTAINER;
let SHIPS;

// !Todo - remove after debug
const CONTAINERS = [];

app.post('/calculateRounds', handleCalculateRounds);

function handleCalculateRounds(req, res) {
  const data = req.body;

  try {
    const { anchorageSize, fleets } = data;

    for (let i = 0; i < 2; i++) {
      initializeRound(anchorageSize, fleets, i);
    }

    // !Todo - remove after debug
    console.log('CONTAINERS: ')
    CONTAINERS.forEach(container => {
      container.forEach(row => console.log(row.join(" ")))
      console.log('**********************************')
      console.log('**********************************')
      console.log('**********************************')
    })
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

// !Todo - remove after debug
  function logArrayInChunks(arr, chunkSize) {
    for (let i = 0; i < arr.length; i += chunkSize) {
      const chunk = arr.slice(i, i + chunkSize);
      console.log(chunk);
    }
  }
  
  const chunkSize = 96; 
  logArrayInChunks(SHIPS, chunkSize);


  if (index === 1) {
    SHIPS = SHIPS.map(([width, height]) => [height, width]);
  }

  while (SHIPS.length > 0) {
    // console.log("ships before filtering: ", SHIPS)
    SHIPS = SHIPS.filter((ship) => ship !== undefined);
    packShips(SHIPS);
  }

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
      // console.log("CONTAINER is full, cannot pack more SHIPS.");
      placeShip(CONTAINER[0].length - 1, CONTAINER.length - 1, [shipHeight, shipWidth], index);
    }
  });
}

function placeShip(firstEmptyPositionInDeepArray, firstEmptyPositionInRegularArray, [sideA, sideB], index) {
  // console.log('Placing ship at:', firstEmptyPositionInDeepArray, firstEmptyPositionInRegularArray);
  // console.log('Ship dimensions:', sideA, sideB);

  if (canPlaceShipHorizontally(firstEmptyPositionInDeepArray, firstEmptyPositionInRegularArray, sideA, sideB, CONTAINER)) {
      placeShipHorizontally(firstEmptyPositionInDeepArray, firstEmptyPositionInRegularArray, sideA, sideB, index, CONTAINER, SHIPS);
  } else if (canPlaceShipVertically(firstEmptyPositionInDeepArray, firstEmptyPositionInRegularArray, sideA, sideB, CONTAINER)) {
      placeShipVertically(firstEmptyPositionInDeepArray, firstEmptyPositionInRegularArray, sideA, sideB, index, CONTAINER, SHIPS);
  } else if (isSmallerShipExists(index)) {
    // console.log('skipping this ship...')
  } else {
      placeShipToTheNewContainer(sideA, sideB, index);
  }
}

function placeShipToTheNewContainer(sideA, sideB, index) {
  ROUNDS++;

// !Todo - remove after debug
  CONTAINERS.push(CONTAINER);

  CONTAINER = initializeContainer(CONTAINER[0].length, CONTAINER.length);

  if (canPlaceShipHorizontally(0, 0, sideA, sideB, CONTAINER)) {
    placeShipHorizontally(0, 0, sideA, sideB, index, CONTAINER, SHIPS);
  } else if (canPlaceShipVertically(0, 0, sideA, sideB, CONTAINER)) {
    placeShipVertically(0, 0, sideA, sideB, index, CONTAINER, SHIPS);
  }
}

function isSmallerShipExists(index) {
  const currentShip = SHIPS[index];

  for (let i = index + 1; i < SHIPS.length; i++) {
      const ship = SHIPS[i];

      const currentShipStringified = JSON.stringify(currentShip);
      const currentShipStringifiedSwapped = JSON.stringify([currentShip[1], currentShip[0]]);
      const shipToCompareStringified = JSON.stringify(ship);

      if (shipToCompareStringified !== currentShipStringified && shipToCompareStringified !== currentShipStringifiedSwapped) {
        return true;
      }
  }

  return false;
}

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});