// /routes/student.js

var express = require('express');
var router = express.Router();

var student = require('../controllers/StudentController.js');

router.get('/', student.get);

router.get('/create', student.create);

router.get('/edit/:_id', student.edit);

router.get("/jobs/:_id", student.jobs);

router.get("/forms/:_id/:uploadSuccess", student.formPage);

router.get("/viewForm/:_id/:title", student.viewForm);

router.get("/upload/:uploadSuccess", student.uploadPage);

router.post('/post', student.post);

router.post('/put', student.put);

router.post('/delete/:_id', student.delete);

router.post("/deleteJob", student.deleteJob);

router.post("/uploadForm/:_id", student.uploadForm);

router.post("/upload", student.upload);

router.post("/addJobs", student.addJobs);



module.exports = router;