var schema = require('../models/schema')
var util = require('./util')

var _ = {}

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
_.post = function (req, res) {
  var input = req.body;
  schema.Semester.findOne(input).exec().then(function (result) {
    if (result !== null) throw new Error('DuplicateSemester')
    else {
      if(input.year && input.season){
        var inputSemester = new schema.Semester(util.validateModelData(input, schema.Semester))
        inputSemester.save();
        res.redirect("/semester");
      }
    }
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
_.get = function (req, res) {
  var input = req.query;
  input = util.validateModelData(input, schema.Semester);
  input = util.addSlashes(input);
  schema.Semester.find(input).exec().then(function (result) {
    res.render("../views/semester/index", {semesters: result});
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
_.delete = function (req, res) {
  var input = req.body;
  input = util.validateModelData(input, schema.Semester);
  if (input.year && input.season) {
    schema.Semester.findOneAndRemove(input).exec().then(function (result){
      if(result){
        res.redirect('/semester');
      }
      else{
        throw new error('SemesterNotFound');
      }
    });
  }
  else {
    throw new Error('RequiredParamNotFound').catch(function (err) {
      res.json({'error': err.message, 'origin': 'semester.delete'})
    })
  }
}

_.create = function (req, res){
  res.render('../views/semester/create');
}

module.exports = _
