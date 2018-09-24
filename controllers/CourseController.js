var schema = require("../models/schema");
var util = require("./util");
var XLSX = require("xlsx");
var formidable = require("formidable");
var mongoose = require("mongoose");
var path = require("path");
var fs = require("fs");
var courseController = {};

/**
 * @url {post} /course/post
 *
 * @description Called when a course is to be created,
 * receives fields from an html form, all fields are
 * required for a course to be created.
 * 
 * A form will be submitted when course/post is called, and
 * form data is stored in req.body
 *
 * @req.body {String} department (Required)
 * @req.body {String} number (Required)
 * @req.body {String} name (Required)
 * @req.body {String} category (Required)
 * @req.body {Number} hours (Required)
 * @req.body {String} faculty (Required) (_id that corresponds to referenced faculty)
 * @req.body {String} semester (Required) (_id that corresponds to referenced semester)
 *
 * @success redirects to /course/edit/:_id (courseController.edit)
 * @failure redirects to error page that displays appropriate message
 * 
 * @throws {Object} RequiredParamNotFound (should not occur if frontend done correctly)
 */
courseController.post = function (req, res) {
  var input = req.body;
  if(util.allFieldsExist(input, schema.Course)){
    //attempt to populate faculty and course, if they don't exist, error will be caught
    schema.Course.findOne(input).populate("faculty").populate("semester").exec().then(function (result) {
      if (result != null) {
        res.render("../views/error.ejs", {string: "This course already exists."});
      }
      else if(input.department.length != 4){
        res.render("../views/error.ejs", {string: "Please input four letter department code"});
      }
      else {
        var inputCourse = new schema.Course(util.validateModelData(input, schema.Course));
        inputCourse.save().then(function(result){
          res.redirect("/course/edit/"+result._id);
        });
      }
    /*this is catching the error if the faculty or semester
    provided does not exist (shouldn't occur if frontend
    done properly), and populate is failing*/
    }).catch(function(err){
      res.render("../views/error.ejs", {string: err.message});
    });
  }
  else{
    res.render("../views/error.ejs", {string: "RequiredParamNotFound"});
  }
}

/**
 * @url {get} /course
 *
 * @description Called when the /course/index.ejs is to be rendered,
 * accepts search fields as an html query
 * 
 * The fields are in req.query when they are provided (searched for)
 *
 * @req.query {String} department
 * @req.query {String} number
 * @req.query {String} name
 * @req.query {String} category
 * @req.query {Number} hours
 * @req.query {String} faculty (_id that corresponds to referenced faculty)
 * @req.query {String} semester (_id that corresponds to referenced semester)
 *
 * @finish renders /course/index.ejs
 * if no courses are found, then the page
 * just indicates that none are found
 */
courseController.get = function (req, res) {
  var input = req.query;
  input = util.validateModelData(input, schema.Course); //remove fields that are empty/not part of course definition
  schema.Course.find(input).populate("faculty").populate("semester").sort({number:1}).exec().then(function(result){
    result.sort(function(a, b){
      if(a.semester.year == b.semester.year){
        if(a.semester.season < b.semester.season){
          return -1;
        }
        if(a.semester.season > b.semester.season){
          return 1;
        }
        return 0;
      }
      else{
        return a.semester.year - b.semester.year;
      }
    });
    var courses = result;
    schema.Semester.find().sort({year: 1, season: 1}).exec().then(function(result){
      res.render("../views/course/index.ejs", {courses: courses, semesters: result});
    });
  }).catch(function(err){
    res.json({"error": err.message, "origin": "course.put"});
  });
  // var match;
  // if(input.semester == null && input.number == null){
  //   match = {
  //     $match: {
  //       name:new RegExp(input.name, "i")
  //     }
  //   }
  // }
  // else if(input.semester == null && input.number != null){
  //   match = {
  //     $match: {
  //       name:new RegExp(input.name, "i"),
  //       number: input.number
  //     }
  //   }
  // }
  // else if(input.semester != null && input.number == null){
  //    match = {
  //       $match: {
  //         name:new RegExp(input.name, "i"),
  //         semester: new mongoose.Types.ObjectId(input.semester)
  //       }
  //     }
  // }
  // else{
  //    match = {
  //       $match: {
  //         name:new RegExp(input.name, "i"),
  //         semester: new mongoose.Types.ObjectId(input.semester),
  //         number: input.number
  //       }
  //     }
  // }
  
  // schema.Course.aggregate([
  // match,
  // {
  //   $lookup: {
  //     from: schema.Faculty.collection.name,
  //     localField: "faculty",
  //     foreignField: "_id",
  //     as: "faculty"
  //   }
  // },
  // {
  //   $unwind:"$faculty"
  // },
  // {
  //   $lookup : {
  //     from: schema.Semester.collection.name,
  //     localField: "semester",
  //     foreignField: "_id",
  //     as: "semester"
  //   }
  // },
  // {
  //   $unwind:{
  //     path: "$semester"
  //   }
  // },
  // {
  //   $sort:{
  //     "semester.year": 1,
  //     "semester.season": 1,
  //     "number": 1
  //   }
  // }
  // ]).exec().then(function(result){
}

/**
 * @url {post} /course/put
 *
 * @description Called when a course is to be updated,
 * field data is sent as an html form, and all fields
 * are required.
 *
 * @req.body {String} _id (MongoID) (Required)
 * @req.body {String} department (Required)
 * @req.body {Number} number (Required)
 * @req.body {String} name (Required)
 * @req.body {String} category (Required)
 * @req.body {Number} hours (Required)
 * @req.body {String} faculty (Required) (_id that corresponds to referenced faculty)
 * @req.body {Object} semester (Required) (_id that corresponds to referenced semester)
 *
 * @success redirects to /course/edit/:_id (courseController.edit)
 * which displays the newly updated faculty data
 *
 * @throws {Object} RequiredParamNotFound (should not occur if frontend done properly)
 * @throws {Object} CourseNotFound (should not occur if frontend done properly)
 */
courseController.put = function (req, res) {
  var input = req.body;
  input = util.validateModelData(input, schema.Course);
  if(util.allFieldsExist(input, schema.Course)){
    if(input.department.length != 4){
      res.render("../views/error.ejs", {string: "Please input four letter department code"});
    }
    schema.Course.findOneAndUpdate({_id: input._id}, input).exec().then(function(result){
      if(result != null){
        res.redirect("/course/edit/"+result._id);
      }
      else{
        res.render("../views/error.ejs", {string: "CourseNotFound"});
      }
    }).catch(function(err){
      res.json({"error": err.message, "origin": "course.put"});
    });
  }
  else{
    res.render("../views/error.ejs", {string: "RequiredParamNotFound"});
  }
  
}

/**
 * @url {post} /course/delete/:_id
 *
 * @description Called when a course is to be deleted,
 * requires _id, to be sent as a html parameter.
 *
 * @req.params {String} _id (Required)
 *
 * @success redirects to /course (facultyController.get)
 * @failure renders error.ejs with appropriate error message
 *
 * @throws CourseNotFound (should not occur if frontend done properly)
 * @throws RequireParamNotFound (should not occur if frontend done properly)
 */
courseController.delete = function (req, res) {
  var id = req.params._id;
  if(id != null){
    //check if any students reference this course
    schema.Student.find({courseHistory: {$elemMatch: {_id: id}}}).exec().then(function(result){
      if(result.length > 0){
        res.render("../views/error.ejs", {string: "Could not delete course because student is referencing it."});
      }
      else{
        //check if any jobs reference this course
        schema.Job.find({course: id}).exec().then(function(result){
          if(result.length > 0){
            res.render("../views/error.ejs", {string: "Could not delete course because job is referencing it."});
          }
          else{
            //nothing references this course, so try to delete it
            schema.Course.findOneAndRemove({_id: id}).exec().then(function (result) {
              if (result){
                res.redirect("/course");
              }
              else{
                res.render("../views/error.ejs", {string: "CourseNotFound"});
              }
            });
          }
        });
      }
    });
  }
  else{
    res.render("../views/error.ejs", {string: "RequiredParamNotFound"});
  }
  
}

/*
 * @url {get} /course/create
 *
 * @description renders /course/create.ejs
 *
 */
courseController.create = function (req, res){
  var faculty, semesters;
  /*provide all the faculty and semesters to the view
  so that the user can not input custom faculty or
  semesters*/
  schema.Faculty.find(
    {},
    {lastName:1, firstName:1} //projection
  ).sort({lastName:1}).exec().then(function(result){
    faculty = result;
    schema.Semester.find({}).sort({year:1, season:1}).exec().then(function(result){
      semesters = result;
      var categories = schema.Course.schema.path("category").enumValues;
      res.render("../views/course/create", {faculty: faculty, semesters: semesters, categories: categories});
    });
  });
}

/**
 * @url {get} /course/edit/:_id
 *
 * @description Called when a course is to be
 * edited by the user. _id is required, and is
 * sent in a html parameter.
 *
 * @param {String} _id (Required)
 *
 * @finish renders course/edit.ejs with the course
 * to be edited
 * 
 * @throws {Object} CourseNotFound (shouldn't occur if frontend done properly)
 * @throws {Object} RequiredParamNotFound (shouldn't occur if frontend done properly)
 */
courseController.edit = function (req, res){
  if(req.params._id){
    //populate the faculty and semester fields with document data
    schema.Course.findOne({_id: req.params._id}).populate("faculty").populate("semester").exec().then(function(result){
      if(result != null){
        var course, faculty, semesters;
        course = result;
        //get list of faculty and semesters so that user can't input custom data for those fields
        schema.Faculty.find(
          {},
          {lastName:1, firstName:1}
        ).sort({onyen:1}).exec().then(function(result){
          faculty = result;
          schema.Semester.find({}).sort({year:1, season:1}).exec().then(function(result){
            semesters = result;
            var categories = schema.Course.schema.path("category").enumValues;
            res.render("../views/course/edit.ejs", {course: course, faculty: faculty, semesters: semesters, categories: categories});
          });
        });
      }
      else{
        res.render("../views/error.ejs", {string: "Course not found"});
      }
    });
  }
  //catches error if _id is null
  else{
    res.render("../views/error.ejs", {string: "RequiredParamNotFound"});
  }
}

/*
 * @url {get} /course/upload
 *
 * @description renders /course/upload.ejs
 *
 */
courseController.uploadPage = function(req, res){
  var uploadSuccess = false;
  if(req.params.uploadSuccess == "true"){
    uploadSuccess = true;
  }
  //always have to provide semesters because search requires it
  schema.Semester.find({}).sort({year:1, season:1}).exec().then(function(result){
    res.render("../views/course/upload.ejs", {semesters: result, uploadSuccess: uploadSuccess});
  });
}

courseController.upload = function(req, res){
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files){
    var f = files[Object.keys(files)[0]];
    var workbook = XLSX.readFile(f.path);
    var worksheet = workbook.Sheets[workbook.SheetNames[0]];
    var headers = {};
    var data = [];
    var i = 0;
    for(var field in schema.Course.schema.obj){
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
      if(element.category == null){
        element.category = "NA";
      }
      //verify that all fields exist
      if(util.allFieldsExist(element, schema.Course)){
        //get faculty lastname/firstname
        var commaReg = /\s*,\s*/;
        var facultyName = element.faculty.split(commaReg);
        facultyName[0] = new RegExp(facultyName[0], "i");
        facultyName[1] = new RegExp(facultyName[1], "i");
        var spaceReg = /\s* \s*/;
        var semester = element.semester.split(spaceReg);
        schema.Faculty.findOne({lastName: facultyName[0], firstName: facultyName[1]}).exec().then(function(result){
          if(result != null){
            element.faculty = result._id;
            schema.Semester.findOne({season: semester[0].toUpperCase(), year: parseInt(semester[1])}).exec().then(function(result){
              if(result != null){
                element.semester = result._id;
                switch(element.category){
                  case "t":
                  case "T":
                    element.category = "Theory";
                    break;
                  case "s":
                  case "S":
                    element.category = "Systems";
                    break;
                  case "a":
                  case "A":
                  case "applications":
                  case "Applications":
                    element.category = "Appls";
                    break;
                  default:
                    element.category = "NA";
                    break;
                }
                schema.Course.findOne(element).exec().then(function (result) {
                  //if the course doesn't already exist, try to make it
                  if(result == null){
                    var inputCourse = new schema.Course(element);
                    inputCourse.save().then(function(result){
                      count++;
                      if(count == data.length){
                        res.redirect("/course/upload/true");
                      }
                    }).catch(function(err){
                      res.render("../views/error.ejs", {string: element.name+" did not save because something is wrong with it."});
                    });
                  }
                  else{
                    count++;
                    if(count == data.length){
                      res.redirect("/course/upload/true");
                    }
                  }
                });
              }
              else{
                res.render("../views/error.ejs", {string: element.name+" did not save because the semester is incorrect."});
              }
            });
          }
          else{
            res.render("../views/error.ejs", {string: element.name+" did not save because the faculty is incorrect."});
          }
        });
      }
      else{
        res.render("../views/error.ejs", {string: element.name+" did not save because it is missing a field."});
      }
    });
  });
}

courseController.download = function(req, res){
  schema.Course.find({}, "-_id -__v").populate("faculty").populate("semester").sort({number:1}).lean().exec().then(function(result){
    result.sort(function(a, b){
      if(a.semester.year == b.semester.year){
        if(a.semester.season < b.semester.season){
          return -1;
        }
        if(a.semester.season > b.semester.season){
          return 1;
        }
        return 0;
      }
      else{
        return a.semester.year - b.semester.year;
      }
    });

  // });
  // schema.Course.aggregate([
  // {
  //   $project: {
  //     _id: 0,
  //     __v: 0
  //   }
  // },
  // {
  //   $lookup: {
  //     from: schema.Faculty.collection.name,
  //     localField: "faculty",
  //     foreignField: "_id",
  //     as: "faculty"
  //   }
  // },
  // {
  //   $unwind:"$faculty"
  // },
  // {
  //   $lookup : {
  //     from: schema.Semester.collection.name,
  //     localField: "semester",
  //     foreignField: "_id",
  //     as: "semester"
  //   }
  // },
  // {
  //   $unwind:{
  //     path: "$semester"
  //   }
  // },
  // {
  //   $sort:{
  //     "semester.year": 1,
  //     "semester.season": 1,
  //     "number": 1
  //   }
  // }
  // ]).exec().then(function(result){
    var wb = XLSX.utils.book_new();
     for(var i = 0; i < result.length; i++){
       result[i].faculty = result[i].faculty.lastName + ", " + result[i].faculty.firstName;
       result[i].semester = result[i].semester.season + " " + result[i].semester.year;
     }
    var ws = XLSX.utils.json_to_sheet(result);
    XLSX.utils.book_append_sheet(wb, ws, "Courses");
    var filePath = path.join(__dirname, "../data/courseTemp.xlsx");
    XLSX.writeFile(wb, filePath);
    res.setHeader("Content-Disposition", "filename=" + "Courses.xlsx");
    res.setHeader("Content-type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    fs.createReadStream(filePath).pipe(res);

  });

  

}

module.exports = courseController;
