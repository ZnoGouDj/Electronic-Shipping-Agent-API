import { expect } from 'chai';
import request from 'request';

it('should be equal to 1', function(done) {
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

it('should be equal to 2', function(done) {
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

it('should be equal to 3', function(done) {
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