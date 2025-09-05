// connect to the database
const mongoose = require("mongoose");
const connectToDB = async() => {
    try {
        await mongoose.connect(process.env.MONGOURL);
        console.log("MongoDB is connected successfully");        
    } catch(error) {
        console.log("MongoDB connection failed",error);
        process.exit(1);        
    }
}

module.exports = connectToDB;