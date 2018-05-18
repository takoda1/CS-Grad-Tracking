var schema = require("../models/schema")
var util = require("./util")

var semesterController = {}

/**
 * @url {post} /semester/post
 *
 * @description Called when a semester is to be created,
 * receives fields from an html form, and all
 * fields are required when creating a semester.
 * 
 * A form is submitted when the action semester/post is called, and
 * the form data is stored in req.body
 * 
 * @req.body {Number} year
 * @req.body {enum ["FALL", "SPRING"]} season
 *
 * @success redirects to /semester route (which uses semesterController.get)
 * @failure renders error page with duplicate semester message
 * 
 * @throws {Object} RequiredParamNotFound (shouldn't occur if frontend done properly)
 */
semesterController.post = function (req, res) {
  var input = req.body; //form data stored in req.body
  if(util.allFieldsExist(input, schema.Semester)){ //verify that all fields exist
    schema.Semester.findOne(input).exec().then(function (result) {
      if (result != null){
        res.render("../views/error.ejs", {string: "That semester already exists."});
      }
      else {
        //next four lines save the semester and redirect to the /semester page
        var inputSemester = new schema.Semester(util.validateModelData(input, schema.Semester));
        inputSemester.save().then(function(result){
          res.redirect("/semester");
        });
      }
    }).catch(function (err) {
      res.json({"error": err.message, "origin": "semester.post"})
    })
  }
  else{
    throw new Error("RequiredParamNotFound");
  }
  
}

/**
 * @url {get} /semester
 *
 * @description Called when the index page is to be rendered,
 * accepts search fields as a html query.
 * 
 * The fields are in req.query when they are provided (searched for)
 *
 * @req.query {Number} year
 * @req.query {enum ["FALL", "SPRING"]} season
 *
 * @finish renders /semester/index.ejs,
 * if no semesters exist, then the page just indicates that no semesters
 * were found
 */
semesterController.get = function (req, res) {
  var input = req.query; //access query
  /*remove fields that are empty/not part of Semester definition
  If all fields are empty, then input just becomes {} which searches
  for all semesters*/
  input = util.validateModelData(input, schema.Semester); 
  input = util.addSlashes(input); //make all text fields regular expressions with ignore case
  //Find the semesters and sort by year then season, render /semester/index.ejs on completion
  schema.Semester.find(input).sort({year:1, season:1}).exec().then(function (result) {
    res.render("../views/semester/index.ejs", {semesters: result});
  }).catch(function (err) {
    res.json({"error": err.message, "origin": "semester.get"})
  })
}

/**
 * @url {post} /semester/delete:_id
 * 
 * @description Called when a semester is to be deleted,
 * requires _id, to be sent as an html parameter
 *
 * @req.params {String} _id (Required)
 *
 * @success redirects to /semester route (which uses semesterController.get)
 * @failure renders error.ejs

 * @throws {Object} SemesterNotFound  (shouldn't occur if frontend done correctly)
 * @throws {Object} RequiredParamNotFound (shouldn't occur if frontend done correctly)
 */
semesterController.delete = function (req, res) {
  var id = req.params._id;
  if (id != null) {
    /*mongo doesn't seem to have built in checking if a document is referenced 
    before deleting it, so we have to do it manually, first check if any
    course references this semester*/
    schema.Course.find({semester: id}).exec().then(function(result){
      if(result.length > 0){
        model = "course";
        res.render("../views/error.ejs", {string: "Could not delete semester because a course is referencing it."});
      }
      else{
        //check if any student references this semester
        schema.Student.find({semesterStarted: id}).exec().then(function(result){
          if(result.length > 0){
            model = "student";
            res.render("../views/error.ejs", {string: "Could not delete semester because a student is referencing it."});
          }
          else{
            //nothing references this semester so it is safe to try to delete it
            schema.Semester.findOneAndRemove({_id: id}).exec().then(function (result){
              if(result){
                res.redirect("/semester");
              }
              else{
                throw new error("SemesterNotFound");
              }
            });
          }
        });
      }
    });
  }
  else {
    throw new Error("RequiredParamNotFound");
  }
}

/**
 * @url {get} /semester/create
 *
 * @description renders /semester/create.ejs page
 *
 */
semesterController.create = function (req, res){
  res.render("../views/semester/create.ejs");
}

module.exports = semesterController;
