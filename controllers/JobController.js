/* global reject */

var schema = require('../models/schema')
var util = require('util')

var _ = {}

/**
 * @api {post} /api/job
 * @class Job
 *
 * @description Position, supervisor and course required
 *
 * @param {String} position
 * @param {String} supervisor
 * @param {String} course
 *
 * @returns {Object} success Newly created job object
 *
 * @throws {Object} DuplicateJob
 * @throws {Object} InvalidSupervisor
 * @throws {Object} RequiredParamNotFound
 */
_.post = function (input, res) {
  input.students = null
  schema.Job.findOne(util.validateModelData(input, schema.Job)).exec().then(function (result) {
    if (result !== null) throw new Error('DuplicateJob')
    else {
      var inputJob = new schema.Job(util.validateModelData(input, schema.Job))
      return inputJob.save()
    }
  }).then(function (job) {
    res.json(job)
  }).catch(function (err) {
    res.json({'error': err.message, 'origin': 'job.post'})
  })
}

/**
 * @api {get} /api/job
 * @class Job
 *
 * @description At least one parameter required
 *
 * @param {String} position
 * @param {String} supervisor
 * @param {String} course
 * @param {Object} students
 *
 * @returns {Object} success Matching jobs
 */
_.get = function (input, res) {
  schema.Job.find(util.regexTransform(input, schema.Job)).exec().then(function (result) {
    res.json(result)
  }).catch(function (err) {
    res.json({'error': err.message, 'origin': 'job.get'})
  })
}

/**
 * @api {put} /api/job
 * @class Job
 *
 * @description id is required
 *
 * @param {String} id (MongoID)
 * @param {String} position
 * @param {String} supervisor
 * @param {String} course
 * @param {String} students
 *
 * @returns {Object} success Newly updated job data
 *
 * @throws {Object} JobNotFound
 * @throws {Object} RequiredParamNotFound
 */
_.put = function (input, res) {
  if (input.id) {
    schema.Job.findOne({_id: input.id}).exec().then(function (result) {
      if (result !== null) return schema.Job.findOneAndUpdate({_id: input.id}, util.validateModelData(input, schema.Job), {new: true}).exec()
      else throw new Error('JobNotFound')
    }).then(function (result) {
      res.json(result)
    }).catch(function (err) {
      res.json({'error': err.message, 'origin': 'job.put'})
    })
  } else {
    throw new Error('RequiredParamNotFound').catch(function (err) {
      res.json({'error': err.message, 'origin': 'job.put'})
    })
  }
}

/**
 * @api {delete} /api/job
 * @class Job
 *
 * @description id is required
 *
 * @param {String} id (MongoID)
 *
 * @returns {Object} Deleted job data
 *
 * @throws {Object} JobNotFound
 * @throws {Object} RequiredParamNotFound
 */
_.delete = function (input, res) {
  if (input.id) {
    schema.Job.findOne({_id: input.id}).exec().then(function (result) {
      if (result !== null) return schema.Job.findOneAndRemove({_id: input.id}).exec()
      else throw new Error('JobNotFound')
    }).then(function (result) {
      res.json(result)
    }).catch(function (err) {
      res.json({'error': err.message, 'origin': 'job.delete'})
    })
  } else {
    reject(new Error('RequiredParamNotFound')).catch(function (err) {
      res.json({'error': err.message, 'origin': 'job.delete'})
    })
  }
}

module.exports = _
