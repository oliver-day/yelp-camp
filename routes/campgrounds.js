const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const middleware = require('../middleware');

// INDEX - Show all campgrounds
router.get("/", (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
});

// CREATE - add new campground
router.post("/", middleware.isLoggedIn, (req, res) => {
    let name = req.body.name;
    let price = req.body.price;
    let image = req.body.image;
    let description = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let newCampground = {
        name: name,
        price: price,
        image: image,
        description: description,
        author: author
    };
    // Create new campground and save to database
    Campground.create(newCampground, (err, newlyCreated) => {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// New - show form to create new campgrounds
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

// SHOW - shows more info about one campground
router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if(err || !foundCampground) {
            req.flash("error", "Campground not found");
            res.redirect("back")
        } else {
            // console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// Edit - campground
router.get("/:id/edit", middleware.checkCampgroundUserAccess, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render("campgrounds/edit", {campground: foundCampground});
            
    });
});

// Update - campground
router.put("/:id", middleware.checkCampgroundUserAccess, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if(err) {
            req.flash("error", err.message);
            res.redirect("/campgrounds");
        } else {
            // console.log(updatedCampground);
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

// Destroy - campground
router.delete("/:id", middleware.checkCampgroundUserAccess, (req, res) => {
    Campground.findByIdAndDelete(req.params.id, (err) => {
        if(err) {
            req.flash("error", err.message);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;
