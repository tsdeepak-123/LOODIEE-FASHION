const express = require("express");
const app = express();
const hbs = require("express-handlebars");
const path = require("path");
const bodyparser = require("body-parser");
const session = require("express-session");
require("dotenv").config();

const mongoose = require("mongoose");
const handlebars = require("handlebars");



//index incrementing 

handlebars.registerHelper("inc", function (value, options) {
  return parseInt(value) + 1;
});

//----------------------------pagination helpers----------------------------------------------

handlebars.registerHelper('gt', function(a, b) {
    return a > b;
  });
  handlebars.registerHelper('neq', function(a, b) {
    return a !== b;
  });
  handlebars.registerHelper('range', function(start, end) {
    const result = [];
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  });
  handlebars.registerHelper('eq', function(a, b) {
    return a === b;
  });
  handlebars.registerHelper('subtract', function(a, b) {
    return a - b;
  });
  handlebars.registerHelper('lt', function(a, b) {
    return a < b;
  });
  handlebars.registerHelper('add', function(a, b) {
    return a + b;
  });
  handlebars.registerHelper('and', function() {
    var args = Array.prototype.slice.call(arguments);
    var result = true;
    for(var i = 0; i < args.length; i++) {
      if(!args[i]) {
        result = false;
        break;
      }
    }
    return result;
  });
  handlebars.registerHelper('or', function() {
    var args = Array.prototype.slice.call(arguments);
    var result = false;
  
    for (var i = 0; i < args.length; i++) {
      if (args[i]) {
        result = true;
        break;
      }
    }
  
    return result;
  });
//------------------------------------------------pagination helpers-------------------------------------------------
//mongoose connection

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/TestProject");

//url path
app.use((req, res, next) => {
  console.log(req.method + req.originalUrl);
  next();
});

//static folder setting

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

//session

app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    saveUninitialized: true,
    cookie: { maxAge: 600000 },
    resave: false,
  })
);

//view engine setting

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.engine(
  "hbs",
  hbs.engine({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layout/",
    partialsDir: __dirname + "/views/partials",
    
  })
);

const userRoute = require("./routes/userRoute");
app.use("/", userRoute);
const adminRoute = require("./routes/adminRoute");
app.use("/admin", adminRoute);

//server

app.listen(3000, () => {
  console.log("server is running");
});
