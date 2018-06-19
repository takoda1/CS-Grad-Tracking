// /routes/student.js

var express = require('express');
var router = express.Router();

var student = require('../controllers/StudentController.js');

router.get('/', student.get);

router.get('/create', student.create);

router.get('/edit/:_id', student.edit);

router.get("/jobs/:_id", student.jobs);

router.get("/forms/:_id", student.formPage);

router.get("/viewForm/:_id/:title", student.viewForm);

//router.get("/abc/:_id/:asdf", student.abc);

router.post('/post', student.post);

router.post('/put', student.put);

router.post('/delete/:_id', student.delete);

router.post("/deleteJob", student.deleteJob);

router.post("/uploadForm/:_id", student.uploadForm);



module.exports = router;