/* global reject */
var mongoose = require("mongoose");
var schema = {};

// Administrators
var adminSchema = mongoose.Schema({
  onyen: String,
  firstName: String,
  lastName: String,
  pid: Number
});

// Faculty
var facultySchema = mongoose.Schema({
  onyen: String,
  csID: String,
  firstName: String,
  lastName: String,
  pid: Number,
  sectionNumber: Number,
  active: Boolean,
  admin: Boolean
});

// Students
var studentSchema = mongoose.Schema({
  onyen: String,
  firstName: String,
  lastName: String,
  pid: Number,
  status: {
    type: String,
    enum: ["Active", "Inactive", "Leave", "Graduated", "Ineligible"],
    default: "Active"
  },
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
  fundingEligibility: {
	  type: String,
	  enum: ["NOT GUARANTEED", "GUARANTEED", "PROBATION"],
	  default: "NOT GUARANTEED"
  },
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
  notes: String,
  grades: [{type:mongoose.Schema.Types.ObjectId, ref: "Grade"}]
});

// Forms
var formSchema = mongoose.Schema({
  title: String,
  student: {type:mongoose.Schema.Types.ObjectId, ref: "Student"},
  defaultTitle: {
    type: String,
    enum: ["Background Preparation Worksheet", "Course Waiver", "M.S. Program of Study",
      "Outside Review Option", "Request for Appointment of M.S. Committee", "Ph.D. Program of Study",
      "Report of Disapproval of Dissertation Proposal", "Technical Writing Requirement",
      "Report of Preliminary Research Presentation", "Teaching Requirement", "Report of Research Discussion",
      "Program Product Requirement", "Transfer Credit Request", "Student Progress Report", "Other"]
  }
});

// Semesters
var semesterSchema = mongoose.Schema({
  year: Number,
  season: {
    type: String,
    enum: ["FA", "SP", "S1", "S2"]
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
    enum: ["NA", "Theory", "Systems", "Appls"]
  },
  topic: String,
  hours: Number,
  section: String,
  faculty: {type: mongoose.Schema.Types.ObjectId, ref: "Faculty"},
  semester: {type: mongoose.Schema.Types.ObjectId, ref: "Semester"}
});

var courseInfoSchema = mongoose.Schema({
  number: Number,
  name: String,
  hours: Number
})

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
    enum: ["H+", "H", "H-", "P+", "P", "P-", "L+", "L", "L-", "NA"],
    default: "NA"
  },
  course: {type: mongoose.Schema.Types.ObjectId, ref: "Course"}
});

 var semesterReferenceSchema = mongoose.Schema({
   name: String,
   semester: {type: mongoose.Schema.Types.ObjectId, ref:"Semester"}
 });

schema.Admin = mongoose.model("Admin", adminSchema);
schema.Faculty = mongoose.model("Faculty", facultySchema);
schema.Student = mongoose.model("Student", studentSchema);
schema.Form = mongoose.model("Form", formSchema);
schema.Semester = mongoose.model("Semester", semesterSchema);
schema.Course = mongoose.model("Course", courseSchema);
schema.CourseInfo = mongoose.model("CourseInfo", courseInfoSchema);
schema.Job = mongoose.model("Job", jobSchema);
schema.Grade = mongoose.model("Grade", gradeSchema);
schema.SemesterReference = mongoose.model("SemesterReference", semesterReferenceSchema);

module.exports = schema;
