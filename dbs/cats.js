const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/cat_app");

let catSchema = new mongoose.Schema({
    name: String,
    age: Number,
    temperament: String
});

let Cat = mongoose.model("Cat", catSchema);

// let george = new Cat({
//     name: "George",
//     age: 11,
//     temperament: "Grouchy"
// });

// george.save((err, cat) => {
//     if(err) {
//         console.log("Something went wrong");
//     } else {
//         console.log("We just saved a cat to the database");
//         console.log(cat);
//     }
// });

Cat.create({
    name: "Snow White",
    age: 15,
    temperament: "Nice"
}, (err, cat) => {
    if(err) {
        console.log("An error has occured with create");
    } else {
        console.log("Added a new cat");
        console.log(cat);
    }
});

Cat.find({}, (err, cats) => {
    if(err) {
        console.log("Error");
        console.log(err);
    } else {
        console.log(cats);
    }
});
