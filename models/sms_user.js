const mongoose = require("mongoose");

const SMSUserSchema = {
    phone_number : {
        type: String,
        required: true,
        trim: true,
    } ,
    type : {
        type : String,
    }
};

module.exports = mongoose.model("SMS_user", SMSUserSchema);