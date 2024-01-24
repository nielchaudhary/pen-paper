const mongoose = require("mongoose");

const dbConnect = () => {
    try {
        const conn = mongoose.connect("mongodb://localhost:27017/BlogWebsite",{
        });
        console.log("Blogwebsite Database connected");
    } catch (err) {
        console.log(err, "error connecting database");
    }
};


module.exports = dbConnect