require('dotenv').config();

const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const connectToDB = require("./database/db");
const { addSMStoDB } = require('./controller/SMS_controller');
const { addSMSUser } = require('./controller/SMS_user_controller');
const sendMessage = require('./SMS/send-sms');

const PORT = 3000;
const DATA_FILE = 'webhook_data.json';

// Middleware to parse JSON bodies from Vonage
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// connect to database
connectToDB();

// Simple bot response logic
const generateBotResponse = (incomingMessage) => {
    const message = incomingMessage.toLowerCase().trim();
    
    // Basic keyword-based responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return "Hello! Welcome to our customer service. How can I help you today?";
    } else if (message.includes('help') || message.includes('support')) {
        return "I'm here to help! You can ask me about our services, hours, or general information. What would you like to know?";
    } else if (message.includes('hours') || message.includes('time')) {
        return "Our customer service is available 24/7. How can I assist you?";
    } else if (message.includes('bye') || message.includes('goodbye') || message.includes('thanks')) {
        return "Thank you for contacting us! Have a great day!";
    } else if (message.includes('price') || message.includes('cost')) {
        return "For pricing information, please visit our website or speak with one of our representatives. Is there anything specific you'd like to know?";
    } else {
        return "Thanks for your message! I understand you said: '" + incomingMessage + "'. Our team will get back to you soon. For immediate assistance, please call our support line.";
    }
};

const saveWebhookPayload = async (type, req) => {
    try {
        if (req.body.channel === 'sms' && type === 'inbound_message') {
            // Save incoming SMS to database
            await addSMStoDB(req, type);
            await addSMSUser(req, type);
            
            // Generate and send automatic response
            if (req.body.text) {
                const responseText = generateBotResponse(req.body.text);
                
                // Send automatic response
                try {
                    const messageUUID = await sendMessage(
                        responseText,
                        req.body.from,  // Reply to sender
                        req.body.to     // From the original recipient (our number)
                    );
                    
                    console.log(`✅ Auto-response sent to ${req.body.from}: "${responseText}"`);
                    console.log(`📧 Message UUID: ${messageUUID}`);
                    
                    // Optionally save the outbound response to database too
                    const outboundReq = {
                        body: {
                            message_uuid: messageUUID,
                            from: req.body.to,
                            to: req.body.from,
                            timestamp: new Date().toISOString(),
                            text: responseText,
                            channel: 'sms'
                        }
                    };
                    await addSMStoDB(outboundReq, 'outbound_response');
                    
                } catch (sendError) {
                    console.error('❌ Error sending SMS response:', sendError);
                }
            }
        }
    } catch (error) {
        console.error('❌ Error processing webhook:', error);
    }
};

app.get('/', (req, res) => {
  res.send('Webhook server is running. It will save incoming data to ' + DATA_FILE);
});

// Route for inbound messages
app.post('/webhooks/inbound-message', (req, res) => {
    console.log('INBOUND MESSAGE RECEIVED:');
    console.log(req.body); // This will print the message details to your terminal
    // Call our helper function to save the payload to the JSON file.
    saveWebhookPayload('inbound_message', req);
    res.status(200).send('OK'); // Always acknowledge receipt with a 200 OK
});

// Route for message status updates
app.post('/webhooks/message-status', (req, res) => {
    console.log('MESSAGE STATUS UPDATE RECEIVED:');
    console.log(req.body); // This will print the status update to your terminal
    // Call our helper function to save the payload to the JSON file.
    saveWebhookPayload('message_status', req);
    res.status(200).send('OK');
});

// Manual SMS sending endpoint for testing
app.post('/send-sms', async (req, res) => {
    try {
        const { text, to, from } = req.body;
        
        if (!text || !to) {
            return res.status(400).json({
                success: false,
                message: 'Text and to number are required'
            });
        }
        
        const messageUUID = await sendMessage(text, to, from);
        
        res.status(200).json({
            success: true,
            message: 'SMS sent successfully',
            messageUUID: messageUUID
        });
    } catch (error) {
        console.error('Error sending manual SMS:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send SMS',
            error: error.message
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Webhook server listening at http://localhost:${PORT}`);
});