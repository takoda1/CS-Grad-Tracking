/* eslint-env mocha, chai, jasmine */
/* global assert, chai, uri */
var modelPath = '/api/faculty'
var testFacultyId

/**
 * Tests POST requests for /faculty
 * Should return faculty object
 * Asserts 200
 */
describe('POST requests for /faculty', function () {
  it('should require username', function (done) {
    chai.request(uri)
      .post(modelPath)
      .send({
        firstName: 'random',
        lastName: 'random',
        pid: 123456789
      })
      .end(function (err, res) {
        if (err) throw err
        expect(res).to.have.status(200)
        expect(res.body).to.have.property('error').equal('RequiredParamNotFound')
        done()
      })
  })
  it('should require firstName', function (done) {
    chai.request(uri)
      .post(modelPath)
      .send({
        username: 'random',
        lastName: 'random',
        pid: 123456789
      })
      .end(function (err, res) {
        if (err) throw err
        expect(res).to.have.status(200)
        expect(res.body).to.have.property('error').equal('RequiredParamNotFound')
        done()
      })
  })
  it('should require lastName', function (done) {
    chai.request(uri)
      .post(modelPath)
      .send({
        username: 'random',
        firstName: 'random',
        pid: 123456789
      })
      .end(function (err, res) {
        if (err) throw err
        expect(res).to.have.status(200)
        expect(res.body).to.have.property('error').equal('RequiredParamNotFound')
        done()
      })
  })
  it('should require PID', function (done) {
    chai.request(uri)
      .post(modelPath)
      .send({
        username: 'random',
        firstName: 'random',
        lastName: 'random'
      })
      .end(function (err, res) {
        if (err) throw err
        expect(res).to.have.status(200)
        expect(res.body).to.have.property('error').equal('RequiredParamNotFound')
        done()
      })
  })
  it('should successfully add a faculty member', function (done) {
    chai.request(uri)
      .post(modelPath)
      .send({
        username: 'random',
        firstName: 'random',
        lastName: 'random',
        pid: 123456789
      })
      .end(function (err, res) {
        if (err) throw err
        expect(res).to.have.status(200)
        expect(res.body).to.not.have.property('error')
        testFacultyId = res.body._id
        done()
      })
  })
})

/**
 * GET requests for /faculty
 * Should return faculty object
 * Asserts 200
 */
describe('GET requests for /faculty', function () {
  it('should return all faculty when no parameters are given', function (done) {
    chai.request(uri)
      .get(modelPath)
    .end(function (err, res) {
      if (err) throw err
      expect(res).to.have.status(200)
      assert.equal(res.body.length, 1, 'Response is incorrect length')
      assert.equal(res.body[0]._id, testFacultyId, 'Response has unknown id')
      done()
    })
  })
})
