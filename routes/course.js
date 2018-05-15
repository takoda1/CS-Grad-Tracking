var express = require('express');
var router = express.Router();

var course = require('../controllers/CourseController.js');

router.get('/', course.get);
//(req, res) => {
  //res.render('../views/course/create')
//})

module.exports = router;
