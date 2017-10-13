
var router = require('express').Router()
var extend = require('xtend')
var multiparty = require('connect-multiparty')()

var admin = require('./models/admin')
var faculty = require('./models/faculty')
var student = require('./models/student')
var semester = require('./models/semester')
var course = require('./models/course')
var job = require('./models/job')
var document = require('./models/document')
var schema = require('./schema')

var fs = require('fs')
var mongoose = require('mongoose')
var Gridfs = require('gridfs-stream')

function routeHandler (req, res, callback) {
  var postdata = extend(req.params, req.query, req.body)
  if (Object.keys(postdata).length < 1) {
    res.json({
      'error': 'No query found',
      'origin': 'index'
    })
  } else {
    try {
      callback(postdata, res)
    } catch (err) {
      res.json({
        'error': err.message,
        'origin': 'index'
      })
    }
  }
}

// admin 
router.use('/admin/:username?', function (req, res, next) {
  routeHandler(req, res, admin[req.method.toLowerCase()])
})

// faculty
router.use('/faculty/:username?', function (req, res, next) {
  routeHandler(req, res, faculty[req.method.toLowerCase()])
})

// student
router.use('/student/:username?', function (req, res, next) {
  routeHandler(req, res, student[req.method.toLowerCase()])
})

// semester
router.use('/semester', function (req, res, next) {
  routeHandler(req, res, semester[req.method.toLowerCase()])
})

// course
router.use('/course', function (req, res, next) {
  routeHandler(req, res, course[req.method.toLowerCase()])
})

// job
router.use('/job', function (req, res, next) {
  routeHandler(req, res, job[req.method.toLowerCase()])
})

// document
router.use('/document/:id?', function (req, res, next) {
  routeHandler(req, res, document[req.method.toLowerCase()])
})

// document-file
router.post('/upload/:id', multiparty, function (req, res) {
  var gfs = new Gridfs(mongoose.connection.db, mongoose.mongo)

  schema.Image.findOne({_id: req.params.id}).exec(function (err, result) {
    if (err) {
      res.send({
        'error': 'UnknownID',
        'origin': 'imagefs.post'
      })
    } else {
      var writestream = gfs.createWriteStream({
        _id: req.params.id,
        filename: req.files.file.name,
        mode: 'w',
        content_type: req.files.file.mimetype,
        metadata: req.body
      })

      fs.createReadStream(req.files.file.path).pipe(writestream)

      writestream.on('close', function (file) {
        fs.unlink(req.files.file.path, function (err) {
          if (err) {
            res.send({
              'error': err,
              'origin': 'imagefs.post'
            })
          } else {
            res.send(result)
            console.log('Image file uploaded')
          }
        })
      })
    }
  })
})

router.get('/download/:id', function (req, res) {
  var gfs = new Gridfs(mongoose.connection.db, mongoose.mongo)

  schema.Image.findOne({_id: req.params.id}).exec(function (err, result) {
    if (err) {
      res.send({
        'error': 'UnknownID',
        'origin': 'imagefs.get'
      })
    } else {
      var readstream = gfs.createReadStream({
        _id: result._id
      })

      readstream.pipe(res)
    }
  })
})