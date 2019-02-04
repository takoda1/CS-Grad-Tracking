var schema = require("../models/schema.js");
var util = require("./util.js");
var XLSX = require("xlsx");
var fs = require("fs");
var path = require("path");
var formidable = require("formidable");

var facultyController = {};

/**
 * @url {post} /faculty/post
 *
 * @description Called when a faculty is to be created,
 * receives fields from an html form, all fields 
 * are required for a faculty to be created.
 * 
 * A form is submitted when faculty/post is called, and
 * the form data is stored in req.body
 * 
 * @req.body {String} onyen (Required)
 * @req.body {String} firstName (Required)
 * @req.body {String} lastName (Required)
 * @req.body {Number} pid (Required)
 * @req.body {Boolean} active (Required)
 *
 * @success redirects to /faculty/edit/:_id route (which uses facultyController.edit)
 * @failure renders error page with duplicate faculty message
 * 
 * @throws {Object} RequiredParamNotFound (shouldn't occur if frontend done properly)
 */
facultyController.post = function (req, res) {
  var input = req.body; //because post request sent from form, get fields from the req"s body
  /*html checkboxes don't send false if the box is checked, it just sends nothing,
  so check if input.active equals null, if it is, that means the box wasn't checked,
  so input.active should be assigned the value false*/
  if(input.active == null){
    input.active = false;
  }
  if(input.admin == null){
    input.admin = false;
  }
  //Verify that all fields exist. Should be though if front end is done correctly.
  if(util.allFieldsExist(input, schema.Faculty)){
    /*onyen and pid are unique, so look for faculty using those two fields to check
    if the faculty attempting to be created already exists*/
    schema.Faculty.findOne({$or: [{onyen: input.onyen}, {pid: input.pid}]}).exec().then(function (result) {
      if (result !== null){
        res.render("../views/error.ejs", {string: "That faculty already exists"});
      }
      else if(input.pid.length != 9){
        res.render("../views/error.ejs", {string: "PID needs to be of length 9"});
      }
      else {
        input.onyen = input.onyen[0].toUpperCase()+input.onyen.toLowerCase().slice(1);
        input.firstName = input.firstName[0].toUpperCase()+input.firstName.toLowerCase().slice(1);
        input.lastName = input.lastName[0].toUpperCase()+input.lastName.toLowerCase().slice(1); 
   
        var inputFaculty = new schema.Faculty(util.validateModelData(input, schema.Faculty))
        /*use the then function because save() is asynchronous. If you only have inputFaculty.save(); res.redirect...
        it is possible that the data does not save in time (or load in time if performing queries that return data
        that is to be sent to a view) before the view loads which can cause errors. So put view rendering code which is
        reliant on database operations inside of the then function of those operations*/
        inputFaculty.save().then(function(result){
          /*result of save function is the newly created faculty object, so
          access _id from result*/
          console.log(result);
          res.redirect("/faculty/edit/"+result._id);
        });
      }
    }).catch(function (err) {
      res.json({"error": err.message, "origin": "faculty.post"});
    });
  }
  //if all of the fields are not provided throw this error
  else{
    throw new Error("RequiredParamNotFound");
  }
}

/**
 * @url {get} /faculty
 *
 * @description Called when /faculty/index.ejs is to be rendered,
 * accepts search fields as an html query
 *
 * The fields are in req.query when they are provided (searched for)
 *
 * @req.query {String} onyen
 * @req.query {String} firstName
 * @req.query {String} lastName
 * @req.query {Number} pid
 * @req.query {Boolean} active
 *
 * @finish renders /faculty/index.ejs
 * if no faculty are found, then the page
 * just indicates that none are found
 */
facultyController.get = function (req, res) {
  var input = req.query;
  input = util.validateModelData(input, schema.Faculty); //remove fields that are empty/not part of Faculty definition
  var search = util.listObjectToString(input);
  input = util.makeRegexp(input); //make all text fields regular expressions with ignore case
  //find the faculty and sort by onyen, render /faculty/index.ejs on completion
  schema.Faculty.find(input).sort({lastName:1, firstName:1}).exec().then(function (result) {
    res.render("../views/faculty/index.ejs", {faculty: result, search: search});
  }).catch(function (err) {
    res.json({"error": err.message, "origin": "faculty.get"});
  });
}

/**
 * @url {post} /faculty/put
 *
 * @description Called when a faculty is to be updated,
 * field data is sent as an html form, and all
 * fields are required.
 *
 * @req.body {String} onyen (Required)
 * @req.body {String} firstName (Required)
 * @req.body {String} lastName (Required)
 * @req.body {Number} pid (Required)
 * @req.body {Boolean} active (Required)
 * 
 * @success redirects to /faculty/edit/:_id (facultyController.edit)
 * which displays the newly updated faculty data
 *
 * @throws {Object} RequiredParamNotFound (should not occur if frontend done properly)
 * @throws {Object} FacultyNotFound (shouldn't occur if frontend done properly)
 */
facultyController.put = function (req, res) {
  var input = req.body;
  if(input.active == null){
    input.active = false;
  }
  if(input.admin == null){
    input.admin = false;
  }
  var input = util.validateModelData(input, schema.Faculty);
  if (util.allFieldsExist(input, schema.Faculty)) {
    schema.Faculty.findOneAndUpdate({_id: input._id}, input).exec().then(function (result) {
      if (result != null){
        res.redirect("/faculty/edit/"+result._id);
      } 
      else throw new Error("FacultyNotFound");
    });
  } else {
    throw new Error("RequiredParamNotFound");
  }
}

/**
 * @url {post} /faculty/delete/:_id
 *
 * @description Called when a faculty is to be deleted,
 * requires _id, to be sent as a html parameter.
 *
 * @req.params {String} _id (Required)
 *
 * @success redirects to /faculty (facultyController.get)
 * @failure renders error.ejs with error message
 *
 * @throws {Object} FacultyNotFound (should not be thrown if front end is done correctly)
 * @throws {Object} RequiredParamNotFound (shouldn't occur if frontend done properly)
 */
facultyController.delete = function (req, res) {
  var id = req.params._id;
  if (id != null) {
    /*courses, students, and jobs reference faculty, so have to check
    if they reference this faculty. Doesn't seem to be any default mongo 
    behavior for delete/remove that checks if any outside document is 
    referencing the faculty*/
    schema.Course.find({faculty: id}).exec().then(function(result){
      if(result.length > 0){
        res.render("../views/error.ejs", {string: "Could not delete faculty because a course is referencing it."});
      }
      else{
        schema.Student.find({advisor: id}).exec().then(function(result){
          if(result.length > 0){
            res.render("../views/error.ejs", {string: "Could not delete faculty because a student is referencing it."});
          }
          else{
            schema.Job.find({supervisor: id}).exec().then(function(result){
              if(result.length > 0){
                res.render("../views/error.ejs", {string: "Could not delete faculty because a job is referencing it."});
              }
              else{
                //nothing references this faculty, so try to delete it
                schema.Faculty.findOneAndRemove({_id: id}).exec().then(function(result){
                  if(result){
                    res.redirect("/faculty");
                  }
                  else throw new Error("FacultyNotFound");
                });
              }
            });
          }
        });
      }
    });
  } else {
    throw new Error("RequiredParamNotFound");
  }
}

/*
 * @url {get} /faculty/create
 *
 * @description renders /faculty/create.ejs
 *
 */
facultyController.create = function(req, res){
  res.render("../views/faculty/create.ejs");
}

/**
 * @url {get} /faculty/edit/:_id
 *
 * @description Called when a faculty is to be
 * edited by the user. _id is required, and is
 * sent in a html parameter.
 *
 * @param {String} _id (Required)
 *
 * @finish renders faculty/edit.ejs with the faculty
 * to be edited
 *
 * @throws {Object} FacultyNotFound (shouldn't occur if frontend done properly)
 * @throws {Object} RequiredParamNotFound (shouldn't occur if frontend done properly)
 */
facultyController.edit = function(req, res){
  if (req.params._id) { //_id from params because passed with faculty/edit/:_id
    schema.Faculty.findOne({_id: req.params._id}).exec().then(function (result) {
      if (result) res.render("../views/faculty/edit.ejs", {faculty: result});
      else throw new Error("FacultyNotFound");
    })
  } else {
    throw new Error("RequiredParamNotFound");
  }
}

facultyController.download = function(req, res){
  schema.Faculty.find({}, "-_id -__v").sort({lastName: 1, firstName: 1}).lean().exec().then(function(result){
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(result);
    XLSX.utils.book_append_sheet(wb, ws, "Faculty");
    var filePath = path.join(__dirname, "../data/facultyTemp.xlsx");
    XLSX.writeFile(wb, filePath);
    res.setHeader("Content-Disposition", "filename=" + "Faculty.xlsx");
    res.setHeader("Content-type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    fs.createReadStream(filePath).pipe(res);
  });
}

facultyController.uploadPage = function(req, res){
  var uploadSuccess = false;
  if(req.params.uploadSuccess == "true"){
    uploadSuccess = true;
  }
  res.render("../views/faculty/upload.ejs", {uploadSuccess: uploadSuccess});

}

facultyController.upload = function(req, res){
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files){
    var f = files[Object.keys(files)[0]];
    var workbook = XLSX.readFile(f.path);
    var worksheet = workbook.Sheets[workbook.SheetNames[0]];
    var headers = {};
    var data = [];
    var i = 0;
    for(var field in schema.Faculty.schema.obj){
      headers[String.fromCharCode(i+65)] = field;
      i++;
    }
    for(z in worksheet) {
        if(z[0] === '!') continue;
        //parse out the column, row, and value
        var col = z.substring(0,1);
        var row = parseInt(z.substring(1));
        var value = worksheet[z].v;

        if(!data[row]) data[row]={};
        data[row][headers[col]] = value;
    }
    //drop those first two rows which are empty
    data.shift();
    data.shift();
    //try to create models
    var count = 0;
    //have to use foreach because of asynchronous nature of mongoose stuff (the loop would increment i before it could save the appropriate i)
    data.forEach(function(element){
      if(element.active == null){
        element.active = true;
      }
      if(element.admin == null){
        element.admin = false;
      }
      //verify that all fields exist
      //if(util.allFieldsExist(element, schema.Faculty)){
      if(element.firstName != null && element.pid != null && element.onyen != null){
        //get faculty lastname/firstname
        schema.Faculty.findOne({pid: element.pid}).exec().then(function(result){
          if(result != null){
            result.onyen = element.onyen;
            result.csID = element.csID;
            result.firstName = element.firstName;
            result.lastName = element.lastName;
            result.sectionNumber = element.sectionNumber;
            result.active = element.active;
            result.admin = element.admin;
            result.save(function(error){
              if(error){
                res.render("../views/error.ejs", {string: element.firstName + " did not save because there is something wrong with the data."});
              }
              count++;
              console.log(count);
              if(count == data.length){
                res.redirect("/faculty/upload/true");
              }
            });
          }
          else{
            var inputFaculty = new schema.Faculty(element);
            inputFaculty.save().then(function(result){
              count++;
              if(count == data.length){
                res.redirect("/faculty/upload/true");
              }
            }).catch(function(err){
              res.render("../views/error.ejs", {string: element.firstName+" did not save because something is wrong with it."});
            });
          }
        });
      }
      else{
        res.render("../views/error.ejs", {string: element.firstName+" did not save because it is missing a field."});
      }
    });
  });
}

module.exports = facultyController;
