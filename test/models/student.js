/* eslint-env mocha, chai, jasmine */
/* global assert, chai, uri */
var modelPath = '/api/students'
// var testStudentId

/**
 * Create test student
 */
describe('Create test student', function () {
  it('should successfully create test student', function (done) {
    chai.request(uri)
      .post(modelPath)
      .send({

      })
      .end(function (err, res) {
        if (err) throw err
        expect(res).to.have.status(200)
        assert.isObject(res.body, 'Response is an object')
        // testStudentId = res.body._id
        done()
      })
  })
})
