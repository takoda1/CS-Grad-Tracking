var schema = require("../models/schema.js")
var util = require("./util.js")

var studentController = {}

/**
 * @url {post} /student/post
 *
 * @description Called when a student is to be created,
 * receives fields from an html form, onyen, first name,
 * last name, and pid required.
 *
 * A form is submitted when student/post is called, and
 * the form data is stored in req.body
 *
 * @req.body {String} onyen (Required)
 * @req.body {String} firstName (Required)
 * @req.body {String} lastName (Required)
 * @req.body {Number} pid (Required)
 * @req.body {String} alternativeName
 * @req.body {enum: ["MALE", "FEMALE", "OTHER"]} gender
 * @req.body {enum: ["AIAN", "ASIAN", "BLACK", "HISPANIC", "PACIFIC", "WHITE"]} ethnicity
 * @req.body {String} fundingStatus
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
 * @req.body {Boolean} prpPassed
 * @req.body {Boolean} backgroundPrepWorksheetApproved
 * @req.body {Boolean} programOfStudyApproved
 * @req.body {Boolean} researchPlanningMeeting
 * @req.body {Boolean} committeeCompApproved
 * @req.body {Boolean} phdProposalApproved
 * @req.body {Boolean} oralExamPassed
 * @req.body {Boolean} dissertationDefencePassed
 * @req.body {Boolean} dissertationSubmitted
 * @req.body {Boolean} active
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
  input = verifyBoolean(input);
  //verify that the required fields are not null
  if(input.onyen != null && input.firstName != null && input.lastName != null && input.pid != null && input.pid != NaN){
    //try to find a student by unique identifiers: onyen or PID, display error page if one found
    schema.Student.findOne({$or: [{onyen: input.onyen}, {pid: input.pid}]}).exec().then(function (result) {
      if (result != null){
        res.render("../views/error.ejs", {string: "That student already exists."});
      }
      else if(input.pid.length != 9){
        res.render("../views/error.ejs", {string: "PID needs to be of length 9"});
      }
      else {
        var inputStudent = new schema.Student(util.validateModelData(input, schema.Student));
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
 * @req.query {String} onyen
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
  schema.Student.find(input).sort({onyen:1}).exec().then(function (result) {
    res.render("../views/student/index.ejs", {students: result});
  }).catch(function (err) {
    res.json({"error": err.message, "origin": "student.get"})
  });
}

/**
 * @url {post} /student/put
 *
 * @description Called when a student is to be updated,
 * field datat is sent as an html form, and onyen,
 * first name, last name, and pid are required.
 *
 * @req.body {String} onyen
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
  input = verifyBoolean(input);
  var input = util.validateModelData(input, schema.Student);
  if (input.onyen != null && input.firstName != null && input.lastName != null && input.pid != null && input.pid != NaN) {
    schema.Student.findOneAndUpdate({_id: input._id}, input).exec().then(function(result){
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
studentController.delete = function (req, res) {
  var id = req.params._id
  if (id != null) {
    /*Documents reference students; since documents are
    personal student documents, just delete the documents. 
    */
    schema.Student.findOneAndRemove({_id: id}).exec().then(function(result){
      if(result){
        schema.Document.find({student: id}).remove().exec();
        res.redirect("/student");
      }
      else throw new Error("StudentNotFound");
    });
  }
}

studentController.create = function(req, res){
  var genders, ethnicities, residencies, degrees, jobs, semesters;
  genders = schema.Student.schema.path("gender").enumValues;
  ethnicities = schema.Student.schema.path("ethnicity").enumValues;
  residencies = schema.Student.schema.path("residency").enumValues;
  degrees = schema.Student.schema.path("intendedDegree").enumValues;
  schema.Job.find({}).populate("supervisor").populate("semester").populate("course").exec().then(function(result){
    jobs = result;
    schema.Semester.find({}).sort({year:1, season:1}).exec().then(function(result){
      semesters = result;
      schema.Faculty.find({}).sort({lastName:1}).exec().then(function(result){
        res.render("../views/student/create", {faculty: result, semesters: semesters, jobs: jobs, degrees: degrees, residencies: residencies, ethnicities: ethnicities, genders: genders});
      });
    });
  });
}

studentController.edit = function(req, res){
  if(req.params._id){
    schema.Student.findOne({_id: req.params._id}).populate("semesterStarted").populate("advisor").exec().then(function(result){
      if(result != null){
        var genders, ethnicities, residencies, degrees, jobs, semesters, student;
        student = result;
        genders = schema.Student.schema.path("gender").enumValues;
        ethnicities = schema.Student.schema.path("ethnicity").enumValues;
        residencies = schema.Student.schema.path("residency").enumValues;
        degrees = schema.Student.schema.path("intendedDegree").enumValues;
        schema.Job.find({}).populate("supervisor").populate("semester").populate("course").exec().then(function(result){
          jobs = result;
          schema.Semester.find({}).sort({year:1, season:1}).exec().then(function(result){
            semesters = result;
            schema.Faculty.find({}).sort({lastName:1}).exec().then(function(result){
              res.render("../views/student/edit", {student: student, faculty: result, semesters: semesters, jobs: jobs, degrees: degrees, residencies: residencies, ethnicities: ethnicities, genders: genders});
            });
          });
        });
      }
      else{
        throw new Error("Student not found");
      }
    });
  }
  else{
    throw new Error("RequiredParamNotFound");
  }
}

studentController.jobs = function(req, res){
  if(req.params._id){
    schema.Student.findOne({_id: req.params._id}).populate("jobHistory").populate({path:"jobHistory", populate:{path:"supervisor"}})
    .populate({path:"jobHistory", populate:{path:"semester"}}).populate({path:"jobHistory", populate:{path:"course"}}).exec().then(function(result){
      res.render("../views/student/jobs", {student: result});
    });
  }
  else{
    //this shouldn't happen if frontend done correctly
    throw new Error("RequiredParamNotFound");
  }
}

studentController.deleteJob = function(req, res){
  var input = req.body;
  if(input.studentId != null && input.jobId != null){
    schema.Student.update({_id:input.studentId}, {$pull:{jobHistory: input.jobId}}).exec().then(function(result){
      res.redirect("/student/jobs/"+input.studentId);
    }).catch(function(err){
      res.render("../views/error.ejs", {string:"Student was not found."});
    });
  } 
  else{
    res.render("../views/error.ejs", {string: "Either studentId or jobId is missing."});
  }
}

studentController.formPage = function(req, res){
  if(req.params._id != null){
    schema.Student.findOne({_id: req.params._id}).exec().then(function(result){
      var formTitles = schema.Form.schema.path("title").enumValues;
      res.render("../views/student/forms", {student: result, formTitles: formTitles});
    });
  }
  else{
    res.render("../views/error.ejs", {string: "StudentId incorrect"});
  }
}

studentController.uploadForm = function(req, res){
  
}

function verifyBoolean(input){
  var m = schema.Student.schema.paths
  for(var key in m){
    if(m[key].instance === "Boolean"){
      if(input[key] == null){
        input[key] = false;
      }
    }
  }
  return input;
}

module.exports = studentController;
