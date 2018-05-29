/* global reject */
var mongoose = require("mongoose");
var schema = {};

// Administrators
var adminSchema = mongoose.Schema({
  username: String,
  firstName: String,
  lastName: String
});

// Faculty
var facultySchema = mongoose.Schema({
  username: String,
  firstName: String,
  lastName: String,
  pid: Number,
  active: String
});

// Students
var studentSchema = mongoose.Schema({
  username: String,
  firstName: String,
  lastName: String,
  pid: Number,
  alternativeName: String,
  gender: {
    type: String,
    enum: ["MALE", "FEMALE", "OTHER"],
    default: "OTHER"
  },
  ethnicity: {
    type: String,
    enum: ["AIAN", "ASIAN", "BLACK", "HISPANIC", "PACIFIC", "WHITE", "OTHER"],
    default: "OTHER"
  },
  status: String,
  citizenship: Boolean,
  residency: {
    type: String,
    enum: ["YES", "NO", "APPLIED"],
    default: "NO"
  },
  enteringStatus: String,
  researchArea: String,
  backgroundApproved: Boolean,
  leaveExtension: String,
  fundingEligibility: Boolean,
  fundingStatus: Boolean,
  intendedDegree: {
    type: String,
    enum: ["MASTERS", "PHD", "BOTH"],
    default: "MASTERS"
  },
  hoursCompleted: Number,
  prp: Boolean,
  oralExam: Boolean,
  committeeMeeting: Boolean,
  allButDissertation: Boolean,
  dissertationDefence: Boolean,
  finalDissertation: Boolean,
  active: Boolean,
  job: {type: mongoose.Schema.Types.ObjectId, ref: "Job"},
  semesterStarted: { type: mongoose.Schema.Types.ObjectId, ref: "Semester" },
  advisor: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
  courseHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }]
});

// Documents
var documentSchema = mongoose.Schema({
  title: String,
  backgroundSheet: Boolean,
  student: {type: mongoose.Schema.Types.ObjectId, ref: "Student"}
});

// Semesters
var semesterSchema = mongoose.Schema({
  year: Number,
  season: {
    type: String,
    enum: ["FALL", "SPRING"]
  }
});

// Courses
var courseSchema = mongoose.Schema({
  department: String,
  number: Number,
  name: String,
  category: String,
  hours: Number,
  faculty: {type: mongoose.Schema.Types.ObjectId, ref: "Faculty"},
  semester: {type: mongoose.Schema.Types.ObjectId, ref: "Semester"}
});

// Jobs
var jobSchema = mongoose.Schema({
  position: String,
  supervisor: {type: mongoose.Schema.Types.ObjectId, ref: "Faculty"},
  course: {type: mongoose.Schema.Types.ObjectId, ref: "Course"}
});

// Grades
var gradeSchema = mongoose.Schema({
  grade: {
    type: String,
    enum: ["H+", "H", "H-", "P+", "P", "P-", "L+", "L", "L-"]
  },
  student: {type: mongoose.Schema.Types.ObjectId, ref: "Student"},
  course: {type: mongoose.Schema.Types.ObjectId, ref: "Course"}
});

schema.Admin = mongoose.model("Admin", adminSchema);
schema.Faculty = mongoose.model("Faculty", facultySchema);
schema.Student = mongoose.model("Student", studentSchema);
schema.Document = mongoose.model("Document", documentSchema);
schema.Semester = mongoose.model("Semester", semesterSchema);
schema.Course = mongoose.model("Course", courseSchema);
schema.Job = mongoose.model("Job", jobSchema);
schema.Grade = mongoose.model("Grade", gradeSchema);

module.exports = schema;
