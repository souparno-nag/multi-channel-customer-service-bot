const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const connectToDB = require("./database/db");
const addSMStoDB = require('./controller/SMS_controller');
const addSMSUser = require('./controller/SMS_user_controller')

const PORT = 3000;
const DATA_FILE = 'webhook_data.json';

// Middleware to parse JSON bodies from Vonage
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// connect to database
connectToDB();

const saveWebhookPayload = (type, req) => {
    // Read the existing data from the file. If the file doesn't exist,
    // we'll start with an empty array.
    // let data = [];
    // try {
    //     const fileContent = fs.readFileSync(DATA_FILE, 'utf8');
    //     data = JSON.parse(fileContent);
    // } catch (err) {
    //     // Log a message if the file doesn't exist, but don't exit.
    //     // We will create it on the first successful webhook receipt.
    //     if (err.code === 'ENOENT') {
    //         console.log(`- Data file '${DATA_FILE}' not found. A new file will be created.`);
    //     } else {
    //         console.error('Error reading data file:', err);
    //     }
    // }

    // // Create an object to store the webhook data, including a timestamp.
    // const newEntry = {
    //     timestamp: new Date().toISOString(),
    //     type: type,
    //     payload: payload,
    // };

    // // Add the new entry to the data array.
    // data.push(newEntry);

    // // Write the entire updated array back to the file.
    // // We use JSON.stringify to format the data with nice indentation (2 spaces).
    // fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8', (err) => {
    //     if (err) {
    //         console.error('Error writing to data file:', err);
    //     } else {
    //         console.log(`- Webhook payload successfully saved to ${DATA_FILE}.`);
    //     }
    // });
    if (req.body.channel == 'SMS') {
        addSMStoDB(req, type);
        addSMSUser(req, type);
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

// Start the server
app.listen(PORT, () => {
    console.log(`Webhook server listening at http://localhost:${PORT}`);
});