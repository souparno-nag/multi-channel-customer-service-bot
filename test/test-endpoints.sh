#!/bin/bash

echo "🧪 Testing SMS Bot Endpoints"
echo "=============================="

# Test the main webhook endpoint (simulates incoming SMS)
echo ""
echo "1. Testing inbound SMS webhook..."
curl -X POST http://localhost:3000/webhooks/inbound-message \
  -H "Content-Type: application/json" \
  -d '{
    "message_uuid": "test-uuid-123",
    "from": "1234567890",
    "to": "0987654321",
    "channel": "sms",
    "message_type": "text",
    "text": "hello",
    "timestamp": "2025-01-09T12:00:00.000Z"
  }'

echo ""
echo ""

# Test the manual SMS sending endpoint
echo "2. Testing manual SMS sending..."
echo "   (Make sure to update the phone number in the JSON)"
curl -X POST http://localhost:3000/send-sms \
  -H "Content-Type: application/json" \
  -d '{
    "text": "This is a test message from the SMS bot!",
    "to": "+1234567890",
    "from": "YourSenderID"
  }'

echo ""
echo ""
echo "✅ Tests completed!"
echo ""
echo "📝 Notes:"
echo "- Make sure your server is running (node server.js)"
echo "- Update phone numbers and sender ID in the test JSON"
echo "- Check the server console for detailed logs"
