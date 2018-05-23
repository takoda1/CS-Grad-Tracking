var schema = require("../models/schema.js")
var util = require("./util.js")

var studentController = {}

/**
 * @url {post} /student/post
 *
 * @description Called when a student is to be created,
 * receives fields from an html form, username, first name,
 * last name, and pid required.
 *
 * A form is submitted when student/post is called, and
 * the form data is stored in req.body
 *
 * @req.body {String} username (Required)
 * @req.body {String} firstName (Required)
 * @req.body {String} lastName (Required)
 * @req.body {Number} pid (Required)
 * @req.body {String} alternativeName
 * @req.body {enum: ["MALE", "FEMALE", "OTHER"]} gender
 * @req.body {enum: ["AIAN", "ASIAN", "BLACK", "HISPANIC", "PACIFIC", "WHITE"]} ethnicity
 * @req.body {String} status
 * @req.body {Boolean} citizenship
 * @req.body {enum: ["YES", "NO", "APPLIED"]} residency
 * @req.body {String} enteringStatus
 * @req.body {String} researchArea
 * @req.body {Boolean} backgroundApproved
 * @req.body {String} leaveExtension
 * @req.body {Boolean} fundingEligibility
 * @req.body {Boolean} fundingStatus
 * @req.body {enum: ["MASTERS", "PHD", "BOTH"]} intendedDegree
 * @req.body {Number} hoursCompleted
 * @req.body {Boolean} prp
 * @req.body {Boolean} oralExam
 * @req.body {Boolean} committeeMeeting
 * @req.body {Boolean} allButDissertation
 * @req.body {Boolean} dissertationDefence
 * @req.body {Boolean} finalDissertation
 * @req.body {Object} semesterStarted
 * @req.body {String} advisor
 * @req.body {Object} courseHistory (MongoID array)
 *
 * @success redirects to /student/edit/:_id route (which uses studentController.edit)
 * @failure renders error page with duplicate student message
 *
 * @throws {Object} RequiredParamNotFound (should not occur if frontend is done correctly)
 */
studentController.post = function (req, res) {
  var input = req.body;
  //verify that the required fields are not null
  if(input.username != null && input.firstName != null && input.lastName != null && input.pid != null && input.pid != NaN){
    //try to find a student by unique identifiers: username or PID, display error page if one found
    schema.Student.findOne({$or: [{username: input.username}, {pid: input.pid}]}).exec().then(function (result) {
      if (result != null){
        res.render("../views/error.ejs", {string: "That student already exists."});
      }
      else {
        if(input.citizenship == null){
          input.citizenship = false;
        }
        var inputStudent = new schema.Student(util.validateModelData(input, schema.Student))
        /*use the then function because save() is asynchronous. If you only have inputStudent.save(); res.redirect...
        it is possible that the data does not save in time (or load in time if performing queries that return data
        that is to be sent to a view) before the view loads which can cause errors. So put view rendering code which is
        reliant on database operations inside of the then function of those operations*/
        inputStudent.save().then(function(result){
          res.redirect("/student/edit/"+result._id);
        });
      }
    }).catch(function (err) {
      res.json({"error": err.message, "origin": "student.post"})
    });
  }
  else{
    throw new Error("RequiredParamNotFound");
  }
}

/**
 * @url {get} /student
 *
 * @description Called when /student/index.ejs is to be rendered,
 * accepts search fields as an html query, all fields optional
 *
 * @req.query {String} username
 * @req.query {String} firstName
 * @req.query {String} lastName
 * @req.query {Number} pid
 * @req.query {String} alternativeName
 * @req.query {enum: ["MALE", "FEMALE", "OTHER"]} gender
 * @req.query {enum: ["AIAN", "ASIAN", "BLACK", "HISPANIC", "PACIFIC", "WHITE"]} ethnicity
 * @req.query {String} status
 * @req.query {Boolean} citizenship
 * @req.query {enum: ["YES", "NO", "APPLIED"]} residency
 * @req.query {String} enteringStatus
 * @req.query {String} researchArea
 * @req.query {Boolean} backgroundApproved
 * @req.query {String} leaveExtension
 * @req.query {Boolean} fundingEligibility
 * @req.query {Boolean} fundingStatus
 * @req.query {enum: ["MASTERS", "PHD", "BOTH"]} intendedDegree
 * @req.query {Number} hoursCompleted
 * @req.query {Boolean} prp
 * @req.query {Boolean} oralExam
 * @req.query {Boolean} committeeMeeting
 * @req.query {Boolean} allButDissertation
 * @req.query {Boolean} dissertationDefence
 * @req.query {Boolean} finalDissertation
 * @req.query {String} semesterStarted (MongoID)
 * @req.query {String} advisor (MongoID)
 * @req.query {Object} courseHistory (MongoID array)
 *
 * @finish renders /student/index.ejs with found students
 * if no students found, then the page indicates
 * that no students are found.
 */
studentController.get = function (req, res) {
  var input = req.query;
  input = util.validateModelData(input, schema.Student); //remove fields that are empty/not part of Student definition
  input = util.makeRegexp(input); //make all text fields regular expressions with ignore case
  schema.Student.find(input).sort({username:1}).exec().then(function (result) {
    res.render("../views/student/index.ejs", {students: result});
  }).catch(function (err) {
    res.json({"error": err.message, "origin": "student.get"})
  });
}

/**
 * @url {post} /student/put
 *
 * @description Called when a student is to be updated,
 * field datat is sent as an html form, and username,
 * first name, last name, and pid are required.
 *
 * @req.body {String} username
 * @req.body {String} firstName
 * @req.body {String} lastName 
 * @req.body {Number} pid
 * @req.body {String} alternativeName
 * @req.body {enum: ["MALE", "FEMALE", "OTHER"]} gender
 * @req.body {enum: ["AIAN", "ASIAN", "BLACK", "HISPANIC", "PACIFIC", "WHITE"]} ethnicity
 * @req.body {String} status
 * @req.body {Boolean} citizenship
 * @req.body {enum: ["YES", "NO", "APPLIED"]} residency
 * @req.body {String} enteringStatus
 * @req.body {String} researchArea
 * @req.body {Boolean} backgroundApproved
 * @req.body {String} leaveExtension
 * @req.body {Boolean} fundingEligibility
 * @req.body {Boolean} fundingStatus
 * @req.body {enum: ["MASTERS", "PHD", "BOTH"]} intendedDegree
 * @req.body {Number} hoursCompleted
 * @req.body {Boolean} prp
 * @req.body {Boolean} oralExam
 * @req.body {Boolean} committeeMeeting
 * @req.body {Boolean} allButDissertation
 * @req.body {Boolean} dissertationDefence
 * @req.body {Boolean} finalDissertation
 * @req.body {String} semesterStarted (MongoID)
 * @req.body {String} advisor (MongoID)
 * @req.body {Object} courseHistory (MongoID array)
 *
 * @success redirects to /student/edit/:_id (studentController.edit)
 * which displays the newly updated student data
 *
 * @throws {Object} StudentNotFound (should not occur if frontend done correctly)
 * @throws {Object} RequiredParamNotFound (should not occur if frontend done correctly)
 */
studentController.put = function (req, res) {
  var input = req.body;
  var input = util.validateModelData(input, schema.Student);
  if (input.username != null && input.firstName != null && input.lastName != null && input.pid != null && input.pid != NaN) {
    schema.Student.findOneAndUpdate({_id: input._id}).exec().then(function(result){
      if(result != null){
        res.redirect("/student/edit/"+result._id);
      }
      else throw new Error("StudentNotFound");
    });
  }
  else{
    throw new Error("RequiredParamNotFound");
  }
}

/**
 * @url {post} /student/delete/:_id
 *
 * @description Called when a student is to be deleted,
 * requires _id, to be sent as an html parameter
 *
 * @req.params {String} _id (Required)
 *
 * @success redirects to /student (studentController.get)
 * @faillure renders error.ejs with error message
 *
 * @throws {Object} StudentNotFound (should not be thrown if front end is done correctly)
 * @throws {Object} RequiredParamNotFound (should not be thrown if front end is done correctly)
 */
studentController.delete = function (input, res) {
  var id = req.params._id
  if (id != null) {
    /*Jobs and documents reference students; since documents are
    personal student documents, just delete the documents. For job,
    however, you want to keep the job but delete the student from
    the list of students holding the job.
    */
    schema.Student.findOneAndRemove({_id: id}).exec().then(function(result){
      schema.Job.find({students: {$elemMatch: {_id: id}}}).exec().then(function(result){

      });
      schema.Document.find({student: id}).remove().exec();

    });
  }
}

module.exports = studentController;
