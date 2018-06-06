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
  active: Boolean
});

// Students
var studentSchema = mongoose.Schema({
  username: String,
  firstName: String,
  lastName: String,
  pid: Number,
  active: Boolean,
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
  fundingStatus: String,
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
  prpPassed: Boolean,
  backgroundPrepWorksheetApproved: Boolean,
  programOfStudyApproved: Boolean,
  researchPlanningMeeting: Boolean,
  committeeCompApproved: Boolean,
  phdProposalApproved: Boolean,
  oralExamPassed: Boolean,
  dissertationDefencePassed: Boolean,
  dissertationSubmitted: Boolean,
  job: {type: mongoose.Schema.Types.ObjectId, ref: "Job"},
  semesterStarted: { type: mongoose.Schema.Types.ObjectId, ref: "Semester" },
  advisor: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
  courseHistory: [{courses: { type: mongoose.Schema.Types.ObjectId, ref: "Course" }}]
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
    enum: ["FALL", "SPRING", "SUMMER"]
  }
});

// Courses
var courseSchema = mongoose.Schema({
  department: String,
  number: Number,
  univNumber: Number,
  name: String,
  category: {
    type: String,
    enum: ["Theory", "Systems", "Appls"]
  },
  hours: Number,
  section: Number,
  faculty: {type: mongoose.Schema.Types.ObjectId, ref: "Faculty"},
  semester: {type: mongoose.Schema.Types.ObjectId, ref: "Semester"}
});

// Jobs
var jobSchema = mongoose.Schema({
  position: {
    type: String,
    enum: ["RA", "TA", "Other"]
  },
  description: String,
  supervisor: {type: mongoose.Schema.Types.ObjectId, ref: "Faculty"},
  semester: {type: mongoose.Schema.Types.ObjectId, ref: "Semester"},
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
