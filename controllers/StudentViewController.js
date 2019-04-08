var schema = require("../models/schema.js");
var util = require("./util.js");
var formidable = require("formidable");
var fs = require("fs");
var path = require("path");
var XLSX = require("xlsx");
var formidable = require("formidable");
var mongoose = require("mongoose");

var studentViewController = {};


/*
Students only allowed to edit their:
firstName
lastName
alternativeName
gender
ethnicity
notes
*/
studentViewController.put = function (req, res) {
  var input = req.body;
  var editableFields = ["firstName", "lastName", "alternativeName", "gender", "ethnicity", "notes", "residency"];
  if (input.firstName != null && input.lastName != null && input._id != null) {
    schema.Student.findOne({_id: input._id}, input).exec().then(function(result){
      if(result != null){
        for(var i = 0; i < editableFields.length; i++){
          result[editableFields[i]] = input[editableFields[i]];
        }
        result.save(function(err, updated){
          res.redirect("/studentView");
        });
      }
      else res.render("../views/error.ejs", {string: "StudentNotFound"});
    });
  }
  else{
    res.render("../views/error.ejs", {string: "RequiredParamNotFound"});
  }
}

studentViewController.get = function(req, res){
  schema.Student.findOne({pid: process.env.userPID}).populate("semesterStarted").populate("advisor").exec().then(function(result){
    if(result != null){
      result = result.toJSON();
      var genders, ethnicities, student;
      student = result;
      genders = schema.Student.schema.path("gender").enumValues;
      ethnicities = schema.Student.schema.path("ethnicity").enumValues;
      schema.Faculty.find({}).sort({lastName:1, firstName:1}).exec().then(function(result){
        res.render("../views/studentView/index", {student: student, faculty: result, ethnicities: ethnicities, genders: genders});
      });
    }
    else{
      res.render("../views/error.ejs", {string: "Student not found"});
    }
  });
}

studentViewController.jobs = function(req, res){

  schema.Student.findOne({pid: process.env.userPID}).populate("jobHistory").populate({path:"jobHistory", populate:{path:"supervisor"}})
  .populate({path:"jobHistory", populate:{path:"semester"}}).populate({path:"jobHistory", populate:{path:"course"}}).exec().then(function(result){
    result.jobHistory.sort(function(a, b){
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
    res.render("../views/studentView/jobs", {student: result});
  });
}

studentViewController.forms = function(req, res){
  schema.Student.findOne({pid: process.env.userPID}).exec().then(function(result){
    var student = result;
    schema.Form.find({student:result._id}).exec().then(function(result){
      var formTitles = schema.Form.schema.path("defaultTitle").enumValues;
      var existingForms = result;
      var uploadSuccess = false;
      if(req.params.uploadSuccess == "true"){
        uploadSuccess = true;
      }
      res.render("../views/studentView/forms", {student: student, formTitles: formTitles, uploadSuccess: uploadSuccess, existingForms: existingForms});
    });
    
  });
}

studentViewController.viewForm = function(req, res){
  if(req.params.title != null && req.params._id != null){
    //make sure student exists
    schema.Student.findOne({_id: req.params._id}).exec().then(function(result){
      if(result != null){
        var filePath = path.join(__dirname, "../data/forms/"+req.params._id+req.params.title+".pdf");
        fs.access(filePath, function(err){
          if(err){
            res.render("../views/error.ejs", {string: "File does not exist."});
          } 
          else{
            var file = fs.createReadStream(filePath);
            res.setHeader("Content-type", "application/pdf");
            file.pipe(res);
          }
        });
      }
    });
  }
}

studentViewController.courses = function(req, res){
  schema.Student.findOne({pid: process.env.userPID}).populate({
    path:"grades",
    populate:{path:"course", populate:{path:"semester"}}
  }).populate({
    path:"grades",
    populate:{path:"course", populate:{path:"faculty"}}
  }).exec().then(function(result){
    result.grades.sort(function(a, b){
      if(a.course.semester.year == b.course.semester.year){
        if(a.course.semester.season < b.course.semester.season){
          return -1;
        }
        if(a.course.semester.season > b.course.semester.season){
          return 1;
        }
        return 0;
      }
      else{
        return a.course.semester.year - b.course.semester.year;
      }
    });
    res.render("../views/studentView/courses.ejs", {student: result});
  });
}

studentViewController.downloadCourses = function(req, res){
  schema.Student.findOne({pid: process.env.userPID}).populate({
    path:"grades",
    populate:{path:"course", populate:{path:"semester"}}
  }).populate({
    path:"grades",
    populate:{path:"course", populate:{path:"faculty"}}
  }).lean().exec().then(function(result){
    result.grades.sort(function(a, b){
      if(a.course.semester.year == b.course.semester.year){
        if(a.course.semester.season < b.course.semester.season){
          return -1;
        }
        if(a.course.semester.season > b.course.semester.season){
          return 1;
        }
        return 0;
      }
      else{
        return a.course.semester.year - b.course.semester.year;
      }
    });
    var output = [];
    for(var i = 0; i < result.grades.length; i++){
      var grade = {};
      grade.onyen = result.onyen;
      grade.grade = result.grades[i].grade;
      grade.department = result.grades[i].course.department;
      grade.number = result.grades[i].course.number;
      grade.section = result.grades[i].course.section;
      grade.semester = result.grades[i].course.semester.season + " " + result.grades[i].course.semester.year;
      grade.faculty = result.grades[i].course.faculty.lastName + ", " + result.grades[i].course.faculty.firstName;
      output[i] = grade;
    }
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(output);
    XLSX.utils.book_append_sheet(wb, ws, "grades");
    var filePath = path.join(__dirname, "../data/gradeTemp.xlsx");
    XLSX.writeFile(wb, filePath);
    res.setHeader("Content-Disposition", "filename=" + result.onyen + " grades.xlsx");
    res.setHeader("Content-type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    fs.createReadStream(filePath).pipe(res);
  });
  
}

module.exports = studentViewController;
