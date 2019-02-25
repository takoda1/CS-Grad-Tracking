var mongoose = require("mongoose");
var schema = require("../models/schema.js");
var util = require("./util.js");

class Form {
	constructor(_id){
		this._id = _id;
		this.CS01 = {};
		this.CS02 = {};
		this.CS03 = {};
		this.CS04 = {};
		this.CS05 = {};
		this.CS06 = {};
		this.CS07 = {};
		this.CS08 = {};
		this.CS09 = {};
		this.CS10 = {};
		this.CS11 = {};
		this.CS12 = {};
		this.CS13 = {};
	}
	
	getCS01(){
		return new Promise((resolve, reject)=>{
	      schema.CS01.findOne({student: this._id}).exec().then(function(result){
	        this.CS01 = result;
	        resolve(true);
	      }).catch(function(error){
	      	resolve(false);
	      });
	  	});
	}
}

module.exports = Form;

