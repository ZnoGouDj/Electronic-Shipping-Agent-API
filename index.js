const express = require('express');
const bodyParser = require('body-parser');

const {convertFleetsToFleetArray, initializeContainer, findEmptyPosition} = require('./common.js')

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
    const ships = convertFleetsToFleetArray(fleets);

    packShips(ships);

    res.json(rounds);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

function placeShip(firstEmptyPositionInDeepArray, firstEmptyPositionInRegularArray, shipWidth, shipHeight) {
  console.log('Placing ship at:', firstEmptyPositionInDeepArray, firstEmptyPositionInRegularArray);
  console.log('Ship dimensions:', shipWidth, shipHeight);
  console.log('Container dimensions:', container[0].length, container.length);
  console.log('***vertical***')
  console.log('container[0].length - firstEmptyPositionInRegularArray: ', container[0].length - firstEmptyPositionInRegularArray);
  console.log('container.length - firstEmptyPositionInDeepArray', container.length - firstEmptyPositionInDeepArray);
  console.log('***')
  console.log('###horizontal###')
  console.log('container[0].length - firstEmptyPositionInDeepArray: ', container[0].length - firstEmptyPositionInDeepArray);
  console.log('container.length - firstEmptyPositionInRegularArray', container.length - firstEmptyPositionInRegularArray);
  console.log('###')

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
  } else {
    rounds++;
    console.log('REFRESHING CONTAINER!')
  container.forEach(row => console.log(row.join(" ")));
    container = initializeContainer(container[0].length, container.length)
  }

}

function packShips(ships) {
  ships.forEach(ship => {
    const [shipWidth, shipHeight] = ship;
    const emptyPosition = findEmptyPosition();
    if (emptyPosition) {
      const [firstEmptyPositionInDeepArray, firstEmptyPositionInRegularArray] = emptyPosition;
      placeShip(firstEmptyPositionInDeepArray, firstEmptyPositionInRegularArray, shipWidth, shipHeight);
    } else {
      console.log("Container is full, cannot pack more ships.");
    }
  });
}

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});