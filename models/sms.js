const mongoose = require("mongoose");

const SMSSchema = new mongoose.Schema({
    message_uuid : {
        type: String,
        required: true,
        trim: true,
    } , 
    from : {
        type: String,
        required: true,
        trim: true,
    } , 
    to : {
        type: String,
        required: true,
        trim: true,
    } , 
    timestamp : {
        type : String,
    } , 
    text : {
        type : String,
        trim: true,
    } ,
    type : {
        type : String,
    }
});

module.exports = mongoose.model("SMS", SMSSchema);