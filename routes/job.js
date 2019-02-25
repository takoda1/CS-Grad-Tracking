// /routes/job.js
var express = require("express");
var router = express.Router();
var util = require("../controllers/util");

var job = require("../controllers/JobController.js");

router.use(function(req, res, next){
	util.adminRole(res).then(function(result){
		next();
	});
});

router.use(function(req, res, next){
	util.checkAdmin().then(function(result){
		if(result){
			next();	
		}
		else{
			res.render("../views/error.ejs", {string:"Not admin"});
		}
	});
});

router.get("/", job.get);

router.get("/create", job.create);

router.get("/edit/:_id", job.edit);

router.get("/upload/:uploadSuccess", job.uploadPage);

router.get("/assign/:_id", job.assignPage);

router.get("/download", job.download);

router.post("/post", job.post);

router.post("/put", job.put);

router.post("/delete/:_id", job.delete);

router.post("/upload", job.upload);

router.post("/assignPost/:_id", job.assign);

router.post("/unassign", job.unAssign);

module.exports = router;