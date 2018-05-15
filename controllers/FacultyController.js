var schema = require('../models/schema')
var util = require('./util')

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
 * @returns {Object} success Newly created faculty data
 *
 * @throws {Object} DuplicateFaculty
 * @throws {Object} RequiredParamNotFound
 */
_.post = function (req, res) {
  var input = req.body; //because post request sent from form, get fields from the req's body
  schema.Faculty.findOne({$or: [{username: input.username}, {pid: input.pid}]}).exec().then(function (result) {
    if (result !== null) throw new Error('DuplicateFaculty')
    else {
      if (input.username && input.firstName && input.lastName && input.pid) {
        var inputFaculty = new schema.Faculty(util.validateModelData(input, schema.Faculty))
        inputFaculty.save()
        res.redirect("/faculty/edit/"+inputFaculty.username);
      } else{
        console.log(input.body);
       throw new Error('RequiredParamNotFound')
     }
    }
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
_.get = function (req, res) {
  var input = req.query;
  console.log(input);
  input = util.validateModelData(input, schema.Faculty);
  input = util.addSlashes(input);
  schema.Faculty.find(input).exec().then(function (result) {
    res.render("../views/faculty/index", {faculty: result});
  }).catch(function (err) {
    res.json({'error': err.message, 'origin': 'faculty.get'})
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
 * @success renders edit page with newly update data
 *
 * @throws {Object} FacultyNotFound
 */
_.put = function (req, res) {
  var input = req.body;
  if (req.params.username) {
    schema.Faculty.findOneAndUpdate({username: req.params.username}, util.validateModelData(input, schema.Faculty)).exec().then(function (result) {
      if (result){
        res.redirect("/faculty/edit/"+input.username);
      } 
      else throw new Error('FacultyNotFound')
    })
  } else {
    throw new Error('RequiredParamNotFound').catch(function (err) {
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
_.delete = function (req, res) {
  if (req.params.username) {
    schema.Faculty.findOneAndRemove({username: req.params.username}).exec().then(function(result){
      if(result){
        res.redirect("/faculty");
      }
      else throw new Error('FacultyNotFound');
    });
  } else {
    throw new Error('RequiredParamNotFound').catch(function (err) {
      res.json({'error': err.message, 'origin': 'faculty.delete'})
    })
  }
}

_.create = function(req, res){
  res.render("../views/faculty/create");
}

_.edit = function(req, res){
  if (req.params.username) { //access username from params because passed with faculty/edit/:username
    schema.Faculty.findOne({username: req.params.username}).exec().then(function (result) {
      if (result) res.render("../views/faculty/edit", {faculty: result});
      else throw new Error('FacultyNotFound');
    })
  } else {
    throw new Error('RequiredParamNotFound').catch(function (err) {
      res.json({'error': err.message, 'origin': 'faculty.edit'})
    })
  }
}

module.exports = _
