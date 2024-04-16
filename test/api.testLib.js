import('chai').then(chai => {
  const chaiHttp = chai.default.use(require('chai-http'));
  const app = require('../indexLib');

  const { expect } = chai;
  
  chai.use(chaiHttp);
  
  describe('API Tests', function() {
    it('should return the minimum number of rounds', function(done) {
      chai.request(app)
        .post('/calculateRoundsWithLib')
        .send({
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
        })
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.equal(1);
          done();
        });
    });
  });
});

