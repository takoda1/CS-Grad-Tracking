var schema = require('../schema')
var util = require('../util')

var _ = {}
var regexSlashes = /\/*\//ig

/**
 * @api {post} /api/student
 * @class Student
 *
 * @description userame, name and pid required
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
 * @param {String} semesterStarted (MongoID)
 * @param {String} advisor (MongoID)
 * @param {Object} courseHistory (MongoID array)
 * 
 * @returns {Object} success The newly created or updated student data
 *
 * @throws {Object} DuplicateStudent Student already exists
 * @throws {Object} RequiredParamNotFound Required parameter is missing
 */
_.post = function (input, res) {
  schema.Student.findOne({username: input.username}, function (err, result) {
    if (err) {
      res.json({
        'error': err.message,
        'origin': 'student.post'
      })
    } else {
      if (result) {
        res.json({
          'error': 'DuplicateStudent',
          'origin': 'student.post'
        })
      } else {
        if (input.username && input.firstName && input.lastName && input.pid) {
          var inputStudent = new schema.Student(util.validateModelData(input, schema.Student))
          inputStudent.save(function (err, result) {
            if (err) {
              res.json({
                'error': err.message,
                'origin': 'student.post'
              })
            } else {
              res.json(result)
            }
          })
        } else {
          res.send({
            'error': 'RequiredParamNotFound',
            'origin': 'student.post'
          })
        }
      }
    }
  })
}

/**
 * @api {get} /api/student
 * @class Student
 * 
 * @description At least one argument required
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
  var query = util.validateModelData(input)
  if (input.username || input.firstName || input.lastName) {
    query.username = (input.username.match(regexSlashes)) ? new RegExp(input.username.substring(1, input.username.length - 1), 'ig') : input.username
    query.firstName = (input.firstName.match(regexSlashes)) ? new RegExp(input.firstName.substring(1, input.firstName.length - 1), 'ig') : input.firstName
    query.lastName = (input.lastName.match(regexSlashes)) ? new RegExp(input.lastName.substring(1, input.lastName.length - 1), 'ig') : input.lastName
  }

  schema.Student.find(query).exec(function (err, result) {
    if (err) {
      res.json({
        'error': err.message,
        'origin': 'student.get'
      })
    } else {
      res.json(result)
    }
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
    schema.Student.findOne({username: input.username}, function (err, result) {
      if (err) {
        res.json({
          'error': 'StudentNotFound',
          'origin': 'student.put'
        })
      } else {
        schema.Student.findOneAndUpdate({username: input.username}, util.validateModelData(input, schema.Student), {new: true})
          .exec(function (err, result) {
            if (err) {
              res.json({
                'error': err.message,
                'origin': 'student.put'
              })
            } else {
              res.json(result)
            }
          })
      }
    })
  } else {
    res.json({
      'error': 'RequiredParamNotFound',
      'origin': 'student.put'
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
    schema.Student.findOneAndRemove({})
  } else {
    res.json({
      'error': 'RequiredParamNotFound',
      'origin': 'student.delete'
    })
  }
}

module.exports = _