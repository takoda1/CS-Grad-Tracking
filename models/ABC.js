var mongoose = require('mongoose');

var ABC = new mongoose.Schema({
	name: String
});

module.exports = mongoose.model('ABC', ABC);