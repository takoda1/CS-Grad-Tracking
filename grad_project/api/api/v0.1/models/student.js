var schema = require('../schema')

var _ = {}

/**
 * @api {post} /api/student
 * @apiGroup Student
 *
 * @apiDescription ONYEN and name required
 *
 * @apiParam {String} username (Required)
 * @apiParam {String} firstName Students's first name
 * @apiParam {String} lastName Students's last name
 * @apiParam {Number} PID Student's PID
 * @apiParan {String} alternativeName Student's alternative name
 * @apiParam {enum: ['MALE', 'FEMALE', 'OTHER']} gender
 * @apiParam {String} Ethnicity
 * @apiParam {String} Status
 * @apiParam {Boolean} Citizenship
 * @apiParam {String} Residency
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
  
}

 module.exports = _