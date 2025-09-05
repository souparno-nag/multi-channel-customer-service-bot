const SMS_user = require("../models/sms_user");

const addSMSUser = async (req, type) => {
    try {
        const newSMSUser = {
            phone_number: req.body.from || req.body.phone,
            type: type,
        }
        const newlyCreatedSMSUser = await SMS_user.create(newSMSUser);
        console.log('SMS User saved:', newlyCreatedSMSUser);
        return newlyCreatedSMSUser;
    } catch (error) {
        console.log('Error saving SMS user:', error);
        // Don't throw error, just log it since this is called from webhook
    }
}

module.exports = {
    addSMSUser
}
