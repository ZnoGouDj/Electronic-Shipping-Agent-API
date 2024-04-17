import { expect } from 'chai';
import request from 'request';
import { describe } from 'mocha';

import { 
  requestData_trivial_1,
  requestData_trivial_2,
  requestData_trivial_3,
  requestData_trivial_rotation_1,
  requestData_average_1,
  requestData_average_2 
} from '../testData.mjs';

function makeRequest(url, requestData, expectedResponse, done) {
  request.post({
    url: url,
    json: true,
    body: requestData
  }, function(_, response) {
    const responseBody = JSON.stringify(response.body);
    expect(responseBody).to.equal(expectedResponse);
    done();
  });
};



describe('Calculate Rounds API with the library logic:', function() {
  it('Trivial. Should be equal to 1', function(done) {
    makeRequest('http://localhost:3000/calculateRoundsWithLib', requestData_trivial_1, '1', done);
  });

  it('Trivial. Should be equal to 2', function(done) {
    makeRequest('http://localhost:3000/calculateRoundsWithLib', requestData_trivial_2, '2', done);
  });

  it('Trivial. Should be equal to 3', function(done) {
    makeRequest('http://localhost:3000/calculateRoundsWithLib', requestData_trivial_3, '3', done);
  });

  it('Trivial rotation. Should be equal to 1', function(done) {
    makeRequest('http://localhost:3000/calculateRoundsWithLib', requestData_trivial_rotation_1, '1', done);
  });

  it('Average. Should be equal to 1', function(done) {
    makeRequest('http://localhost:3000/calculateRoundsWithLib', requestData_average_1, '1', done);
  });

  it('Average. Should be equal to 2', function(done) {
    makeRequest('http://localhost:3000/calculateRoundsWithLib', requestData_average_2, '2', done);
  });
});

describe('Calculate Rounds API with custom logic:', function() {
  it('Trivial. Should be equal to 1', function(done) {
    makeRequest('http://localhost:4000/calculateRounds', requestData_trivial_1, '1', done);
  });

  it('Trivial. Should be equal to 2', function(done) {
    makeRequest('http://localhost:4000/calculateRounds', requestData_trivial_2, '2', done);
  });

  it('Trivial. Should be equal to 3', function(done) {
    makeRequest('http://localhost:4000/calculateRounds', requestData_trivial_3, '3', done);
  });

  it('Trivial rotation. Should be equal to 1', function(done) {
    makeRequest('http://localhost:4000/calculateRounds', requestData_trivial_rotation_1, '1', done);
  });

  it('Average. Should be equal to 1', function(done) {
    makeRequest('http://localhost:4000/calculateRounds', requestData_average_1, '1', done);
  });

  it('Average. Should be equal to 2', function(done) {
    makeRequest('http://localhost:4000/calculateRounds', requestData_average_2, '2', done);
  });
});