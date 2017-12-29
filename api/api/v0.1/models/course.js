/* global reject */

var schema = require('../schema')
var util = require('../util')

var _ = {}

/**
 * @api {post} /api/course
 * @class Course
 *
 * @description All params are required
 *
 * @param {String} department Four letter representation of department
 * @param {String} number
 * @param {String} name
 * @param {String} category
 * @param {Number} hours
 * @param {String} faculty
 * @param {Object} semester
 *
 * @returns {Object} success The newly created or updated course data
 *
 * @throws {Object} InvalidDepartment
 * @throws {Object} UnknownFaculty
 * @throws {Object} UnknownSemester
 * @throws {Object} RequiredParamNotFound
 * @throws {Object} DuplicateCourse
 */
_.post = function (input, res) {
  schema.Semester.findOne(util.validateModelData(input, schema.Semester)).exec().then(function (result) {
    if (result) reject(new Error('DuplicateCourse'))
    else {
      var inputCourse = new schema.Semester(util.validateModelData(input, schema.Semester))
      return inputCourse.save()
    }
  }).then(function (course) {
    res.json(course)
  }).catch(function (err) {
    res.json({'error': err.message, 'origin': 'course.post'})
  })
}

/**
 * @api {get} /api/course
 * @class Course
 *
 * @description At least one param is required
 *
 * @param {String} department Four letter representation of the department
 * @param {Number} number
 * @param {String} name
 * @param {String} category
 * @param {Number} hours
 * @param {String} faculty
 * @param {Object} semester
 *
 * @returns {Object} success Matching courses
 *
 * @throws {Object}
 */
_.get = function (input, res) {

}

module.exports = _
