// /routes/job.js
var express = require("express");
var router = express.Router();

var job = require("../controllers/JobController.js");

router.get("/", job.get);

router.get("/create", job.create);

router.get("/edit/:_id", job.edit);

router.post("/post", job.post);

router.post("/put", job.put);

router.post("/delete/:_id", job.delete);

module.exports = router;