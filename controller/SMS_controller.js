const SMS = require("../models/sms");

const addSMStoDB = async (req, type) => {
    try {
        // const newSMSData = req.body;
        const newSMSData = {
            message_uuid : req.body.message_uuid,
            from : req.body.from,
            to : req.body.to,
            timestamp : req.body.timestamp,
            text : req.body.text,
            type: type,
        }
        const newlyCreatedSMSData = await SMS.create(newSMSData);
        console.log(newlyCreatedSMSData);        
        // if (newSMSData) {
        //     res.status(201).json({
        //         success: true,
        //         message: "SMS added successfully",
        //         data: newlyCreatedSMSData,
        //     });
        // }
    } catch (error) {
        console.log(error);
        // res.status(500).json({
        // success: false,
        // message: "Something went wrong! Please try again",
        // });
    }
}

module.exports = {
    addSMStoDB
}