// /routes/report.js
var express = require("express");
var router = express.Router();
var util = require("../controllers/util");

var report = require("../controllers/ReportsController.js");

router.use(function(req, res, next){
	util.adminRole(res).then(function(result){
		next();
	});
});

router.get("/", report.get);

module.exports = router;