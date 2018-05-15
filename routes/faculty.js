var express = require('express');
var router = express.Router();

var faculty = require('../controllers/FacultyController');

router.get('/', faculty.get);

router.get('/create', faculty.create);

router.get('/edit/:username', faculty.edit);

router.post('/post', faculty.post);

router.post('/put/:username', faculty.put);

router.post('/delete/:username', faculty.delete);

module.exports = router;