var _ = {}

var regexSlashes = /\/*\//ig;

// Removes variables not defined in models and other undefined/null variables
_.validateModelData = function (input, model) {
  var result = {}
  var m = model.schema.paths
  for (var key in m) {
    if (input[key] !== undefined && input[key] !== null && input[key] !== NaN && input[key] !== '') {
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
_.regexTransform = function (input) {
  for (var key in input) {
    if (input[key] !== undefined && input[key] !== null) {
      if (input[key].constructor === Array) {
        for (var i = 0; i < input[key].length; i++) {
          if(isNaN(input[key])){
          input[key][i] = (input[key][i].match(regexSlashes))
           ? new RegExp(input[key][i].substring(1, input[key][i].length - 1), 'ig') : input[key][i]
          }
          else{
            input[key][i] = (input[key][i].toString().match(regexSlashes))
           ? new RegExp(input[key][i].substring(1, input[key][i].length - 1), 'ig') : input[key][i]
          }
        }
        input[key] = {$in: input[key]}
      } else {
        if(isNaN(input[key])){
          input[key] = (input[key].match(regexSlashes))
           ? new RegExp(input[key].substring(1, input[key].length - 1), 'ig') : input[key]
        }
        else{
          input[key] = (input[key].toString().match(regexSlashes))
           ? new RegExp(input[key].substring(1, input[key].length -1), 'ig') : input[key]
        }
      }
    }
  }
  return input
}

/*
  addSlashes is used by the get function in the controllers to make it so that 
  text fields can be searched using regexp rather than exactly (eg, searching abc
  for username returns all entries in the database that contain abc rather than 
  only returning entries that are exactly abc)
*/
_.addSlashes = function(input){
  for(var key in input){
    if(input[key].constructor == Array){
      for(var i = 0; i < input[key].length; i++){
        input[key][i] = new RegExp(input[key][i]);
      }
    }
    else{
      //only create regexp if the field is text
      if(typeof input[key] == 'string'){
        console.log(input[key]);
        input[key] = new RegExp(input[key]);
        console.log(input[key]);
      }
    }
  }
  return input;
}

module.exports = _
