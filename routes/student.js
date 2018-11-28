// /routes/student.js

var express = require('express');
var router = express.Router();
var util = require("../controllers/util");

var student = require('../controllers/StudentController.js');

function adminRole(res){
	return new Promise((resolve, reject)=>{
	    util.checkAdmin().then(function(result){
	    	if(result){
			 	res.locals.admin = true;
			 	resolve(true);
	    	}
	    	else{
			 	res.locals.admin = false;
			 	resolve(false);
	    	}
	    });
 	});
}

function authorizeAdmin(req, res, next){
	adminRole(res).then(function(result){
		util.checkAdmin().then(function(result){
			if(result){
				next();
			}
			else{
				res.render("../views/error.ejs", {string:"Not admin"});
			}
		});
	});
	
}

function authorizeFaculty(req, res, next){
	adminRole(res).then(function(result){
		util.checkFaculty().then(function(result){
			if(result){
				next();
			}
			else{
				res.render("../views/error.ejs", {string:"Not faculty"});
			}
		});
	});
	
	
}

function authorizeAdvisor(req, res, next){
	adminRole(res).then(function(result){
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
	});
	
}

router.get('/', authorizeFaculty, student.get);

router.get('/create', authorizeAdmin, student.create);

router.get('/edit/:_id', authorizeAdvisor, student.edit);

router.get("/jobs/:_id", authorizeAdvisor, student.jobs);

router.get("/forms/:_id/:uploadSuccess", authorizeAdvisor, student.formPage);

router.get("/viewForm/:_id/:title", authorizeAdvisor, student.viewForm);

router.get("/upload/:uploadSuccess", authorizeAdmin, student.uploadPage);

router.get("/download", authorizeFaculty, student.download);

router.get("/downloadCourses/:_id", authorizeAdvisor, student.downloadCourses);

router.get("/courses/:_id", authorizeAdvisor, student.courses);

router.get("/uploadCourses/:uploadSuccess", authorizeAdmin, student.uploadCoursePage);

router.post('/post', authorizeAdmin, student.post);

router.post('/put', authorizeAdmin, student.put);

router.post('/delete/:_id', authorizeAdmin, student.delete);

router.post("/deleteJob", authorizeAdmin, student.deleteJob);

router.post("/uploadForm/:_id", authorizeAdmin, student.uploadForm);

router.post("/upload", authorizeAdmin, student.upload);

router.post("/addJobs", authorizeAdmin, student.addJobs);

router.post("/uploadCourses", authorizeAdmin, student.uploadCourses);

module.exports = router;