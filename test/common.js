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
global.user = require('../api/api/v0.1/models/user')
global.image = require('../api/api/v0.1/models/image')

global.uri = 'http://localhost:3000'
