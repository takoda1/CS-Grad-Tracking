/* global reject */
var mongoose = require('mongoose')
var schema = {}

// Administrators
var adminSchema = mongoose.Schema({
  username: String,
  firstName: String,
  lastName: String
})

// Faculty
var facultySchema = mongoose.Schema({
  username: String,
  firstName: String,
  lastName: String,
  pid: Number
})

// Students
var studentSchema = mongoose.Schema({
  username: String,
  firstName: String,
  lastName: String,
  pid: Number,
  alternativeName: String,
  gender: {
    type: String,
    enum: ['MALE', 'FEMALE', 'OTHER'],
    default: 'OTHER'
  },
  ethnicity: {
    type: String,
    enum: ['AIAN', 'ASIAN', 'BLACK', 'HISPANIC', 'PACIFIC', 'WHITE', 'OTHER'],
    default: 'OTHER'
  },
  status: String,
  citizenship: Boolean,
  residency: {
    type: String,
    enum: ['YES', 'NO', 'APPLIED'],
    default: 'NO'
  },
  enteringStatus: String,
  researchArea: String,
  backgroundApproved: Boolean,
  leaveExtension: String,
  fundingEligibility: Boolean,
  fundingStatus: Boolean,
  intendedDegree: {
    type: String,
    enum: ['MASTERS', 'PHD', 'BOTH'],
    default: 'MASTERS'
  },
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
  department: String,
  number: Number,
  name: String,
  category: String,
  hours: Number,
  faculty: {type: mongoose.Schema.Types.ObjectId, ref: 'Faculty'},
  semester: {type: mongoose.Schema.Types.ObjectId, ref: 'Semester'}
})

// Jobs
var jobSchema = mongoose.Schema({
  position: String,
  supervisor: {type: mongoose.Schema.Types.ObjectId, ref: 'Faculty'},
  course: {type: mongoose.Schema.Types.ObjectId, ref: 'Course'},
  students: [{type: mongoose.Schema.Types.ObjectId, ref: 'Student'}]
})

// Schema pre-hooks

facultySchema.pre('save', function (next) {
  if (this.username && this.firstName && this.lastName && this.pid) next()
  else next(new Error('RequiredParamNotFound'))
})

//not needed.
/*
facultySchema.pre('findOneAndUpdate', function (next) {
  console.log(this+" "+this.username)
  if (this.username) next()
  else next(new Error('RequiredParamNotFound'))
})*/

/*
facultySchema.pre('findOneAndRemove', function (next) {
  if (this.username) next()
  else next(new Error('RequiredParamNotFound'))
})*/

studentSchema.pre('save', function (next) {
  if (this.username && this.firstName && this.lastName && this.pid) next()
  else next(new Error('RequiredParamNotFound'))
})

studentSchema.pre('find', function (next) {
  if (this.student) {
    studentSchema.find({})
  }
})

studentSchema.pre('findOneAndUpdate', function (next) {
  if (this.username) next()
  else next(new Error('RequiredParamNotFound'))
})

documentSchema.pre('save', function (next) {
  if (this.title && this.student) {
    schema.Student.findOne({username: this.student}).exec().then(function (result) {
      if (result) next()
      else reject(new Error('InvalidStudent'))
    })
    next()
  } else next(new Error('RequiredParamNotFound'))
})

semesterSchema.pre('save', function (next) {
  if (this.year && this.season) next()
  else next(new Error('RequiredParamNotFound'))
})

courseSchema.pre('save', function (next) {
  if (this.department && this.number && this.name && this.category && this.hours && this.faculty && this.semester) {
    if (this.department.length === 4) next()
    else next(new Error('InvalidDepartment'))
  } else next(new Error('RequiredParamNotFound'))
})

courseSchema.pre('find', function (next) {
  if (this.faculty) {
    facultySchema.findOne({'username': this.faculty}).exec().then(function (result) {
      if (result) this.faculty = result._id
      else reject(new Error('UnknownFaculty'))
    })
  }
  if (this.semester) {
    semesterSchema.findOne(this.semester).exec().then(function (result) {
      if (result) this.semester = result._id
      else reject(new Error('UnknownSemester'))
    })
  }
})

schema.Admin = mongoose.model('Admin', adminSchema)
schema.Faculty = mongoose.model('Faculty', facultySchema, 'Faculty')
schema.Student = mongoose.model('Student', studentSchema)
schema.Document = mongoose.model('Document', documentSchema)
schema.Semester = mongoose.model('Semester', semesterSchema)
schema.Course = mongoose.model('Course', courseSchema)
schema.Job = mongoose.model('Job', jobSchema)

module.exports = schema
