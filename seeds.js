var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {name: "History is to Learn!", 
    image: "https://www.whitman.edu/assets/images/Academics/Body-Image/history.jpg",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."    
    },
    {name: "World History", 
    image: "http://nathangiglierano.com/images/world%20map2.jpg",
    description: "History tells our mistakes"    
    },
    {name: "Paints History",
    image: "https://s3.amazonaws.com/classconnection/801/flashcards/6012801/jpg/padmapani-ajanta-cave-1-14916EF32411C73719F.jpg",
    description: "It is one of World's Oldest Painting from Ajanta Caves",
    }
    ]
function seedDB(){
    //Remove All campgrounds
Campground.remove({}, function(err){
    if(err){
        console.log(err);
    } else {
        console.log("removed campgrounds!");
        //add a few campgrounds
    data.forEach(function(seed){
    Campground.create(seed, function(err, campground){
    if(err){
        console.log(err);
    } else{
        console.log("Added Campground");
        //create a comment
        Comment.create({author: "Homer", text: "This Place is Great, but i wish there was a Internet!"
        }, function(err, comment){
            if (err){
                console.log(err);
            } else
            campground.comments.push(comment);
            campground.save();
            console.log("Created new Comment");
            
        });
    }
});
    
});
    }
});
}

module.exports = seedDB;