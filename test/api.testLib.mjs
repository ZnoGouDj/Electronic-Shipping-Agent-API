import { expect } from 'chai';
import request from 'request';

it('Trivial. Should be equal to 1', function(done) {
  const requestData = {
      "anchorageSize": {
          "width": 12,
          "height": 15
      },
      "fleets": [
          {
              "singleShipDimensions": { "width": 6, "height": 5 },
              "shipDesignation": "LNG Unit",
              "shipCount": 6
          }
      ]
  };

  request.post({
      url: 'http://localhost:3000/calculateRoundsWithLib',
      json: true,
      body: requestData
  }, function(_, response) {
      const responseBody = JSON.stringify(response.body);
      expect(responseBody).to.equal('1');
      done();
  });
});

it('Trivial. Should be equal to 2', function(done) {
  const requestData = {
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
  };

  request.post({
      url: 'http://localhost:3000/calculateRoundsWithLib',
      json: true,
      body: requestData
  }, function(_, response) {
      const responseBody = JSON.stringify(response.body);
      expect(responseBody).to.equal('2');
      done();
  });
});

it('Trivial. Should be equal to 3', function(done) {
  const requestData =  {
      "anchorageSize": {
        "width": 12,
        "height": 15
      },
      "fleets": [
        {
          "singleShipDimensions": { "width": 6, "height": 5 },
          "shipDesignation": "LNG Unit",
          "shipCount": 18
        }
      ]
  };

  request.post({
      url: 'http://localhost:3000/calculateRoundsWithLib',
      json: true,
      body: requestData
  }, function(_, response) {
      const responseBody = JSON.stringify(response.body);
      expect(responseBody).to.equal('3');
      done();
  });
});

it('Trivial rotation. Should be equal to 1', function(done) {
  const requestData =  {
      "anchorageSize": {
        "width": 8,
        "height": 8
      },
      "fleets": [
        {
          "singleShipDimensions": { "width": 8, "height": 4 },
          "shipDesignation": "LNG Unit",
          "shipCount": 1
        },
        {
          "singleShipDimensions": { "width": 4, "height": 6 },
          "shipDesignation": "LNG Unit We Need To Rotate",
          "shipCount": 1
        },
        {
          "singleShipDimensions": { "width": 4, "height": 2 },
          "shipDesignation": "LNG Unit We Need To Rotate Too",
          "shipCount": 1
        },
      ]
  };

  request.post({
      url: 'http://localhost:3000/calculateRoundsWithLib',
      json: true,
      body: requestData
  }, function(_, response) {
      const responseBody = JSON.stringify(response.body);
      expect(responseBody).to.equal('1');
      done();
  });
});

it('Average. Should be equal to 1', function(done) {
  const requestData =  {
    "anchorageSize": {
        "width": 15,
        "height": 23
    },
    "fleets": [
        {
            "singleShipDimensions": { "width": 8, "height": 13 },
            "shipDesignation": "LNG Unit",
            "shipCount": 1
        },
        {
            "singleShipDimensions": { "width": 7, "height": 7 },
            "shipDesignation": "LNG Unit 1",
            "shipCount": 1
        },
        {
            "singleShipDimensions": { "width": 7, "height": 16 },
            "shipDesignation": "LNG Unit 2",
            "shipCount": 1
        },
        {
            "singleShipDimensions": { "width": 4, "height": 8 },
            "shipDesignation": "LNG Unit 3",
            "shipCount": 2
        },
        {
            "singleShipDimensions": { "width": 8, "height": 2 },
            "shipDesignation": "LNG Unit 3",
            "shipCount": 1
        },
    ]
  };

  request.post({
      url: 'http://localhost:3000/calculateRoundsWithLib',
      json: true,
      body: requestData
  }, function(_, response) {
      const responseBody = JSON.stringify(response.body);
      expect(responseBody).to.equal('1');
      done();
  });
});

it('Average. Should be equal to 2', function(done) {
  const requestData =  {
    "anchorageSize": {
        "width": 15,
        "height": 13
    },
    "fleets": [
        {
            "singleShipDimensions": { "width": 4, "height": 4 },
            "shipDesignation": "LNG Unit",
            "shipCount": 2
        },
        {
            "singleShipDimensions": { "width": 7, "height": 4 },
            "shipDesignation": "LNG Unit 1",
            "shipCount": 2
        },
        {
            "singleShipDimensions": { "width": 15, "height": 3 },
            "shipDesignation": "LNG Unit 2",
            "shipCount": 1
        },
        {
            "singleShipDimensions": { "width": 8, "height": 2 },
            "shipDesignation": "LNG Unit 3",
            "shipCount": 1
        },
        {
            "singleShipDimensions": { "width": 4, "height": 8 },
            "shipDesignation": "LNG Unit 4",
            "shipCount": 1
        },
        {
            "singleShipDimensions": { "width": 4, "height": 9 },
            "shipDesignation": "LNG Unit 5",
            "shipCount": 2
        },
        {
            "singleShipDimensions": { "width": 3, "height": 3 },
            "shipDesignation": "LNG Unit 6",
            "shipCount": 2
        },
        {
            "singleShipDimensions": { "width": 2, "height": 2 },
            "shipDesignation": "LNG Unit 7",
            "shipCount": 2
        },
    ]
  };

  request.post({
      url: 'http://localhost:3000/calculateRoundsWithLib',
      json: true,
      body: requestData
  }, function(_, response) {
      const responseBody = JSON.stringify(response.body);
      expect(responseBody).to.equal('2');
      done();
  });
});
