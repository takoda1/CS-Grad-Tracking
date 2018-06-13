// /routes/job.js
var express = require("express");
var router = express.Router();

var job = require("../controllers/JobController.js");

router.get("/", job.get);

router.get("/create", job.create);

router.get("/edit/:_id", job.edit);

router.get("/upload", job.uploadPage);

router.get("/assign/:_id", job.assignPage);

router.post("/post", job.post);

router.post("/put", job.put);

router.post("/delete/:_id", job.delete);

router.post("/upload", job.upload);

router.post("/assignPost/:_id", job.assign);

router.post("/unassign", job.unAssign);

module.exports = router;