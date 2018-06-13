/* global reject */
var mongoose = require("mongoose");
var schema = {};

// Administrators
var adminSchema = mongoose.Schema({
  onyen: String,
  firstName: String,
  lastName: String
});

// Faculty
var facultySchema = mongoose.Schema({
  onyen: String,
  firstName: String,
  lastName: String,
  pid: Number,
  active: Boolean
});

// Students
var studentSchema = mongoose.Schema({
  onyen: String,
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
  residency: {
    type: String,
    enum: ["YES", "NO", "APPLIED"],
    default: "NO"
  },
  enteringStatus: String,
  researchArea: String,
  leaveExtension: String,
  intendedDegree: {
    type: String,
    enum: ["MASTERS", "PHD", "BOTH"],
    default: "MASTERS"
  },
  hoursCompleted: Number,
  citizenship: Boolean,
  fundingEligibility: Boolean,
  fundingStatus: Boolean,
  backgroundApproved: Date,
  mastersAwarded: Date,
  prpPassed: Date,
  backgroundPrepWorksheetApproved: Date,
  programOfStudyApproved: Date,
  researchPlanningMeeting: Date,
  committeeCompApproved: Date,
  phdProposalApproved: Date,
  oralExamPassed: Date,
  dissertationDefencePassed: Date,
  dissertationSubmitted: Date,
  jobHistory: [{type: mongoose.Schema.Types.ObjectId, ref: "Job"}],
  semesterStarted: { type: mongoose.Schema.Types.ObjectId, ref: "Semester" },
  advisor: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
  courseHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  forms: [{type:mongoose.Schema.Types.ObjectId, ref: "Form"}]
});

// Forms
var formSchema = mongoose.Schema({
  title: {
    type: String,
    enum: ["Background Preparation Worksheet", "Course Waiver", "M.S. Program of Study",
      "Outside Review Option", "Request for Appointment of M.S. Committee", "Ph.D. Program of Study",
      "Report of Disapproval of Dissertation Proposal", "Technical Writing Requirement",
      "Report of Preliminary Research Presentation", "Teaching Requirement",
      "Report of Research Discussion", "Program Product Requirement"]
  },
  data: Buffer
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
    enum: ["RA", "TA", "OTHER"]
  },
  supervisor: {type: mongoose.Schema.Types.ObjectId, ref: "Faculty"},
  semester: {type: mongoose.Schema.Types.ObjectId, ref: "Semester"},
  course: {type: mongoose.Schema.Types.ObjectId, ref: "Course"},
  description: String
  
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
schema.Form = mongoose.model("Form", formSchema);
schema.Semester = mongoose.model("Semester", semesterSchema);
schema.Course = mongoose.model("Course", courseSchema);
schema.Job = mongoose.model("Job", jobSchema);
schema.Grade = mongoose.model("Grade", gradeSchema);

module.exports = schema;
