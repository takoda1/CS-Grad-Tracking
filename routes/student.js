// /routes/student.js

var express = require('express');
var router = express.Router();
var util = require("../controllers/util");
var schema = require("../models/schema");
var student = require('../controllers/StudentController.js');

function authorizeAdmin(req, res, next){
	util.checkAdmin().then(function(result){
		if(result){
			next();
		}
		else{
			res.render("../views/error.ejs", {string:"Not admin"});
		}
	});
}

function authorizeFaculty(req, res, next){
	util.checkFaculty().then(function(result){
		if(result){
			next();
		}
		else{
			res.render("../views/error.ejs", {string:"Not faculty"});
		}
	});
}

function authorizeAdvisor(req, res, next){
		util.checkAdmin().then(function(result){
			if(result){
				next();
			}
			else{
				util.checkAdvisor(req.params._id).then(function(result){
					if(result){
						next();
					}
					else{
						res.render("../views/error.ejs", {string:"Not the advisor of the student"});
					}
				})
			}
		});
	
}

router.use(function(req, res, next){
	util.adminRole(res).then(function(result){
		next();
	});
});

router.use(function(req, res, next){
	res.locals.status = schema.Student.schema.path("status").enumValues;
	next();
});

router.get('/', authorizeFaculty, student.get);

router.get('/create', authorizeAdmin, student.create);

router.get('/edit/:_id', authorizeAdvisor, student.edit);

router.get("/jobs/:_id", authorizeAdvisor, student.jobs);

router.get("/notes/:_id", authorizeAdvisor, student.notesPage);

router.get("/forms/:_id/:uploadSuccess", authorizeAdvisor, student.formPage);

router.get("/viewForm/:_id/:title", authorizeAdvisor, student.viewForm);

router.get("/upload/:uploadSuccess", authorizeAdmin, student.uploadPage);

router.get("/download", authorizeFaculty, student.download);

router.get("/downloadCourses/:_id", authorizeAdvisor, student.downloadCourses);

router.get("/courses/:_id", authorizeAdvisor, student.courses);

router.get("/uploadCourses/:uploadSuccess", authorizeAdmin, student.uploadCoursePage);

//forms
router.get("/forms/:_id/:title", authorizeAdvisor, student.viewForm);

router.post('/post', authorizeAdmin, student.post);

router.post('/put', authorizeAdmin, student.put);

router.post('/delete/:_id', authorizeAdmin, student.delete);

router.post("/deleteJob", authorizeAdmin, student.deleteJob);

router.post("/uploadForm/:_id", authorizeAdmin, student.uploadForm);

router.post("/upload", authorizeAdmin, student.upload);

router.post("/addJobs", authorizeAdmin, student.addJobs);

router.post("/uploadCourses", authorizeAdmin, student.uploadCourses);

router.post("/notes", authorizeAdmin, student.notesPage);

module.exports = router;