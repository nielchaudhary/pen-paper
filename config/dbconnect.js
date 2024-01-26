const mongoose = require("mongoose");
require("dotenv").config();

const mongoURI = process.env.MONGODB_URI;

const dbConnect = async () => {
    try {
        const conn = await mongoose.connect(mongoURI);
        console.log("Database connected");
        return conn;
    } catch (err) {
        console.error(err, "error connecting database");
        throw err;
    }
};

module.exports = dbConnect;
