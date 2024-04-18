const express = require('express');
const bodyParser = require('body-parser');

const {convertFleetsToFleetArray, initializeContainer, findEmptyPosition, findAnotherEmptyPosition} = require('./common.js')

const app = express();
const port = 4000;

app.use(bodyParser.json());

let rounds = 0;
let container;

app.post('/calculateRounds', (req, res) => {
  const data = req.body;

  try {
    const {anchorageSize, fleets} = data;
    container = initializeContainer(anchorageSize.width, anchorageSize.height);
    rounds = 1;
    const ships = convertFleetsToFleetArray(fleets).sort((a, b) => {
      let productA = a[0] * a[1];
      let productB = b[0] * b[1];
      return productB - productA;
    });

    console.log('Container dimensions:', container[0].length, container.length);
    console.log('ship: ', ships);

    packShips(ships);

    res.json(rounds);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

function placeShip(
  firstEmptyPositionInDeepArray,
  firstEmptyPositionInRegularArray,
  anotherEmptyPositionInDeepArray,
  anotherEmptyPositionInRegularArray,
  shipWidth,
  shipHeight
) {
  console.log('Placing ship at:', firstEmptyPositionInDeepArray, firstEmptyPositionInRegularArray);
  console.log('Ship dimensions:', shipWidth, shipHeight);

  console.log('1st: ', [firstEmptyPositionInDeepArray, firstEmptyPositionInRegularArray]);
  console.log('2nd: ', [anotherEmptyPositionInDeepArray, anotherEmptyPositionInRegularArray]);
  // console.log('Container dimensions:', container[0].length, container.length);
  // console.log('***vertical***')
  // console.log('container[0].length - firstEmptyPositionInRegularArray: ', container[0].length - firstEmptyPositionInRegularArray);
  // console.log('container.length - firstEmptyPositionInDeepArray', container.length - firstEmptyPositionInDeepArray);
  // console.log('***')
  // console.log('###horizontal###')
  // console.log('container[0].length - firstEmptyPositionInDeepArray: ', container[0].length - firstEmptyPositionInDeepArray);
  // console.log('container.length - firstEmptyPositionInRegularArray', container.length - firstEmptyPositionInRegularArray);
  // console.log('###')

  if (container.length - firstEmptyPositionInRegularArray >= shipHeight && container[0].length - firstEmptyPositionInDeepArray >= shipWidth) {
    for (let i = firstEmptyPositionInRegularArray; i < firstEmptyPositionInRegularArray + shipHeight; i++) {
      for (let j = firstEmptyPositionInDeepArray; j < firstEmptyPositionInDeepArray + shipWidth; j++) {
        // console.log('Checking position:', i, j);
        container[i][j] = 1;
      }
    }
    container.forEach(row => console.log(row.join(" ")));
  } else if (container[0].length - firstEmptyPositionInDeepArray >= shipHeight && container.length - firstEmptyPositionInRegularArray >= shipWidth) {
    for (let i = firstEmptyPositionInRegularArray; i < firstEmptyPositionInRegularArray + shipWidth; i++) {
      for (let j = firstEmptyPositionInDeepArray; j < firstEmptyPositionInDeepArray + shipHeight; j++) {
        // console.log('Checking position horizont:', i, j);
        container[i][j] = 1;
      }
    }
    container.forEach(row => console.log(row.join(" ")));
  } else if (container.length - anotherEmptyPositionInRegularArray >= shipHeight && container[0].length - anotherEmptyPositionInDeepArray >= shipWidth) {
    for (let i = anotherEmptyPositionInRegularArray; i < anotherEmptyPositionInRegularArray + shipHeight; i++) {
      for (let j = anotherEmptyPositionInDeepArray; j < anotherEmptyPositionInDeepArray + shipWidth; j++) {
        // console.log('Checking position:', i, j);
        container[i][j] = 1;
      }
    }
    container.forEach(row => console.log(row.join(" ")));
  } else if (container[0].length - anotherEmptyPositionInDeepArray >= shipHeight && container.length - anotherEmptyPositionInRegularArray >= shipWidth) {
    for (let i = anotherEmptyPositionInRegularArray; i < anotherEmptyPositionInRegularArray + shipWidth; i++) {
      for (let j = anotherEmptyPositionInDeepArray; j < anotherEmptyPositionInDeepArray + shipHeight; j++) {
        // console.log('Checking position horizont:', i, j);
        container[i][j] = 1;
      }
    }
    container.forEach(row => console.log(row.join(" ")));
  } else {
    rounds++;
    console.log('REFRESHING CONTAINER!')
    container = initializeContainer(container[0].length, container.length)

    if (container.length >= shipHeight && container[0].length >= shipWidth) {
      for (let i = 0; i < shipHeight; i++) {
        for (let j = 0; j < shipWidth; j++) {
          // console.log('Checking position:', i, j);
          container[i][j] = 1;
        }
      }
    } else if (container[0].length >= shipHeight && container.length >= shipWidth) {
      for (let i = 0; i < shipWidth; i++) {
        for (let j = 0; j < shipHeight; j++) {
          // console.log('Checking position horizont:', i, j);
          container[i][j] = 1;
        }
      }
    }

    container.forEach(row => console.log(row.join(" ")));

  }
}

function packShips(ships) {
  ships.forEach(ship => {
    const [shipWidth, shipHeight] = ship;
    const emptyPosition = findEmptyPosition(container);
    const anotherEmptyPosition = findAnotherEmptyPosition(container);
    if (emptyPosition) {
      const [firstEmptyPositionInDeepArray, firstEmptyPositionInRegularArray] = emptyPosition;
      const [anotherEmptyPositionInDeepArray, anotherEmptyPositionInRegularArray] = anotherEmptyPosition ? anotherEmptyPosition : emptyPosition;

      placeShip(
        firstEmptyPositionInDeepArray,
        firstEmptyPositionInRegularArray,
        anotherEmptyPositionInDeepArray,
        anotherEmptyPositionInRegularArray,
        shipWidth,
        shipHeight
      );
    } else {
      console.log("Container is full, cannot pack more ships.");
      placeShip(container[0].length - 1, container.length - 1, shipWidth, shipHeight);
    }
  });
}

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});