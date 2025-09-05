const sendMessage = require('../SMS/send-sms');

async function testSMSIntegration() {
    console.log('🧪 Testing SMS Integration...\n');
    
    // Test sending a basic message
    try {
        console.log('📱 Sending test SMS...');
        const messageUUID = await sendMessage(
            'Hello! This is a test message from your SMS bot system.',
            process.env.TEST_PHONE_NUMBER, // Add this to your .env file
            process.env.SMS_SENDER_ID
        );
        
        console.log('✅ SMS sent successfully!');
        console.log('📧 Message UUID:', messageUUID);
        console.log('\n🎯 Now send a message to your Vonage number to test the webhook integration!');
        console.log('Try sending: "hello", "help", or "hours" to test different responses.\n');
        
    } catch (error) {
        console.error('❌ Error sending test SMS:', error.message);
        console.log('\n🔧 Make sure your .env file has:');
        console.log('- VONAGE_APPLICATION_ID');
        console.log('- VONAGE_PRIVATE_KEY or VONAGE_APPLICATION_PRIVATE_KEY_PATH');
        console.log('- SMS_SENDER_ID');
        console.log('- TEST_PHONE_NUMBER (your phone number for testing)\n');
    }
}

// Run the test
testSMSIntegration();
