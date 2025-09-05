# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a multi-channel customer service bot that integrates SMS, WhatsApp, and Rasa chatbot capabilities using the Vonage Messages API. The system consists of a Node.js/Express backend with MongoDB for data persistence and a separate Rasa chatbot component.

## Common Development Commands

### Node.js Backend
```bash
# Install dependencies
npm install

# Start the webhook server (default port 3000)
node server.js

# No tests are currently configured
npm test  # Will show error message
```

### Rasa Chatbot
```bash
# Navigate to Rasa directory
cd "rasa_customer_care chatbot"

# Install Rasa dependencies
pip install -r requirements.txt

# Train the Rasa model
rasa train

# Run Rasa server
rasa run

# Run Rasa actions server (if needed)
rasa run actions

# Interactive training mode
rasa interactive

# Shell mode for testing
rasa shell
```

### Database Operations
```bash
# MongoDB connection required via MONGOURL environment variable
# No specific database commands - handled through Mongoose models
```

## Architecture Overview

### Multi-Channel Messaging System
The system is built around a webhook-based architecture that handles multiple messaging channels through the Vonage Messages API:

- **SMS Channel**: Direct SMS messaging via `SMS/send-sms.js`
- **WhatsApp Channel**: WhatsApp messaging via `Whatsapp/send-text-msg.js`
- **Webhook Server**: Central `server.js` handles inbound messages and status updates

### Core Components

#### Message Handlers
- `SMS/send-sms.js` - SMS message sending functionality
- `Whatsapp/send-text-msg.js` - WhatsApp message sending (nearly identical to SMS but uses WhatsApp channel)
- Both use shared Vonage initialization pattern and support environment variable or file-based private key authentication

#### Controllers
- `controller/SMS_controller.js` - Handles SMS data persistence to MongoDB
- `controller/SMS_user_controller.js` - Manages SMS user registration

#### Data Models
- `models/sms.js` - SMS message schema with message_uuid, from, to, timestamp, and text fields
- `models/sms_user.js` - SMS user schema (note: has schema definition issues)
- All models use Mongoose for MongoDB ODM

#### Database
- `database/db.js` - MongoDB connection handler using Mongoose
- Requires `MONGOURL` environment variable

#### Webhook System
- `server.js` - Express server with two main webhook endpoints:
  - `/webhooks/inbound-message` - Receives incoming messages from Vonage
  - `/webhooks/message-status` - Handles message status updates
- Saves all webhook data to `webhook_data.json` with timestamps

#### Rasa Integration
- `rasa_customer_care chatbot/` - Standalone Rasa chatbot component
- Basic configuration with default intents (greet, goodbye, mood tracking, etc.)
- Uses default Rasa pipeline and policies
- Separate from the main Node.js application

### Integration Patterns

#### Vonage Messages API
Both SMS and WhatsApp handlers follow the same pattern:
1. Initialize Vonage client with application ID and private key
2. Support dual authentication modes (environment variable or file path)
3. Send messages through unified Messages API with channel-specific configuration
4. Return message UUID for tracking

#### Environment Configuration
Required environment variables:
- `VONAGE_APPLICATION_ID` - Vonage application identifier
- `VONAGE_PRIVATE_KEY` or `VONAGE_APPLICATION_PRIVATE_KEY_PATH` - Authentication
- `MESSAGES_TO_NUMBER` - Default recipient number
- `SMS_SENDER_ID` - Default sender ID
- `MONGOURL` - MongoDB connection string

#### Data Flow
1. Webhooks receive inbound messages → logged and saved to JSON
2. SMS/WhatsApp handlers send outbound messages → return UUIDs
3. Controllers persist message data → MongoDB via Mongoose
4. Rasa chatbot operates independently (not integrated with main flow)

### API Schema
The `message_json_format/messages.json` contains the complete OpenAPI 3.0 specification for the Vonage Messages API, supporting all message types across SMS, MMS, RCS, WhatsApp, Messenger, and Viber channels.

## Key Notes

- The Rasa chatbot is currently standalone and not integrated with the webhook system
- Both SMS and WhatsApp message handlers are nearly identical except for channel specification
- Error handling is basic across most components
- The SMS user model has schema definition issues that should be addressed
- No formal testing framework is currently in place
- Webhook data is stored in JSON files, not the database
