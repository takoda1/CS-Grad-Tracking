/* global reject */

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
 * @param {String} student (username)
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
 * @param {String} id
 * @param {String} title
 * @param {String} student (username)
 *
 * @returns {Object} List of matching document objects
 *
 * @throws {Object} InvalidStudent
 */
_.get = function (input, res) {
  schema.Student.findOne({username: input.student}).exec().then(function (result) {
    if (!result) reject(new Error('StudentNotFound'))
    else return schema.Document.find(util.regexTransform(input, schema.Document)).exec()
  }).then(function (result) {
    res.json(result)
  }).catch(function (err) {
    res.json({'error': err.message, 'origin': 'document.get'})
  })
}

/**
 * @api {put} /api/document
 * @class Document
 *
 * @description id is required
 *
 * @param {String} id (MongoID)
 *
 * @returns {Object} Newly updated document data
 *
 * @throws {Object} DocumentNotFound
 */
_.put = function (input, res) {
  schema.Document.findOne({_id: input.id}).exec().then(function (result) {
    if (!result) reject(new Error('DocumentNotFound'))
    else return schema.Document.findOneAndUpdate(util.validateModelData(input, schema.Document), {new: true}).exec()
  }).then(function (result) {
    res.json(result)
  }).catch(function (err) {
    res.json({'error': err.message, 'origin': 'document.put'})
  })
}

/**
 * @api {delete} /api/document
 * @class Document
 *
 * @description id is required
 *
 * @param {String} id (MongoID)
 *
 * @returns {Object} The deleted document object
 *
 * @throws {Object} DocumentNotFound
 */
_.delete = function (input, res) {
  schema.Document.findOne({_id: input.id}).exec().then(function (result) {
    if (result) return schema.Document.findOneAndRemove({_id: input.id}).exec()
    else reject(new Error('DocumentNotFound'))
  }).then(function (result) {
    var gfs = new Gridfs(mongoose.connection.db, mongoose.mongo)

    gfs.remove({_id: result._id}, function (err) {
      if (err) reject(new Error(err.message))
      else res.json(result)
    })
  }).catch(function (err) {
    res.json({'error': err.message, 'origin': 'document.delete'})
  })
}

module.exports = _
