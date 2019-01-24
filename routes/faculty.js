// /routes/faculty.js
var express = require("express");
var router = express.Router();
var util = require("../controllers/util");

var faculty = require("../controllers/FacultyController.js");

router.use(function(req, res, next){
	util.adminRole(res).then(function(result){
		next();
	});
});


router.get("/", faculty.get);

router.get("/create", faculty.create);

router.get("/edit/:_id", faculty.edit);

router.get("/download", faculty.download);

router.get("/upload/:uploadSuccess", faculty.uploadPage);

router.post("/post", faculty.post);

router.post("/put", faculty.put);

router.post("/delete/:_id", faculty.delete);

router.post("/upload", faculty.upload);

module.exports = router;