require('dotenv').config();

console.log('🔍 Vonage Configuration Debug\n');

// Check environment variables
console.log('Environment Variables:');
console.log('- VONAGE_APPLICATION_ID:', process.env.VONAGE_APPLICATION_ID ? 'SET ✅' : 'MISSING ❌');
console.log('- VONAGE_PRIVATE_KEY:', process.env.VONAGE_PRIVATE_KEY ? 'SET ✅' : 'MISSING ❌');
console.log('- VONAGE_APPLICATION_PRIVATE_KEY_PATH:', process.env.VONAGE_APPLICATION_PRIVATE_KEY_PATH ? 'SET ✅' : 'MISSING ❌');

if (process.env.VONAGE_PRIVATE_KEY) {
    console.log('\n🔑 Private Key Analysis:');
    const key = process.env.VONAGE_PRIVATE_KEY;
    console.log('- Length:', key.length, 'characters');
    console.log('- Starts with:', key.substring(0, 30) + '...');
    console.log('- Contains BEGIN:', key.includes('-----BEGIN') ? 'YES ✅' : 'NO ❌');
    console.log('- Contains END:', key.includes('-----END') ? 'YES ✅' : 'NO ❌');
    console.log('- Contains PRIVATE KEY:', key.includes('PRIVATE KEY') ? 'YES ✅' : 'NO ❌');
}

if (process.env.VONAGE_APPLICATION_PRIVATE_KEY_PATH) {
    console.log('\n📁 Private Key File Analysis:');
    const fs = require('fs');
    const keyPath = process.env.VONAGE_APPLICATION_PRIVATE_KEY_PATH;
    console.log('- Path:', keyPath);
    try {
        const stats = fs.statSync(keyPath);
        console.log('- File exists: YES ✅');
        console.log('- File size:', stats.size, 'bytes');
        
        const keyContent = fs.readFileSync(keyPath, 'utf8');
        console.log('- Contains BEGIN:', keyContent.includes('-----BEGIN') ? 'YES ✅' : 'NO ❌');
        console.log('- Contains END:', keyContent.includes('-----END') ? 'YES ✅' : 'NO ❌');
        console.log('- Contains PRIVATE KEY:', keyContent.includes('PRIVATE KEY') ? 'YES ✅' : 'NO ❌');
    } catch (error) {
        console.log('- File exists: NO ❌');
        console.log('- Error:', error.message);
    }
}

console.log('\n📋 Recommendations:');
console.log('1. Make sure your private key is in proper PEM format');
console.log('2. Key should start with -----BEGIN PRIVATE KEY----- or -----BEGIN RSA PRIVATE KEY-----');
console.log('3. Key should end with -----END PRIVATE KEY----- or -----END RSA PRIVATE KEY-----');
console.log('4. If using environment variable, make sure newlines are preserved');
console.log('5. Consider using VONAGE_APPLICATION_PRIVATE_KEY_PATH instead for easier management');
