var schema = require('../schema')
var util = require('../util')

var _  = {}
var regexSlashes = /\/*\//ig

/**
 * @api {post} /api/semester
 * @class Semester
 * 
 * @description All params required 
 * 
 * @param {Number} year 
 * @param {enum ['FALL', 'SPRING']} season
 *
 * @returns {Object} success Newly created semester
 * 
 * @throws {Object} DuplicateSemester
 * @throws {Object} RequiredParamNotFound
 */
_.post = function (input, res) {
  schema.Semester.findOne(util.validateModelData(input, schema.Semester)).exec().then(function (result) {
    if (result) reject(new Error('DuplicateSemester'))
    else {
      inputSemester = new schema.Semester(util.validateModelData(input, schema.Semester))
      return inputSemester.save()
    }
  }).then(function (semester) {
    res.json(semester)
  }).catch(function (err) {
    res.json({'error': err.message, 'origin': 'semester.post'})
  })
}

/**
 * @api {get} /api/semester
 * @class Semester
 * 
 * @description All params optional
 * 
 * @param {Number} year
 * @param {enum ['FALL', 'SPRING']} season
 * 
 * @returns {Object} success Matching semesters
 */
_.get = function (input, res) {
  schema.Semester.find(util.validateModelData(input, schema.Semester)).exec().then(function (result) {
    res.json(result)
  }).catch(function (err) {
    res.json({'error': err.message, 'origin': 'semester.get'})
  })
}

/**
 * @api {delete} /api/semester
 * @class Semester
 * 
 * @description All params required
 * 
 * @param {Number} year (Required)
 * @param {enum ['FALL', 'SPRING']} season (Required)
 * 
 * @returns {Object} success 
 * 
 * @throws {Object} SemesterNotFound
 * @throws {Object} RequiredParamNotFound
 */
_.delete = function (input, res) {
  if (input.year && input.season) {
    schema.Semester.findOne(util.validateModelData(input, schema.Semester)).exec().then(function (result) {
      if (result) return schema.Semester.findOneAndRemove(util.validateModelData(input, schema.Semester))
      else reject(new Error('SemesterNotFound'))
    }).then(function (semester) {
      res.json(semester)
    }).catch(function (err) {
      res.json({'error': err.message, 'origin': 'semester.delete'})
    })
  } else {
    reject(new Error('RequiredParamNotFound')).catch(function (err) {
      res.json({'error': err.message, 'origin': 'semester.delete'})
    })
  }
}

module.exports = _