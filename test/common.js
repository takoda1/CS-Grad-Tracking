/* eslint-env mocha, chai */
global.chai = require('chai')
global.assert = global.chai.assert
global.expect = global.chai.expect
global.chai.should()
global.chai.config.includeStack = true
global.assert = require('assert')

global.chai.use(require('chai-http'))
global.chai.use(require('chai-fs'))

process.env.NODE_ENV = 'test'

global.www = require('../bin/www')
require('../test/models/faculty')

global.uri = 'http://localhost:3000'

// Drop the test database once tests are complete
var testDatabase = 'mongodb://localhost/cs_grad_data-test'
require('mongodb').MongoClient.connect(testDatabase, function (err, db) {
  if (err) throw err
  // delete the database
  db.dropDatabase(function (err, result) {
    if (err) throw err
    db.close()
  })
})
