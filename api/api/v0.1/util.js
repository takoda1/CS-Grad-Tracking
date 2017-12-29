var _ = {}

var regexSlashes = /\/*\//ig

// Removes variables not defined in models and other undefined/null variables
_.validateModelData = function (input, model) {
  var result = {}
  var m = model.schema.paths
  for (var key in m) {
    if (input[key] !== undefined && input[key] !== null) {
      if (m[key].instance === 'Array') {
        result[key] = input[key]
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

// Transforms expressions surrounded by '/'s to proper JS regular expressions
_.regexTransform = function (input, model) {
  input = _.validateModelData(input, model)
  for (var key in input) {
    if (input[key] !== undefined && input[key] !== null) {
      if (input[key].constructor === Array) {
        for (var i = 0; i < input[key].length; i++) {
          input[key][i] = (input[key][i].matches(regexSlashes))
           ? new RegExp(input[key][i].substring(1, input[key][i].length - 1), 'ig') : input[key][i]
        }
        input[key] = {$in: input[key]}
      } else {
        input[key] = (input[key].matches(regexSlashes))
         ? new RegExp(input[key].substring(1, input[key].length - 1), 'ig') : input[key]
      }
    }
  }
  return input
}

module.exports = _
