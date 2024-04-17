const express = require('express');
const bodyParser = require('body-parser');

const BinPacking2D = require('bb-bin-packing').BP2D;
const { Bin, Box, Packer } = BinPacking2D;

const {convertFleetsToFleetArray} = require('./common.js')

const app = express();
const port = 3000;

app.use(bodyParser.json());

let rounds = 0;

app.post('/calculateRoundsWithLib', (req, res) => {
    const data = req.body;

    try {
      const {anchorageSize, fleets} = data;
      rounds = 0;
  
      const fleetsArray = convertFleetsToFleetArray(fleets);
      let boxes = fleetsArray.map(([width, height]) => new Box(width, height));
  
      function packBoxesIntoBins() {
        if (boxes.length === 0) {
          return;
        }
  
        rounds++;
  
        const newBin = new Bin(anchorageSize.width, anchorageSize.height);
        const newPacker = new Packer([newBin]);
  
        newPacker.pack(boxes);
  
        boxes = boxes.filter((box) => !box.packed)
  
        packBoxesIntoBins(boxes);
      }
  
      packBoxesIntoBins(boxes);
  
      res.json(rounds);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`API server listening at http://localhost:${port}`);
});
