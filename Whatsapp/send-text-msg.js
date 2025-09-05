require('dotenv').config();
const fs = require('fs/promises');
const { Vonage } = require('@vonage/server-sdk');
const { Channels } = require('@vonage/messages');

const VONAGE_APPLICATION_ID = process.env.VONAGE_APPLICATION_ID;
const keyPath = process.env.VONAGE_APPLICATION_PRIVATE_KEY_PATH;
const VONAGE_PRIVATE_KEY_ENV = process.env.VONAGE_PRIVATE_KEY;

async function initializeVonage() {
  if (!VONAGE_APPLICATION_ID) {
    throw new Error('VONAGE_APPLICATION_ID is missing in your .env file.');
  }

  let privateKey;
  if (VONAGE_PRIVATE_KEY_ENV) {
    privateKey = VONAGE_PRIVATE_KEY_ENV;
  } else if (keyPath) {
    try {
      privateKey = await fs.readFile(keyPath, 'utf8');
    } catch (error) {
      throw new Error(`Failed to read private key from path: ${keyPath}. Error: ${error.message}`);
    }
  } else {
    throw new Error('No Vonage private key provided. Set VONAGE_PRIVATE_KEY or VONAGE_APPLICATION_PRIVATE_KEY_PATH.');
  }

  return new Vonage({
    applicationId: VONAGE_APPLICATION_ID,
    privateKey: privateKey,
  });
}

const sendMessage = async (text, to_number, from_number) => {
  const vonage = await initializeVonage();

  const recipient = to_number || process.env.MESSAGES_TO_NUMBER;
  const sender = from_number || process.env.SMS_SENDER_ID;

  if (!recipient || !sender) {
    throw new Error('Missing recipient or sender number. Please provide them or set MESSAGES_TO_NUMBER and SMS_SENDER_ID in your .env file.');
  }

  try {
    const { messageUUID } = await vonage.messages.send({
      messageType: 'sms',
      channel: Channels.WHATSAPP,
      text: text,
      to: recipient,
      from: sender,
    });
    console.log('Message sent, UUID:', messageUUID);
    return messageUUID;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
};

module.exports = sendMessage;