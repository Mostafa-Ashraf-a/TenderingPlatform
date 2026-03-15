/**
 * twilio-config.js
 * Project: TenderingPlatform
 * Description: Twilio API Configuration for SMS notifications.
 */

const twilioConfig = {
    accountSid: "AC0c7c61d5afeaf771b47f0f293b396ce6",
    
    // [IMPORTANT] REPLACE WITH YOUR TWILIO AUTH TOKEN
    // WARNING: Storing secrets in frontend JS is insecure. 
    // Recommended: Use a backend or Firebase Cloud Function.
    authToken: "YOUR_AUTH_TOKEN_HERE", 
    
    // [IMPORTANT] REPLACE WITH YOUR TWILIO PHONE NUMBER (Trial or Paid)
    // Example: "+1234567890"
    fromNumber: "YOUR_TWILIO_PHONE_NUMBER",
};

// Export to global scope
window.twilioConfig = twilioConfig;

console.log("Twilio configuration loaded. (Remember to set AuthToken and FromNumber)");
