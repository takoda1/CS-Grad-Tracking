/* global reject */
var schema = require('../schema')
var util = require('../util')

var _ = {}

/**
 * @api {post} /api/student
 * @class Student
 *
 * @description username, name and pid required
 *
 * @param {String} username (Required)
 * @param {String} firstName Students's first name (Required)
 * @param {String} lastName Students's last name (Required)
 * @param {Number} pid Student's PID (Required)
 * @param {String} alternativeName Student's alternative name
 * @param {enum: ['MALE', 'FEMALE', 'OTHER']} gender
 * @param {enum: ['AIAN', 'ASIAN', 'BLACK', 'HISPANIC', 'PACIFIC', 'WHITE']} ethnicity
 * @param {String} status
 * @param {Boolean} citizenship
 * @param {enum: ['YES', 'NO', 'APPLIED']} residency
 * @param {String} enteringStatus
 * @param {String} researchArea
 * @param {Boolean} backgroundApproved
 * @param {String} leaveExtension
 * @param {Boolean} fundingEligibility
 * @param {Boolean} fundingStatus
 * @param {enum: ['MASTERS', 'PHD', 'BOTH']} intendedDegree
 * @param {Number} hoursCompleted
 * @param {Boolean} prp
 * @param {Boolean} oralExam
 * @param {Boolean} committeeMeeting
 * @param {Boolean} allButDissertation
 * @param {Boolean} dissertationDefence
 * @param {Boolean} finalDissertation
 * @param {Object} semesterStarted
 * @param {String} advisor
 * @param {Object} courseHistory (MongoID array)
 *
 * @returns {Object} success The newly created or updated student data
 *
 * @throws {Object} DuplicateStudent Student already exists
 * @throws {Object} RequiredParamNotFound Required parameter is missing
 */
_.post = function (input, res) {
  schema.Student.findOne({username: input.username}).exec().then(function (result) {
    if (result) reject(new Error('DuplicateStudent'))
    else {
      schema.Student.findOne({pid: input.pid}).exec().then(function (result) {
        if (result) reject(new Error('DuplicateStudent'))
      }).then(function () {
        if (input.username && input.firstName && input.lastName && input.pid) {
          var inputStudent = new schema.Student(util.validateModelData(input, schema.Student))
          return inputStudent.save()
        } else reject(new Error('RequiredParamNotFound'))
      })
    }
  }).then(function (student) {
    res.json(student)
  }).catch(function (err) {
    res.json({
      'error': err.message,
      'origin': 'student.post'
    })
  })
}

/**
 * @api {get} /api/student
 * @class Student
 *
 * @description All params optional
 *
 * @param {String} username
 * @param {String} firstName Students's first name
 * @param {String} lastName Students's last name
 * @param {Number} pid Student's PID
 * @param {String} alternativeName Student's alternative name
 * @param {enum: ['MALE', 'FEMALE', 'OTHER']} gender
 * @param {enum: ['AIAN', 'ASIAN', 'BLACK', 'HISPANIC', 'PACIFIC', 'WHITE']} ethnicity
 * @param {String} status
 * @param {Boolean} citizenship
 * @param {enum: ['YES', 'NO', 'APPLIED']} residency
 * @param {String} enteringStatus
 * @param {String} researchArea
 * @param {Boolean} backgroundApproved
 * @param {String} leaveExtension
 * @param {Boolean} fundingEligibility
 * @param {Boolean} fundingStatus
 * @param {enum: ['MASTERS', 'PHD', 'BOTH']} intendedDegree
 * @param {Number} hoursCompleted
 * @param {Boolean} prp
 * @param {Boolean} oralExam
 * @param {Boolean} committeeMeeting
 * @param {Boolean} allButDissertation
 * @param {Boolean} dissertationDefence
 * @param {Boolean} finalDissertation
 * @param {String} semesterStarted (MongoID)
 * @param {String} advisor (MongoID)
 * @param {Object} courseHistory (MongoID array)
 *
 * @returns {Object} success Matching students
 */
_.get = function (input, res) {
  schema.Student.find(util.regexTransform(input, schema.Student)).exec().then(function (result) {
    res.json(result)
  }).catch(function (err) {
    res.json({'error': err.message, 'origin': 'student.get'})
  })
}

/**
 * @api {put} /api/student
 * @class Student
 *
 * @description username required
 *
 * @param {String} username
 * @param {String} firstName Students's first name
 * @param {String} lastName Students's last name
 * @param {Number} pid Student's PID
 * @param {String} alternativeName Student's alternative name
 * @param {enum: ['MALE', 'FEMALE', 'OTHER']} gender
 * @param {enum: ['AIAN', 'ASIAN', 'BLACK', 'HISPANIC', 'PACIFIC', 'WHITE']} ethnicity
 * @param {String} status
 * @param {Boolean} citizenship
 * @param {enum: ['YES', 'NO', 'APPLIED']} residency
 * @param {String} enteringStatus
 * @param {String} researchArea
 * @param {Boolean} backgroundApproved
 * @param {String} leaveExtension
 * @param {Boolean} fundingEligibility
 * @param {Boolean} fundingStatus
 * @param {enum: ['MASTERS', 'PHD', 'BOTH']} intendedDegree
 * @param {Number} hoursCompleted
 * @param {Boolean} prp
 * @param {Boolean} oralExam
 * @param {Boolean} committeeMeeting
 * @param {Boolean} allButDissertation
 * @param {Boolean} dissertationDefence
 * @param {Boolean} finalDissertation
 * @param {String} semesterStarted (MongoID)
 * @param {String} advisor (MongoID)
 * @param {Object} courseHistory (MongoID array)
 *
 * @returns {Object} success Newly updated student data
 *
 * @throws {Object} StudentNotFound
 * @throws {Object} RequiredParamNotFound Required parameter is missing
 */
_.put = function (input, res) {
  if (input.username) {
    schema.Student.findOne({username: input.username}).exec().then(function (result) {
      if (!result) reject(new Error('StudentNotFound'))
      else {
        return schema.Student.findOneAndUpdate({username: input.username}, util.validateModelData(input, schema.Student), {new: true}).exec()
      }
    }).then(function (result) {
      res.json(result)
    }).catch(function (err) {
      res.json({'error': err.message, 'origin': 'student.put'})
    })
  } else {
    reject(new Error('RequiredParamNotFound')).catch(function (err) {
      res.json({'error': err.message, 'origin': 'student.put'})
    })
  }
}

/**
 * @api {delete} /api/student
 * @class Student
 *
 * @description username is required
 *
 * @param {String} username
 *
 * @returns {Object} success Deleted student data
 *
 * @throws {Object} StudentNotFound
 * @throws {Object} RequiredParamNotFound Required paramter is missing
 */
_.delete = function (input, res) {
  if (input.username) {
    schema.Student.findOne({username: input.username}).exec().then(function (result) {
      if (result) return schema.findOneAndRemove({username: input.username}).exec()
      else reject(new Error('StudentNotFound'))
    }).then(function (result) {
      res.json(result)
    }).catch(function (err) {
      res.json({'error': err.message, 'origin': 'student.delete'})
    })
  } else {
    reject(new Error('RequiredParamNotFound')).catch(function (err) {
      res.json({'error': err.message, 'origin': 'student.delete'})
    })
  }
}

module.exports = _
