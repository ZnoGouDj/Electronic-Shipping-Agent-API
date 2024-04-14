const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/calculateRounds', (req, res) => {
  const data = req.body;

  try {
    const minRounds = calculateMinRounds(data);
    res.json(minRounds);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const fleetMatrix = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]

let anchorageSchema;
let fleetsCopy;

function calculateMinRounds({ anchorageSize, fleets }) {
  fleetsCopy = JSON.parse(JSON.stringify(fleets))
  anchorageSchema = createAnchorageSchema(anchorageSize);
  console.log('anchorageSchema: ', anchorageSchema); // matrix above

  const shipMap = createShipMap(fleetsCopy);
  // console.log('shipMap: ', shipMap)
  /*{
    5 => [
      {
        singleShipDimensions: { "width": 6, "height": 5 },
        shipDesignation: 'LNG Unit',
        shipCount: 2
      }
    ],
    3 => [
      {
        singleShipDimensions: { "width": 3, "height": 12 },
        shipDesignation: 'Science & Engineering Ship',
        shipCount: 5
      }
    ]
  }*/

  const largestShip = findLargestShip(fleetsCopy);
  // console.log('largestShip: ', largestShip);
  /*{
    singleShipDimensions: { width: 3, height: 12 },
    shipDesignation: 'Science & Engineering Ship',
    shipCount: 5
  }*/

  placeShip(largestShip);

  console.log('anchorageSchema after: ', anchorageSchema);
  console.log('fleets: ', fleetsCopy)

  return { largestShip, shipMap };
}

function createShipMap(fleets) {
  const shipMap = new Map();

  fleets.forEach(fleet => {
    const { width, height } = fleet.singleShipDimensions;
    const smallestDimension = Math.min(width, height);

    if (!shipMap.has(smallestDimension)) {
      shipMap.set(smallestDimension, []);
    }

    shipMap.get(smallestDimension).push(fleet);
  });

  return shipMap;
}

function findLargestShip(fleets) {
  let largestShipArea = 0;
  let largestShip = null;

  fleets.forEach(fleet => {
    const shipArea = fleet.singleShipDimensions.width * fleet.singleShipDimensions.height;

    if (shipArea > largestShipArea) {
      largestShipArea = shipArea;
      largestShip = fleet;
    }
  });

  return largestShip;
}

function createAnchorageSchema(anchorageSize) {
  return Array.from({ length: anchorageSize.height }, () =>
    Array.from({ length: anchorageSize.width }, () => 0)
  );
}

function placeShip(fleet) {
  if (anchorageSchema[0].length >= fleet.singleShipDimensions.height && anchorageSchema.length >= fleet.singleShipDimensions.width) {
    for (let i = 0; i < fleet.singleShipDimensions.width; i++) {
      anchorageSchema[i].splice(0, fleet.singleShipDimensions.height);
    }
    fleet.shipCount--;
  }
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