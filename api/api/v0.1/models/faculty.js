var schema = require('../schema')
var util = require('../util')

var _ = {}
var regexSlashes = /\/*\//ig

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
  var query = util.validateModelData(input, schema.Faculty)
  if (input.username || input.firstName || input.lastName) {
    query.username = (input.username.match(regexSlashes)) ? new RegExp(input.username.substring(1, input.username.length - 1), 'ig') : input.username
    query.firstName = (input.firstName.match(regexSlashes)) ? new RegExp(input.firstName.substring(1, input.firstName.length - 1), 'ig') : input.firstName
    query.lastName = (input.lastName.match(regexSlashes)) ? new RegExp(input.lastName.substring(1, input.lastName.length - 1), 'ig') : input.lastName
  }

  schema.Faculty.find(query).exec().then(function (result) {
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