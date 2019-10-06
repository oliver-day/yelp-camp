const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const User = require("./models/user");
const seedDB = require('./seeds');

require('dotenv').config();
const port = process.env.PORT;

// Requiring routes
const campgroundRoutes = require('./routes/campgrounds');
const commentRoutes = require('./routes/comments');
const indexRoutes = require('./routes/index');


// CONFIGURATION

// Local DB
// mongoose.connect("mongodb://localhost:27017/yelp_camp", 
//     {useNewUrlParser: true,
//      useUnifiedTopology: true
// });

// Production DB
const uri = `${process.env.DB_HOST_PROD}${process.env.DB_USER_PROD}${process.env.DB_PASSWORD_PROD}${process.env.DB_NAME_PROD}`;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});



app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// seed the database
// seedDB();

// PASSPORT CONFIGURATION
app.use(require('express-session')({
    secret: "Oliver is the best",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Include this middleware to ensure that each
// template receives the current user
// and set next() to ensure the next() middleware is moved to
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", indexRoutes);


app.listen(port, () => {console.log(`Listening on port ${port}`)});
