var express = require('express');
var router = express.Router();

var course = require('../controllers/CourseController');

router.get('/', course.get);

router.get('/edit/:_id', course.edit);

router.get('/create', course.create);

router.post('/post', course.post);

router.post('/put', course.put);

router.post('/delete/:_id', course.delete);

module.exports = router;
