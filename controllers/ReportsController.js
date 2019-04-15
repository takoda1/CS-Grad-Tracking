var schema = require("../models/schema.js");
var util = require("./util.js");
var XLSX = require("xlsx");
var fs = require("fs");
var path = require("path");
var formidable = require("formidable");

var reportController = {};

reportController.get = function (req, res) {
  res.render("../views/report/index.ejs", {});
}



reportController.download = function(req, res){
  schema.Faculty.find({}, "-_id -__v").sort({lastName: 1, firstName: 1}).lean().exec().then(function(result){
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(result);
    XLSX.utils.book_append_sheet(wb, ws, "Faculty");
    var filePath = path.join(__dirname, "../data/facultyTemp.xlsx");
    XLSX.writeFile(wb, filePath);
    res.setHeader("Content-Disposition", "filename=" + "Faculty.xlsx");
    res.setHeader("Content-type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    fs.createReadStream(filePath).pipe(res);
  });
}

module.exports = reportController;
