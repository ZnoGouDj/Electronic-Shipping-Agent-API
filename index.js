const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());
let rounds = 0;
let container;
app.post('/calculateRounds', (req, res) => {
  const data = req.body;

  try {
    const {anchorageSize, fleets} = data;
    container = initializeContainer(anchorageSize.width, anchorageSize.height);
    rounds++;
    const ships = convertFleetsToFleetArray(fleets);

    packShips(ships);

    res.json(rounds);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

function initializeContainer(width, height) {
  const container = [];
  for (let i = 0; i < height; i++) {
    container.push(Array(width).fill(0));
  }
  return container;
}

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

function placeShip(x, y, shipWidth, shipHeight) {
  console.log('Placing ship at:', x, y);
  console.log('Ship dimensions:', shipWidth, shipHeight);
  // console.log('Container dimensions:', container[0].length, container.length);
  console.log('***')
  console.log('container[0].length - y: ', container[0].length - y);
  console.log('container.length - x', container.length - x);
  console.log('***')

  if (container[0].length - y >= shipHeight && container.length - x >= shipWidth) {
    for (let i = y; i < y + shipHeight; i++) {
      for (let j = x; j < x + shipWidth; j++) {
        console.log('Checking position:', i, j);
        container[i][j] = 1;
      }
    }
  } else if (container[0].length - y >= shipWidth && container.length - x >= shipHeight) {
    for (let i = y; i < y + shipWidth; i++) {
      for (let j = x; j < x + shipHeight; j++) {
        console.log('Checking position horizont:', i, j);
        container[i][j] = 1;
      }
    }
  } else {
    rounds++;
    container = initializeContainer(container[0].length, container.length)
  }

  container.forEach(row => console.log(row.join(" ")));
}

function checkFit(container, x, y, shipWidth, shipHeight) {
  // Check if the ship fits within the bounds of the container
  if (x + shipWidth > container[0].length || y + shipHeight > container.length) {
    return false;
  }
  // Check if the positions in the container are empty
  return placeShip(container, x, y, shipWidth, shipHeight);
}

function findEmptyPosition() {
  // Iterate over the container to find the first empty position
  for (let i = 0; i < container.length; i++) {
    for (let j = 0; j < container[i].length; j++) {
      if (container[i][j] === 0) {
        return [j, i]; // Return coordinates [x, y]
      }
    }
  }
  return null; // No empty position found
}

function packShips(ships) {
  ships.forEach(ship => {
    const [shipWidth, shipHeight] = ship;
    const emptyPosition = findEmptyPosition();
    if (emptyPosition) {
      const [x, y] = emptyPosition;
      placeShip(x, y, shipWidth, shipHeight);
    } else {
      console.log("Container is full, cannot pack more ships.");
    }
  });
}

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});

const test = {
  "anchorageSize": {
    "width": 12,
    "height": 15
  },
  "fleets": [
    {
      "singleShipDimensions": { "width": 6, "height": 5 },
      "shipDesignation": "LNG Unit",
      "shipCount": 2
    },
    {
      "singleShipDimensions": { "width": 3, "height": 12 },
      "shipDesignation": "Science & Engineering Ship",
      "shipCount": 5
    }
  ]
}

const random = {
  "anchorageSize": {
      "width": 48,
      "height": 57
  },
  "fleets": [
      {
          "singleShipDimensions": {
              "width": 5,
              "height": 1
          },
          "shipDesignation": "Legendary Hexamaran with Scuba equipment",
          "shipCount": 4
      },
      {
          "singleShipDimensions": {
              "width": 1,
              "height": 13
          },
          "shipDesignation": "Super Mineral Water Tanker with On-board Crane",
          "shipCount": 33
      },
      {
          "singleShipDimensions": {
              "width": 1,
              "height": 15
          },
          "shipDesignation": "Coastal Fresh Water Tanker",
          "shipCount": 32
      },
      {
          "singleShipDimensions": {
              "width": 4,
              "height": 1
          },
          "shipDesignation": "Subsonic Nuclear Hexamaran with Torpedo Bay",
          "shipCount": 4
      },
      {
          "singleShipDimensions": {
              "width": 6,
              "height": 12
          },
          "shipDesignation": "Science & Engineering Ship",
          "shipCount": 56
      },
      {
          "singleShipDimensions": {
              "width": 5,
              "height": 11
          },
          "shipDesignation": "Salvage Engineering Ship",
          "shipCount": 57
      },
      {
          "singleShipDimensions": {
              "width": 9,
              "height": 23
          },
          "shipDesignation": "Floating Storage and Offloading Raw Ore Processing Unit with Ship Maintenance Facilities",
          "shipCount": 4
      },
      {
          "singleShipDimensions": {
              "width": 7,
              "height": 27
          },
          "shipDesignation": "Floating Storage and Offloading Oil Refining Unit with Underwater Monitoring",
          "shipCount": 4
      },
      {
          "singleShipDimensions": {
              "width": 4,
              "height": 1
          },
          "shipDesignation": "Covert Animal-powered Hexamaran with Scuba equipment",
          "shipCount": 3
      },
      {
          "singleShipDimensions": {
              "width": 5,
              "height": 1
          },
          "shipDesignation": "Strategic Hexamaran with Ground Control Intercept Radar",
          "shipCount": 2
      },
      {
          "singleShipDimensions": {
              "width": 5,
              "height": 1
          },
          "shipDesignation": "Spec-ops Strategic Hexamaran with Scuba equipment",
          "shipCount": 5
      },
      {
          "singleShipDimensions": {
              "width": 8,
              "height": 28
          },
          "shipDesignation": "Floating Storage and Offloading Oil Refining Unit",
          "shipCount": 3
      }
  ]
}