// /routes/semesters.js
var express = require('express');
var router = express.Router();

var semester = require('../controllers/SemesterController');

//only really need to get semesters, create semesters, and delete semesters, not
//enough data to warrant an edit page

router.get('/', semester.get);

router.get('/create', semester.create);

router.post('/post', semester.post);

router.post('/delete/:_id', semester.delete);

module.exports = router;