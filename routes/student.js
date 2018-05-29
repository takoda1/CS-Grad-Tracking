// /routes/student.js

var express = require('express');
var router = express.Router();

var student = require('../controllers/StudentController.js');

router.get('/', student.get);

router.get('/create', student.create);

router.get('/edit/:_id', student.edit);

router.post('/post', student.post);

router.post('/put', student.put);

router.post('/delete/:_id', student.delete);

module.exports = router;