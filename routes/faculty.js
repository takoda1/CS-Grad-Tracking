var express = require('express');
var router = express.Router();

var faculty = require('../controllers/FacultyController');

router.get('/', faculty.get);

router.get('/create', faculty.create);

router.get('/edit/:_id', faculty.edit);

router.post('/post', faculty.post);

router.post('/put', faculty.put);

router.post('/delete/:_id', faculty.delete);

module.exports = router;