const express = require('express');
const bodyParser = require('body-parser');

const {convertFleetsToFleetArray, initializeContainer, findEmptyPosition, findAnotherEmptyPosition} = require('./common.js')

const app = express();
const port = 4000;

app.use(bodyParser.json());

let rounds = 0;
let container;
let ships;

let roundsA = 0;
let roundsB = 0;

app.post('/calculateRounds', (req, res) => {
  const data = req.body;

  try {
    const {anchorageSize, fleets} = data;

    for (let i = 0; i < 2; i++) {
      container = initializeContainer(anchorageSize.width, anchorageSize.height);
      rounds = 1;
      ships = convertFleetsToFleetArray(fleets).sort((a, b) => {
        if (a[0] !== b[0]) {
            return b[0] - a[0];
        } else {
            return b[1] - a[1];
        }
      });

      if (i === 1) {
        ships = ships.map(([width, height]) => {
          return [height, width]
        })
      }

      console.log('Container dimensions:', container[0].length, container.length);
      console.log('ship: ', ships);
  
      packShips(ships);

      if (i === 0) {
        roundsA = rounds;
      } else if (i === 1) {
        roundsB = rounds;
      }
    }

    res.json(Math.min(roundsA, roundsB));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

function placeShip(
  firstEmptyPositionInDeepArray,
  firstEmptyPositionInRegularArray,
  [sideA, sideB],
  index
) {
  console.log('Placing ship at:', firstEmptyPositionInDeepArray, firstEmptyPositionInRegularArray);
  console.log('Ship dimensions:', sideA, sideB);
  console.log('ships[]: ', ships)

  // console.log('1st: ', [firstEmptyPositionInDeepArray, firstEmptyPositionInRegularArray]);
  // console.log('2nd: ', [anotherEmptyPositionInDeepArray, anotherEmptyPositionInRegularArray]);
  // console.log('Container dimensions:', container[0].length, container.length);
  // console.log('***vertical***')
  // console.log('container[0].length - firstEmptyPositionInRegularArray: ', container[0].length - firstEmptyPositionInRegularArray);
  // console.log('container.length - firstEmptyPositionInDeepArray', container.length - firstEmptyPositionInDeepArray);
  // console.log('***')
  // console.log('###horizontal###')
  // console.log('container[0].length - firstEmptyPositionInDeepArray: ', container[0].length - firstEmptyPositionInDeepArray);
  // console.log('container.length - firstEmptyPositionInRegularArray', container.length - firstEmptyPositionInRegularArray);
  // console.log('###')

  if (container.length - firstEmptyPositionInRegularArray >= sideB && container[0].length - firstEmptyPositionInDeepArray >= sideA) {
    for (let i = firstEmptyPositionInRegularArray; i < firstEmptyPositionInRegularArray + sideB; i++) {
      for (let j = firstEmptyPositionInDeepArray; j < firstEmptyPositionInDeepArray + sideA; j++) {
        container[i][j] = 1;
      }
    }
    ships.splice(index, 1, undefined);
    container.forEach(row => console.log(row.join(" ")));
  } else if (container[0].length - firstEmptyPositionInDeepArray >= sideB && container.length - firstEmptyPositionInRegularArray >= sideA) {
    for (let i = firstEmptyPositionInRegularArray; i < firstEmptyPositionInRegularArray + sideA; i++) {
      for (let j = firstEmptyPositionInDeepArray; j < firstEmptyPositionInDeepArray + sideB; j++) {
        container[i][j] = 1;
      }
    }
    ships.splice(index, 1, undefined);
    container.forEach(row => console.log(row.join(" ")));
  } else {
    rounds++;
    console.log('REFRESHING CONTAINER!')
    container = initializeContainer(container[0].length, container.length)

    if (container.length >= sideB && container[0].length >= sideA) {
      for (let i = 0; i < sideA; i++) {
        for (let j = 0; j < sideB; j++) {
          container[i][j] = 1;
        }
      }
    } else if (container[0].length >= sideB && container.length >= sideA) {

      for (let i = 0; i < sideB; i++) {
        for (let j = 0; j < sideA; j++) {
          container[i][j] = 1;
        }
      }
    }

    ships.splice(index, 1, undefined);
    container.forEach(row => console.log(row.join(" ")));
  }
}

function packShips(ships) {
  ships.forEach((ship, index) => {
    const [shipWidth, shipHeight] = ship;
    const emptyPosition = findEmptyPosition(container, ship);

    if (emptyPosition) {
      const [firstEmptyPositionInDeepArray, firstEmptyPositionInRegularArray, needsRotation] = emptyPosition;

      placeShip(
        firstEmptyPositionInDeepArray,
        firstEmptyPositionInRegularArray,
        needsRotation ? [shipWidth, shipHeight] : [shipHeight, shipWidth],
        index
      );
    } else {
      console.log("Container is full, cannot pack more ships.");
      placeShip(container[0].length - 1, container.length - 1, [shipWidth, shipHeight], index);
    }
  });
}

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});