var schema = require('../schema')
var util = require('../util')

var _ = {}

/**
 * @api {post} /api/student
 * @apiGroup Student
 *
 * @apiDescription ONYEN and name required
 *
 * @apiParam {String} username (Required)
 * @apiParam {String} firstName Students's first name (Required)
 * @apiParam {String} lastName Students's last name (Required)
 * @apiParam {Number} pid Student's PID (Required)
 * @apiParan {String} alternativeName Student's alternative name
 * @apiParam {enum: ['MALE', 'FEMALE', 'OTHER']} gender
 * @apiParam {String} ethnicity
 * @apiParam {String} status
 * @apiParam {Boolean} citizenship
 * @apiParam {String} residency
 * @apiParam {String} enteringStatus
 * @apiParam {String} researchArea
 * @apiParam {Boolean} backgroundApproved
 * @apiParam 
 * 
 * @apiSuccess {Object} success The newly created or updated student data
 *
 * @apiError {Object} DuplicateStudent Student already exists
 * @apiError {Object} RequiredParamNotFound Required parameter is missing
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
 * @apiGroup Student
 * 
 * @apiDescription At least one argument required
 * 
 * @apiParam {String} username 
 * @apiParam {Number} pid
 * @apiParam {String} firstName
 * @apiParam {String} lastName
 * @apiParam {}
 */

 module.exports = _