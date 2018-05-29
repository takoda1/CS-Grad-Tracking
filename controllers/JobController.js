var schema = require('../models/schema.js');
var util = require('./util.js');

var jobController = {};

/**
 * @url {post} /job/post
 *
 * @description Called when a job is to be created,
 * receives fields from an html form, all fields
 * are required for a job to be created.
 *
 * @req.body {String} position (Required)
 * @req.body {String} supervisor (Required)
 * @req.body {String} course (Required)
 *
 * @success redirects to /job/edit/:_id route (which uses jobController.edit)
 * @failure renders error page with duplicate job message
 * 
 * @throws {Object} RequiredParamNotFound (should not occur if frontend done properly)
 */
jobController.post = function (req, res) {
  var input = req.body;
  if(util.allFieldsExist(input, schema.Job)){
    //attempt to populate faculty and course, if they don't exist, error will be caught
    schema.Job.findOne(input).populate("supervisor").populate("course").exec().then(function(result){
      if(result != null){
        res.render("../views/error.ejs", {string: "This job already exists."});
      }
      else{
        var inputJob = new schema.Job(util.validateModelData(input, schema.Job));
        inputJob.save().then(function(result){
          res.redirect("/job/edit/"+result._id);
        });
      }
    /*this is catching the error if the faculty or course
    provided does not exist (shouldn't occur if frontend
    done properly), and populate is failing*/
    }).catch(function(err){
      res.render("../views/error.ejs", {string: err.message});
    });
    
  }
  else{
    throw new error("RequiredParamNotFound");
  }
}

/**
 * @url {get} /job
 *
 * @description Called when /job/index.ejs is to be rendered,
 * accepts search fields as an html query
 *
 * @req.query {String} position
 * @req.query {String} supervisor (_id)
 * @req.query {String} course (_id)
 *
 * @finish renders /job/index.ejs
 * if no courses are found, then the
 * page indicates that none are found
 */
jobController.get = function (req, res) {
  var input = req.query;
  console.log(input);
  input = util.validateModelData(input, schema.Job); //remove fields that are empty/not part of job definition
  if(input.position != null){
    input.position = new RegExp(input.position, "i");
  }
  schema.Job.find(input).populate("supervisor").populate("course").exec().then(function (result) {
    var jobs, faculty;
    jobs = result;
    getFaculty().then(function(result){
      faculty = result;
      getCourses().then(function(result){
        res.render("../views/job/index.ejs", {jobs: jobs, faculty: faculty, courses: result});
      });
    });
  }).catch(function (err) {
    res.json({'error': err.message, 'origin': 'job.get'})
  });
}

/**
 * @url {post} /job/put
 *
 * @description Called when a job is to be updated,
 * field data is sent as an html form, and all fields
 * are required.
 *
 * @req.body {String} _id (MongoID)
 * @req.body {String} position
 * @req.body {String} supervisor
 * @req.body {String} course
 *
 * @success redirects to /job/edit/:_id (jobController.edit)
 * which displays the newly updated job data
 *
 * @throws {Object} JobNotFound (should not occur if frontend done properly)
 * @throws {Object} RequiredParamNotFound (should not occur if frontend done properly)
 */
jobController.put = function (req, res) {
  var input = req.body;
  input = util.validateModelData(input, schema.Job);
  if(util.allFieldsExist(input, schema.Job)){
    schema.Job.findOneAndUpdate({_id: input._id}, input).exec().then(function(result){
      if(result != null){
        res.redirect("/job/edit/"+result._id);
      }
      else{
        throw new Error("JobNotFound");
      }
    }).catch(function(err){
      res.json({"error": err.message, "origin": "job.put"});
    });
  }
  else{
    throw new Error("RequiredParamNotFound");
  }
}

/**
 * @url {post} /job/delete/:_id
 * @class Job
 *
 * @description Called when a job is to be deleted,
 * requires _id, to be sent as a html parameter.
 *
 * @req.params {String} id (Required)
 *
 * @success redirects to /job (jobController.get)
 * @failure renders error.ejs with appropriate error message
 *
 * @throws {Object} JobNotFound (should not occur if frontend done properly)
 * @throws {Object} RequiredParamNotFound (should not occur if frontend done properly)
 */
jobController.delete = function (req, res) {
  var id = req.params._id;
  if (id != null) {
    //students reference jobs, so check if any students are referencing before deleting
    schema.Student.find({job: id}).exec().then(function(result){
      if(result.length > 0){
        res.render("../views/error.ejs", {string: "Could not delete job because a student is referencing it."})
      }
      else{
        //nothing references this job, so try to delete it
        schema.Job.findOneAndRemove({_id: id}).exec().then(function(result){
          if(result){
            res.redirect("/job");
          }
          else throw new Error("JobNotFound");
        });
      }
    });
  }
  else{
    throw new Error("RequiredParamNotFound");
  }
}

/*
 * @url {get} /job/create
 * 
 * @description renders /job/create.ejs
 *
 */
jobController.create = function(req, res){
  var faculty;
  getFaculty().then(function(result){
    faculty = result;
    getCourses().then(function(result){
      res.render("../views/job/create.ejs", {faculty: faculty, courses: result});
    });
  });
 
}

/**
 * @url {get} /job/edit/:_id
 *
 * @description Called when a job is to be
 * edited by the user. _id is required, and is
 * sent in a html parameter.
 *
 * @param {String} _id (Required)
 *
 * @finish renders job/edit.ejs with the job
 * to be edited
 *
 * @throws {Object} JobNotFound (shouldn't occur if frontend done properly)
 * @throws {Object} RequiredParamNotFound (shouldn't occur if frontend done properly)
 */
jobController.edit = function(req, res){
  if (req.params._id) { //_id from params because passed with job/edit/:_id
    schema.Job.findOne({_id: req.params._id}).populate("supervisor").populate("course").exec().then(function (result) {
      if (result != null) {
        var job, faculty;
        job = result;
        getFaculty().then(function(result){
          faculty = result;
          getCourses().then(function(result){
            res.render("../views/job/edit.ejs", {job: job, faculty: faculty, courses: result});
          });
        });
      }
      else throw new Error("JobNotFound");
    });
  } else {
    throw new Error("RequiredParamNotFound");
  }
}

function getFaculty(){
  return new Promise((resolve, reject)=>{
    schema.Faculty.find().sort({username:1}).exec().then(function(result){
      resolve(result);
    });
  });
}

function getCourses(){
  return new Promise((resolve, reject)=>{
    schema.Course.find().sort({name:1}).exec().then(function(result){
      resolve(result);
    });
  });
}


module.exports = jobController;
