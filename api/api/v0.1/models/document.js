var schema = require('../schema')
var util = require('../util')

var mongoose = require('mongoose')
var Gridfs = require('gridfs-stream')

var _ = {}

/**
 * @api {post} /api/document
 * @class Document
 * 
 * @description All params are required
 * 
 * @param {String} title
 * @param {String} student 
 * 
 * @returns {Object} Newly created document object
 * 
 * @throws {Object} InvalidStudent
 */
_.post = function (input, res) {
  var inputDocument = new schema.Document(util.validateModelData(input, schema.Document))
  inputDocument.save().then(function (result) {
    res.json(result)
  }).catch(function (err) {
    res.json({'error': err.message, 'origin': 'document.post'})
  })
}

/**
 * @api {get} /api/document
 * @class Document
 * 
 * @description At least one parameter is required
 * 
 * @param {String} title
 * @param {String} student (MongoID)
 * 
 * @returns {Object} List of matching document objects
 * 
 * @throws {Object} InvalidStudent
 */
_.post = function (input, res) {
  schema.Student.
}