/* global reject */

var schema = require('../schema')
var util = require('../util')

var _ = {}

/**
 * @api {post} /api/faculty
 * @class Faculty
 *
 * @description All params required
 *
 * @param {String} username (Required)
 * @param {String} firstName (Required)
 * @param {String} lastName (Required)
 * @param {Number} pid (Required)
 *
 * @returns {Object} success Newly created or updated faculty data
 *
 * @throws {Object} DuplicateFaculty
 * @throws {Object} RequiredParamNotFound
 */
_.post = function (input, res) {
  schema.Faculty.findOne({username: input.username}).exec().then(function (result) {
    if (result) reject(new Error('DuplicateFaculty'))
    else {
      schema.Faculty.findOne({pid: input.pid}).exec().then(function (result) {
        if (result) reject(new Error('DuplicateFaculty'))
        else {
          if (input.username && input.firstName && input.lastName && input.pid) {
            var inputFaculty = new schema.Faculty(util.validateModelData(input, schema.Faculty))
            return inputFaculty
          } else reject(new Error('RequiredParamNotFound'))
        }
      })
    }
  }).then(function (faculty) {
    res.json(faculty)
  }).catch(function (err) {
    res.json({'error': err.message, 'origin': 'faculty.post'})
  })
}

/**
 * @api {get} /api/faculty
 * @class Faculty
 *
 * @description All params optional
 *
 * @param {String} username
 * @param {String} firstName
 * @param {String} lastName
 * @param {Number} pid
 *
 * @returns {Object} success Matching faculty
 */
_.get = function (input, res) {
  schema.Faculty.find(util.regexTransform(input, schema.Faculty)).exec().then(function (result) {
    res.json(result)
  }).catch(function (err) {
    res.json({'error': err.message, 'origin': 'student.get'})
  })
}

/**
 * @api {put} /api/faculty
 * @class Faculty
 *
 * @description username is required
 *
 * @param {String} username (Required)
 * @param {String} firstName
 * @param {String} lastName
 * @param {Number} pid
 *
 * @returns {Object} success Newly created or updated faculty data
 *
 * @throws {Object} FacultyNotFound
 * @throws {Object} RequiredParamNotFound
 */
_.put = function (input, res) {
  if (input.username) {
    schema.Faculty.findOne({username: input.username}).exec().then(function (result) {
      if (result) return schema.Faculty.findOneAndUpdate({username: input.username}, util.validateModelData(input, schema.Faculty)).exec()
      else reject(new Error('FacultyNotFound'))
    })
  } else {
    reject(new Error('RequiredParamNotFound')).catch(function (err) {
      res.json({'error': err.message, 'origin': 'faculty.put'})
    })
  }
}

/**
 * @api {delete} /api/faculty
 * @class Faculty
 *
 * @description username is required
 *
 * @param {String} username (Required)
 *
 * @returns {Object} success Deleted faculty data
 *
 * @throws {Object} FacultyNotFound
 * @throws {Object} RequiredParamNotFound
 */
_.delete = function (input, res) {
  if (input.username) {
    schema.Faculty.findOne({username: input.username}).exec().then(function (result) {
      if (result) return schema.Faculty.findOneAndRemove({username: input.username}).exec()
      else reject(new Error('FacultyNotFound'))
    }).then(function (result) {
      res.json(result)
    }).catch(function (err) {
      res.json({'error': err.message, 'origin': 'faculty.delete'})
    })
  } else {
    reject(new Error('RequiredParamNotFound')).catch(function (err) {
      res.json({'error': err.message, 'origin': 'faculty.delete'})
    })
  }
}

module.exports = _
