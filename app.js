var express = require("express");
var app = express();
var bodyparser = require("body-parser");
const PORT = process.env.PORT || 3000;

var mongoose  =  require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground = require("./models/campground"),
    User = require("./models/user"),
    seedDB  =  require("./seeds"),
    Comment = require("./models/comment"),
    methodOverride = require("method-override")

    //requiring routes
 var commentRoutes = require("./routes/comments"),
     campgroundRoutes = require("./routes/campgrounds"),
     indexRoutes = require("./routes/index");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://rajen:Rajen1234@ds161262.mlab.com:61262/galleriesa");
// mongoose.connect("mongodb://localhost/yelpcamp_v12", { useMongoClient: true });
// mongodb://pawan:Pawan1234@ds161262.mlab.com:61262/galleriesa
app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();  //seed the database

//Passport Configuration
app.use(require("express-session")({
    secret: "Rusty is the Cutest Dog!!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/",indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.use(function(req, res, next){
  if(req.headers['x-forwarded-proto'] === 'https'){
    res.redirect('http://' + req.hostname + req.url);
  } else {
    next();
  }
})

app.listen(PORT, function(){
  console.log("YelpCamp has Started " + PORT);
});
// app.listen(process.env.PORT, process.env.IP, function(){
//  console.log("The YelpCamp has Started");
// });
