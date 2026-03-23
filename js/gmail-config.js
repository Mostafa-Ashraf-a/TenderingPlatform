/**
 * gmail-config.js
 * Project: TenderingPlatform
 * Description: EmailJS Configuration for Gmail notifications.
 */

const gmailConfig = {
    // [IMPORTANT] Replace with your actual EmailJS credentials
    serviceId: "service_ow4ngnk", // Example: "service_gmail_tender"
    templateId: "template_qzgkg59", // Example: "template_new_deal"
    publicKey: "WDg3LTC_CmTB-sb8x", // Example: "user_xxxxxx"

    // Default subject/body (if not using EmailJS templates or for reference)
    emailTemplate: {
        subject: "تنبيه صفقة جديدة: {title}",
        body: "أهلاً {company_name}، تم طرح صفقة جديدة في مجال ({category}) بعنوان: {title}. يمكنك العثور على التفاصيل هنا: {link}"
    }
};

// Export to global scope
window.gmailConfig = gmailConfig;

console.log("Gmail configuration loaded. (Please set ServiceID, TemplateID and PublicKey)");
