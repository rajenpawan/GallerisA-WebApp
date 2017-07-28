
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// all the middleware goes here
var middlewareObj = {};
    
middlewareObj.checkCampgroundOwnership = function(req, res, next){
     if (req.isAuthenticated()){
         Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            res.redirect("back");
        } else {
        //does user own campground?
        if(foundCampground.author.id.equals(req.user._id)){
        next();
        } else {
            req.flash("error", "You are not authorised to do that");
            res.redirect("back");
        }
        }
    });
    } else {
        req.flash("error", "You are not authorised to do that");
        res.redirect("back");
    }

}   

middlewareObj.checkCommentOwnership = function(req, res, next){
     if (req.isAuthenticated()){
         Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            req.flash("error", "Campground not found!!");
            res.redirect("back");
        } else {
        //does user own Comment?  Note: using "equals" in below because in mongoose "=" wont support
        if(foundComment.author.id.equals(req.user._id)){
        next();
        } else {
            req.flash("error", "You are not authorised to do that");
            res.redirect("back");
        }
        }
    });
    } else {
        req.flash("error", "Please Login First!");
        res.redirect("back");
    }
};

//middleware
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    req.flash("error", "Please Login First!!");
    res.redirect("/login");
};

// document.getElementById('menu1').addEventListener('click', function(){
//     // function bgcolor(){
//   document.body.style.backgroundColor("blue");
// });


//OR

// var middlewareObj = {
//     checkCampgroundOwnership: function(){
        
//     }
// };

//OR


module.exports = middlewareObj;