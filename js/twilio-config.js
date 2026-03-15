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
    authToken: "5ead5162aea8f248188af0220afb62d8",

    // [IMPORTANT] REPLACE WITH YOUR TWILIO PHONE NUMBER (Trial or Paid)
    // example: "+13502461011"
    fromNumber: "+13502461011",

    // SMS Message Template
    // Supports variables: {title}, {category}, {link}
    smsTemplate: "تنبيه من منصة الصفقات: تم نشر صفقة جديدة بعنوان ({title}) في مجال ({category}). يمكنك مشاهدة التفاصيل والمزايدة عبر هذا الرابط: {link}",
};

// Export to global scope
window.twilioConfig = twilioConfig;

console.log("Twilio configuration loaded. (Remember to set AuthToken and FromNumber)");
