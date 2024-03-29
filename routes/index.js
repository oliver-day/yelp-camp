const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');


// Root route
router.get("/", (req, res) => {
    res.render("landing");
});

// ==========================
// AUTH ROUTES
// ==========================

router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", (req, res) => {
    let newUser = new User({username: req.body.username});
    if(req.body.adminCode === process.env.ADMIN_CODE) {
        newUser.isAdmin = true;
    }

    User.register(newUser, req.body.password, (err, user) => {
        if(err) {
            req.flash("error", err.message);
            return res.render("register");
        } else {
            passport.authenticate("local")(req, res, () => {
                req.flash("success", `Welcome to YelpCamp ${user.username}`);
                res.redirect("/campgrounds");
            });
        }
    });
});

router.get("/login", (req, res) => {
    res.render("login");
});


router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), () => {

});

// Logout route
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

module.exports = router;
