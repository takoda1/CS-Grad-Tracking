var _ = {}

_.validateModelData = function (input, model) {
  var result = {}
  var m = model.schema.paths
  for (var key in m) {
    if (input[key] !== undefined && input[key] !== null) {
      if (m[key].instance === 'Array') {
        result[key] = input[key] ? input[key].split('|') : []
      } else if (m[key].instance === 'Boolean') {
        result[key] = Boolean(input[key])
      } else if (m[key].instance === 'Number') {
        result[key] = parseInt(input[key])
      } else if (m[key].instance === 'ObjectID') {
        result[key] = input[key] === '' ? null : input[key]
      } else if (m[key].instance === 'Date') {
        result[key] = new Date().toISOString()
      } else {
        result[key] = input[key]
      }
    }
  }
  return result
}

module.exports = _
