const SMS_user = require("../models/sms_user");

const addSMSUser = async (req, type) => {
    const newSMSUser = {
        phone: req.body.phone,
        type: type,
    }
    const newlyCreatedSMSUser = await SMS_user.create(newSMSUser);
    try {
        if (newSMSUser) {
            res.status(201).json({
                success: true,
                message: "SMS User added successfully",
                data: newlyCreatedSMSUser,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
        success: false,
        message: "Something went wrong! Please try again",
        });
    }
}

module.exports = [
    addSMSUser
]