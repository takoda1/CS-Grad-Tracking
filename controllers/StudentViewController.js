var schema = require("../models/schema.js");
var util = require("./util.js");
var formidable = require("formidable");
var fs = require("fs");
var path = require("path");
var XLSX = require("xlsx");
var formidable = require("formidable");
var mongoose = require("mongoose");

var studentViewController = {};

studentViewController.put = function (req, res) {
  var input = req.body;
  input = verifyBoolean(input);
  var input = util.validateModelData(input, schema.Student);
  if (input.onyen != null && input.firstName != null && input.lastName != null && input.pid != null && input.pid != NaN) {
    schema.Student.findOneAndUpdate({_id: input._id}, input).exec().then(function(result){
      if(result != null){
        res.redirect("/student/edit/"+result._id);
      }
      else res.render("../views/error.ejs", {string: "StudentNotFound"});
    });
  }
  else{
    res.render("../views/error.ejs", {string: "RequiredParamNotFound"});
  }
}

studentViewController.get = function(req, res){
  if(req.params._id){
    schema.Student.findOne({_id: req.params._id}).populate("semesterStarted").populate("advisor").exec().then(function(result){
      if(result != null){
        var genders, ethnicities, residencies, degrees, semesters, student;
        student = result;
        genders = schema.Student.schema.path("gender").enumValues;
        ethnicities = schema.Student.schema.path("ethnicity").enumValues;
        residencies = schema.Student.schema.path("residency").enumValues;
        degrees = schema.Student.schema.path("intendedDegree").enumValues;
		    eligibility = schema.Student.schema.path("fundingEligibility").enumValues;
        schema.Semester.find({}).sort({year:1, season:1}).exec().then(function(result){
          semesters = result;
          schema.Faculty.find({}).sort({lastName:1, firstName:1}).exec().then(function(result){
            res.render("../views/student/edit", {student: student, faculty: result, semesters: semesters, degrees: degrees, residencies: residencies, ethnicities: ethnicities, genders: genders, eligibility: eligibility});
          });
        });
      }
      else{
        res.render("../views/error.ejs", {string: "Student not found"});
      }
    });
  }
  else{
    res.render("../views/error.ejs", {string: "RequiredParamNotFound"});
  }
}

studentViewController.jobs = function(req, res){
  if(req.params._id){
    var jobs;

    schema.Job.find().populate("supervisor").populate("course").populate("semester").sort({position:1}).exec().then(function(result){
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
      jobs = result;

      schema.Student.findOne({_id: req.params._id}).populate("jobHistory").populate({path:"jobHistory", populate:{path:"supervisor"}})
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
        res.render("../views/student/jobs", {student: result, jobs: jobs});
      });
    });
    
  }
  else{
    //this shouldn't happen if frontend done correctly
    res.render("../views/error.ejs", {string: "RequiredParamNotFound"});
  }
}

studentViewController.formPage = function(req, res){
  if(req.params._id != null){
    schema.Student.findOne({_id: req.params._id}).exec().then(function(result){
      var student = result;
      schema.Form.find({student:result._id}).exec().then(function(result){
        var formTitles = schema.Form.schema.path("defaultTitle").enumValues;
        var existingForms = result;
        var uploadSuccess = false;
        if(req.params.uploadSuccess == "true"){
          uploadSuccess = true;
        }
        res.render("../views/student/forms", {student: student, formTitles: formTitles, uploadSuccess: uploadSuccess, existingForms: existingForms});
      });
      
    });
  }
  else{
    res.render("../views/error.ejs", {string: "StudentId incorrect"});
  }
}

studentViewController.uploadForm = function(req, res){
  var studId = req.params._id;
  if(studId != null){
    schema.Student.findOne({_id: studId}).exec().then(function(result){
      if(result != null){
        var student = result;
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files){
          if(fields.title != null){
            var formObject = {title:"", student:""};
            if(fields.title == "Other"){
              formObject.title = fields.other;
            }
            else{
              formObject.title = fields.title;
            }
            formObject.student = student._id;
            schema.Form.findOne({title: formObject.title}).exec().then(function(result){
              if(result == null){
                var inputForm = new schema.Form(util.validateModelData(formObject, schema.Form));
                inputForm.save().then(function(result){

                }).catch(function(err){
                res.render("../views/error.ejs", {string: "form failed to save"});
                });
              }
              var f = files[Object.keys(files)[0]];
              var newpath = path.join(__dirname, "../data/forms/"+student._id+formObject.title+".pdf");
              fs.rename(f.path, newpath, function(err){
                res.redirect("/student/forms/"+studId+"/true");
              });
            });
          }
        });
      }
      else{
        res.render("../views/error.ejs", {string: "Student not found"});
      }
    });
  }
  else{
    res.render("../views/error.ejs", {string: "Required param not found"});
  }
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
  if(req.params._id != null){
    schema.Student.findOne({_id: req.params._id}).populate({
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
      res.render("../views/student/courses.ejs", {student: result});
    });
  }
  else{
    res.render("../views/error.ejs", {string: "Id missing."});
  }
}

studentViewController.downloadCourses = function(req, res){
  if(req.params._id != null){
    schema.Student.findOne({_id: req.params._id}).populate({
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
  else{
    res.render("../views/error.ejs", {string:"Student id wrong or missing"});
  }
  
}

function pushStudentCourse(onyen, gradeId){
  return new Promise((resolve, reject)=>{
    schema.Student.findOne({onyen: onyen[0].toUpperCase()+input.onyen.toLowerCase().slice(1)}).exec().then(function(result){
      if(result != null){
        schema.Student.update({onyen:onyen},{$addToSet: {grades: gradeId}}).exec();
        resolve(result);
      }
      else{
        reject(result);
      }
    });
  });
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

module.exports = studentViewController;
