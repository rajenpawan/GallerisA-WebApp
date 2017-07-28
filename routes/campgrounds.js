var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");
var multer  = require('multer');
var upload = multer({ dest: 'public/uploads/' });
router.get("/", function(req, res){
    //Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});       
       }
    });
});
//CREATE - add new campground to DB
router.post("/", upload.any(), middleware.isLoggedIn ,function(req, res){
    //get data from form and add to campgrounds array
     var name = req.body.name;
     var price = req.body.price;
    var image =   req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,        
        username: req.user.username
    };
    var newCampground = {name: name, price: price, image: image, description: desc, author: author};
    
    // campgrounds.push(newCampground)
    //create a nde campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
       if(err){
           console.log(err);
       } else {
        console.log(newlyCreated);
        res.redirect("/campgrounds");       
       }
    });
//redirect back to campgrounds page
});
//NEW - show form to create new campgrounds
router.get("/new", middleware.isLoggedIn ,function(req, res){
   res.render("campgrounds/new"); 
});

//SHOW - shows more info about one campground
router.get("/:id", function(req, res){
  //find the campground with provided ID
   Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if(err){
           console.log(err);
       } else {
           console.log(foundCampground);
           //render show template with that campground
           res.render("campgrounds/show", {campground: foundCampground});
           
       }
   });
});

//Edit Campground Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    //is user logged in?
     Campground.findById(req.params.id, function(err, foundCampground){
    res.render("campgrounds/edit", {campground: foundCampground});
    });
});
    
    //otherwise, redirect
    //if not, redirect
   
//Update Campgrounds Route 
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
   //find and update the correct campground
//   var data = {name: req.body.name = > instead in edit.ejs name="campground[name]"
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else {
   //redirect somewhere(show page)
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});
//Destroy Campground Route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

//find isLoggedIn in middleware/index.js

module.exports = router;