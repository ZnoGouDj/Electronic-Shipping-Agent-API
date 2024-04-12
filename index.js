const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/calculateRounds', (req, res) => {
  const data = req.body;

  try {
    const minRounds = calculateMinRounds(data);
    res.json({ minRounds });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

function calculateMinRounds(data) {
  return data;
}

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});
