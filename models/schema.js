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
  csid: String,
  firstName: String,
  lastName: String,
  pronouns: {
  	type: String,
  	enum: ["she, her", "he, him", "they, them", "ze, zie", "hir, hirs", "xe, xem", "pe, per", "e/ey, em", "(f)ae, (f)aer", "None"],
  	default: "None"
  },
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
  phdAwardedDate: Date,
  oralExamPassed: Date,
  dissertationDefencePassed: Date,
  dissertationSubmitted: Date,
  jobHistory: [{type: mongoose.Schema.Types.ObjectId, ref: "Job"}],
  semesterStarted: { type: mongoose.Schema.Types.ObjectId, ref: "Semester" },
  advisor: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
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
  description: String,
  hours: Number,
  fundingSource: {type: mongoose.Schema.Types.ObjectId, ref: "Grant"}
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

var grantSchema = mongoose.Schema({
  name: String
})

var noteSchema = mongoose.Schema({
  student: {type: mongoose.Schema.Types.ObjectId, ref:"Student"},
  title: String,
  date: Date,
  note: String
})

//form schemas
var CS01Schema = mongoose.Schema({
  student: {type: mongoose.Schema.Types.ObjectId, ref:"Student"},
  name: String, pid: Number,
  comp283Covered: String, comp283Date: String,
  comp410Covered: String, comp410Date: String,
  comp411Covered: String, comp411Date: String,
  comp455Covered: String, comp455Date: String,
  comp521Covered: String, comp521Date: String,
  comp520Covered: String, comp520Date: String,
  comp530Covered: String, comp530Date: String,
  comp524Covered: String, comp524Date: String,
  comp541Covered: String, comp541Date: String,
  comp550Covered: String, comp550Date: String,
  math233Covered: String, math233Date: String,
  math381Covered: String, math381Date: String,
  math547Covered: String, math547Date: String,
  math661Covered: String, math661Date: String,
  stat435Covered: String, stat435Date: String,
  studentSignature: String, studentDateSigned: String,
  advisorSignature: String, advisorDateSigned: String
});

var CS01BSMSSchema = mongoose.Schema({
  student: {type: mongoose.Schema.Types.ObjectId, ref:"Student"},
  name: String, pid: Number,
  comp521Covered: String, comp521Date: String,
  comp520Covered: String, comp520Date: String,
  comp530Covered: String, comp530Date: String,
  comp524Covered: String, comp524Date: String,
  comp541Covered: String, comp541Date: String,
  math661Covered: String, math661Date: String,
  studentSignature: String, studentDateSigned: String,
  advisorSignature: String, advisorDateSigned: String
});

var CS02Schema = mongoose.Schema({
  student: {type: mongoose.Schema.Types.ObjectId, ref:"Student"},
  name: String, pid: Number, dateSubmitted: String,
  courseNumber: String,
  basisWaiver: String,
  advisorSignature: String, advisorDateSigned: String,
  instructorSignature: String, instructorDateSigned: String
})

var CS03Schema = mongoose.Schema({
  student: {type: mongoose.Schema.Types.ObjectId, ref:"Student"},
  name: String, pid: Number, dateSubmitted: String,
  DR1: String, university1: String, dept1: String, course1: String, hours1: Number, semester1: String, title1: String,
  DR2: String, university2: String, dept2: String, course2: String, hours2: Number, semester2: String, title2: String,
  DR3: String, university3: String, dept3: String, course3: String, hours3: Number, semester3: String, title3: String,
  DR4: String, university4: String, dept4: String, course4: String, hours4: Number, semester4: String, title4: String,
  DR5: String, university5: String, dept5: String, course5: String, hours5: Number, semester5: String, title5: String,
  DR6: String, university6: String, dept6: String, course6: String, hours6: Number, semester6: String, title6: String,
  DR7: String, university7: String, dept7: String, course7: String, hours7: Number, semester7: String, title7: String,
  DR8: String, university8: String, dept8: String, course8: String, hours8: Number, semester8: String, title8: String,
  DR9: String, university9: String, dept9: String, course9: String, hours9: Number, semester9: String, title9: String,
  DR10: String, university10: String, dept10: String, course10: String, hours10: String, semester10: String, title10: String,
  backgroundPrep: Boolean,
  programProduct: Boolean,
  comprehensivePaper: Boolean,
  thesis: Boolean,
  outsideReview: Boolean,
  comprehensiveExam: String,
  studentSignature: String,
  adviserSignature: String,
  approved: String,
  approvalReason: String,
  directorSignature: String, directorDateSigned: String
})

var CS04Schema = mongoose.Schema({
  student: {type: mongoose.Schema.Types.ObjectId, ref:"Student"},
  name: String, pid: Number, dateSubmitted: String,
  projectDescription: String,
  docProprietary: Boolean,
  studentSignature: String, studentDateSigned: String,
  chairmanSignature: String, chairmanDateSigned: String,
  approved: Boolean
})

var CS05Schema = mongoose.Schema({
  student: {type: mongoose.Schema.Types.ObjectId, ref:"Student"},
  name: String, pid: Number, dateSubmitted: String,
  oralComprehensiveExam: Boolean,
  thesis: Boolean,
  nominee1: String, nominee1Department:String, nominee1Status: String,
  nominee2: String, nominee2Department:String, nominee2Status: String,
  nominee3: String, nominee3Department:String, nominee3Status: String,
  nominee4: String, nominee4Department:String, nominee4Status: String,
  nominee5: String, nominee5Department:String, nominee5Status: String,
  thesisAdviser: String,
  committeeChairman: String,
  directorSignature: String, directorDateSigned: String
})

var CS06Schema = mongoose.Schema({
  student: {type: mongoose.Schema.Types.ObjectId, ref:"Student"},
  name: String, pid: Number, dateSubmitted: String, dateEntered: String,
  dissTitle: String,
  comp915: Boolean,
  breadthCourseCategory1: String, breadthCourseInfo1: String, breadthCourseDate1: String, breadthCourseGrade1: String,
  breadthCourseCategory2: String, breadthCourseInfo2: String, breadthCourseDate2: String, breadthCourseGrade2: String,
  breadthCourseCategory3: String, breadthCourseInfo3: String, breadthCourseDate3: String, breadthCourseGrade3: String,
  breadthCourseCategory4: String, breadthCourseInfo4: String, breadthCourseDate4: String, breadthCourseGrade4: String,
  breadthCourseCategory5: String, breadthCourseInfo5: String, breadthCourseDate5: String, breadthCourseGrade5: String,
  breadthCourseCategory6: String, breadthCourseInfo6: String, breadthCourseDate6: String, breadthCourseGrade6: String,
  concentrationCourseInfo1: String, concentrationCourseDate1: String, concentrationCourseHours1: Number,
  concentrationCourseInfo2: String, concentrationCourseDate2: String, concentrationCourseHours2: Number,
  concentrationCourseInfo3: String, concentrationCourseDate3: String, concentrationCourseHours3: Number,
  concentrationCourseInfo4: String, concentrationCourseDate4: String, concentrationCourseHours4: Number,
  otherCourseInfo1: String, otherCourseHours1: Number,
  otherCourseInfo2: String, otherCourseHours2: Number,
  otherCourseInfo3: String, otherCourseHours3: Number,
  otherCourseInfo4: String, otherCourseHours4: Number,
  note: String,
  otherCourses: String,
  minor: String,
  backgroundPrepWorkSheet: Boolean,
  programProductRequirement: Boolean,
  PHDWrittenExam: Boolean,
  PHDOralExam: Boolean,
  committee1: String,
  committee2: String,
  committee3: String,
  committee4: String,
  committee5: String,
  committee6: String,
  adviser: String, chairman: String,
  chairSignature: String,
  approved: String,
  reasonApproved: String,
  directorSignature: String
})

var CS07Schema = mongoose.Schema({
  student: {type: mongoose.Schema.Types.ObjectId, ref:"Student"},
  name: String, pid: Number,
  comments: String,
  chairmanSignature: String, chairmanDateSigned: String
});

var CS08Schema = mongoose.Schema({
  student: {type: mongoose.Schema.Types.ObjectId, ref:"Student"},
  name: String, pid: Number,
  semester: String, year: Number,
  title: String,
  primaryReader: String, primaryDate: String,
  secondaryReader: String, secondaryDate: String,
  primarySignature: String, primarySignedDate: String,
  secondarySignature: String, secondarySignedDate: String
})

var CS09Schema = mongoose.Schema({
  student: {type: mongoose.Schema.Types.ObjectId, ref:"Student"},
  name: String, pid: Number,
  prpTitle: String,
  researchAdvisor: String,
  peerReviewed: String,
  authors: String,
  paperAccepted: String, paperNotifyDate: String,
  reviewsAvailable: String,
  researchResponsible: String,
  present: String,
  advisorSignature: String, advisorDateSigned: String,
  committeeSignature1: String, committeeDateSigned1: String,
  committeeSignature2: String, committeeDateSigned2: String,
  committeeSignature3: String, committeeDateSigned3: String,
  committeeSignature4: String, committeeDateSigned4: String,
  presentationDate: String,
  conceptIntegration: Number,
  creativity: Number,
  clarity: Number,
  abstractionFormality: Number,
  organization: Number,
  writing: Number,
  presentation: Number,
  answeringQuestion: Number,
  overallScore: Number,
  feedback: String
})

var CS11Schema = mongoose.Schema({
  student: {type: mongoose.Schema.Types.ObjectId, ref:"Student"},
  name: String, pid: Number,
  fullResponsibility: String,
  partialResponsibility: String,
  semester: String, year: Number,
  supervisor: String, supervisorSignature: String, supervisorDateSigned: String,
  other: String,
  approved: String,
  directorSignature: String, directorDateSigned: String
})

var CS12Schema = mongoose.Schema({
  student: {type: mongoose.Schema.Types.ObjectId, ref:"Student"},
  name: String, pid: Number, email: String, dateMet: String,
  committeeSignature1: String,
  committeeSignature2: String,
  committeeSignature3: String,
  committeeSignature4: String,
  committeeSignature5: String,
  committeeSignature6: String
});

var CS13Schema = mongoose.Schema({
  student: {type: mongoose.Schema.Types.ObjectId, ref:"Student"},
  name: String, pid: Number, email: String, dateMet: String,
  comp523: Boolean,
  comp523Signature: String,
  comp523Name: String,
  hadJob: Boolean,
  jobInfo: String,
  adviserName: String,
  adviserSignature: String,
  alternative: Boolean,
  product: String,
  client: String,
  position: String,
  altSignature1: String,
  altSignature2: String,
  altPrint1: String,
  altPrint2: String
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
schema.Grant = mongoose.model("Grant", grantSchema);
schema.SemesterReference = mongoose.model("SemesterReference", semesterReferenceSchema);
schema.Note = mongoose.model("Note", noteSchema);
schema.CS01 = mongoose.model("CS01", CS01Schema);
schema.CS01BSMS = mongoose.model("CS01BSMS", CS01BSMSSchema);
schema.CS02 = mongoose.model("CS02", CS02Schema);
schema.CS03 = mongoose.model("CS03", CS03Schema);
schema.CS04 = mongoose.model("CS04", CS04Schema);
schema.CS05 = mongoose.model("CS05", CS05Schema);
schema.CS06 = mongoose.model("CS06", CS06Schema);
schema.CS07 = mongoose.model("CS07", CS07Schema);
schema.CS08 = mongoose.model("CS08", CS08Schema);
schema.CS09 = mongoose.model("CS09", CS09Schema);
schema.CS11 = mongoose.model("CS11", CS11Schema);
schema.CS12 = mongoose.model("CS12", CS12Schema);
schema.CS13 = mongoose.model("CS13", CS13Schema);

module.exports = schema;
