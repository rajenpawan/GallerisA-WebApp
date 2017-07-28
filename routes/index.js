var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
// var locus = require('locus');
var Campground = require("../models/campground");

//root route
router.get("/", function(req, res){
   res.render("landing"); 
});


//==============
//Comments Route
//==============

//AUTH ROUTES
//Show Register form
router.get("/register", function(req, res){
    res.render("register"); //, {page: 'register'}
});
//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User(
    {    
    username: req.body.username, 
    avatar: req.body.avatar,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email
    });
    // var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            // console.log(err);
            req.flash("error", err.message);
            return res.render("register");
        } else {
            passport.authenticate("local")(req, res, function(){
              req.flash("success", "Welcome to YelpCamp " + req.body.username); //or user.username
                res.redirect("/campgrounds");
            });
        }
    });
});
//show login form
router.get("/login", function(req, res){
    res.render("login");
});
//handling login logic middlware is passport.authenticate
router.post("/login", passport.authenticate("local", 
{successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){
});
//logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged You Out!");  
    res.redirect("/campgrounds");
});

//User profiles
router.get("/users/:id", function(req, res){
   User.findById(req.params.id, function(err, foundUser){
      if(err){
          req.flash("error", "Something Went Wrong");
          res.redirect("/campgrounds");
          
      } 
    //   eval(require('locus'))
        Campground.find().where('author.id').equals(foundUser._id).exec(function(err, campgrounds){
            if(err){
                req.flash("error", "something wnet wrong");
                res.redirect("/campgrounds");
            }
            res.render("users/show", {user: foundUser, campgrounds: campgrounds});
        });
   }); 
});

//middleware isLoggedIn
module.exports = router;