var express = require('express')
var sessions = require('client-sessions')
var path = require('path')
var bodyParser = require('body-parser')
var compress = require('compression')

var app = express()

// express api setup
app
  .use(compress())
  .use(sessions({
    cookieName: 'gradInfoSession',
    secret: 'ugzEbQSRk7YM23PAJn1yOeG9GkTak1xah70dF0ePF3PmsEMxoWan4ihH0ZLVfhdYDpWF6egzAhPHztW7dGxzkY6jMzjBsr3kQzlW',
    duration: 3 * 60 * 60 * 1000,
    activeDuration: 2 * 60 * 1000
  }))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .set('view cache', true)
  .use(function (req, res, next) {
    if (req.headers.uid) {
      res.cookie('onyen', req.headers.uid, { httponly: false })
    }
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE')
    next()
  })

// routes to use for api
app
  .use('/', express.static(path.join(__dirname, '../grad_project')))
  .use('/api', require('./api/v0.1/index'))
  .use('/api/v0.1', require('./api/v0.1/index'))

// catch 404 and forward to error handler
app.use(function (req, res) {
  var err = new Error('Not Found')
  err.status = 404
})

// production error handler
app.use(function (err, req, res) {
  console.log(err)
  res.status(err.status || 500)
  res.json({ 'error': err.message })
})

module.exports = app
