var mongoose = require('mongoose')
var schema = {}

// Administrators
var adminSchema = mongoose.Schema({
  username: String,
  firstName: String,
  lastName: String,
})

// Faculty
var facultySchema = mongoose.Schema({
  username: String,
  firstName: String,
  lastName: String,
})

// Students
var studentSchema = mongoose.Schema({
  username: String,
  firstName: String,
  lastName: String,
})

module.exports = schema