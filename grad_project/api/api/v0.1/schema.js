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
  PID: Number,
  firstName: String,
  lastName: String,
})

// Students
var studentSchema = mongoose.Schema({
  username: String,
  firstName: String,
  lastName: String,
  PID: Number,
  alternativeName: String,
  gender: { enum: ['MALE', 'FEMALE', 'OTHER'] },
  ethnicity: { enum: ['AIAN', 'ASIAN', 'BLACK', 'HISPANIC', 'PACIFIC', 'WHITE'] },
  status: String,
  citizenship: Boolean,
  residency: { enum: ['YES', 'NO', 'APPLIED'] },
  enteringStatus: String,
  researchArea: String,
  backgroundApproved: Boolean,
  leaveExtension: String,
  fundingEligibility: Boolean,
  fundingStatus: Boolean,
  intendedDegree: { enum: ['MASTERS', 'PHD'] },
  hoursCompleted: Number,
  prp: Boolean,
  oralExam: Boolean,
  committeeMeeting: Boolean,
  allButDissertation: Boolean,
  dissertationDefence: Boolean,
  finalDissertation: Boolean,
  semesterStarted: { type: mongoose.Schema.Types.ObjectId, ref: 'Semester' },
  advisor: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
  courseHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
})

// Documents
var documentSchema = mongoose.Schema({
  title: String,
  location: String,
  backgroundSheet: Boolean,
  student: {type: mongoose.Schema.Types.ObjectId, ref: 'Student'}
})

// Semesters
var semesterSchema = mongoose.Schema({
  year: Number,
  season: {
    type: String,
    enum: ['FALL', 'SPRING']
  }
})

// Courses
var courseSchema = mongoose.Schema({
  number: Number,
  name: String,
  category: String,
  hours: Number,
  department: String,
  faculty: {type: mongoose.Schema.Types.ObjectId, ref: 'Faculty'}
})

// Jobs
var jobSchema = mongoose.Schema({
  position: String,
  supervisor: {type: mongoose.Schema.Types.ObjectId, ref: 'Faculty'},
  course: {type: mongoose.Schema.Types.ObjectId, ref: 'Course'},
  student: {type: mongoose.Schema.Types.ObjectId, ref: 'Student'},
})

module.exports = schema