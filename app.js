var express = require("express")
var sessions = require("client-sessions")
var path = require("path")
var bodyParser = require("body-parser")
var compress = require("compression")
var https = require("https");
var schema = require("./models/schema.js");

var app = express()

// express api setup
app
  .use(compress())
  .use(sessions({
    cookieName: "gradInfoSession",
    secret: "ugzEbQSRk7YM23PAJn1yOeG9GkTak1xah70dF0ePF3PmsEMxoWan4ihH0ZLVfhdYDpWF6egzAhPHztW7dGxzkY6jMzjBsr3kQzlW",
    duration: 3 * 60 * 60 * 1000,
    activeDuration: 2 * 60 * 1000
  }))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .set("view cache", true)
  .use(function (req, res, next) {
    if (req.headers.uid) {
      res.cookie("onyen", req.headers.uid, { httponly: false })
    }
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
    next()
  })

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

//bootstrap static resource
app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist")))

//
app.use(express.static(path.join(__dirname, "node_modules")))

//public static resource
app.use(express.static(path.join(__dirname, "public")))

// routes to use for api
//app.use("/api", index);

//adds user pid to environmental variable if it doesn't already exist.
app.use(function(req, res, next){
	if(!process.env.userPID){
		var user = req.get("X-REMOTE-USER-1");
		https.get("https://onyenldap.cs.unc.edu/onyenldap.php?onyen="+user, resp=>{
			let data="";
			resp.on("data", (chunk)=>{
				data+=chunk;
			});
			resp.on("end", ()=>{
        var index = data.indexOf("pid");
        //maybe change this to be more robust
				var pid = data.substring(index + 5, index + 14);
				process.env.userPID = parseInt(pid);
				res.redirect("/");
			});
		});
	}
	else{
    var user = req.get("X-REMOTE-USER-1");
    https.get("https://onyenldap.cs.unc.edu/onyenldap.php?onyen="+user, resp=>{
      let data="";
      resp.on("data", (chunk)=>{
        data+=chunk;
      });
      resp.on("end", ()=>{
        var index = data.indexOf("pid");
        //maybe change this to be more robust
        var pid = data.substring(index + 5, index + 14);
        process.env.userPID = parseInt(pid);
        next();
      });
    });
	}
});

//global username locals (middleware)
app.use(function(req, res, next){
  res.locals.user = req.get("X-REMOTE-USER-1");
  next();
});

app.get("/logout", (req, res)=>{
	 process.env.userPID = "---------";
	 res.redirect("http://logout@csgrad.cs.unc.edu");
})

app.get("/", (req, res) => {
  console.log(process.env.userPID);

  schema.Faculty.findOne({pid: process.env.userPID}).exec().then(function(result){
    if(result != null){
      if(result.admin == true){ //admin
        res.redirect("/student");
      } else { //advisor
        res.redirect("/student");
      }
    }
    else{
      schema.Student.findOne({pid: process.env.userPID}).exec().then(function(result){
        if(result != null){ //student
          res.redirect("/studentView");
        } else {
          res.render("./error.ejs", {string: "Failed Authentication"});
        }
      });
    }
  });
});

app.use("/course", require("./routes/course"));

app.use("/faculty", require("./routes/faculty"));

app.use("/job", require("./routes/job"));

app.use("/student", require("./routes/student"));

app.use("/studentView", require("./routes/studentView"));

app.use("/report", require("./routes/report"));

// catch 404 and forward to error handler
app.use(function (req, res) {
  var err = new Error("Not Found")
  err.status = 404
})

// production error handler
app.use(function (err, req, res) {
  console.log(err)
  res.status(err.status || 500)
  res.json({ "error": err.message })
})

module.exports = app