const twilio = require("twilio");
const dotenv = require("dotenv");
dotenv.config();

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromWhatsApp = "whatsapp:+14155238886"; // Twilio sandbox number

const client = new twilio(accountSid, authToken);

const sendWhatsAppReminder = async (toNumber, message) => {
  try {
    const response = await client.messages.create({
      body: message,
      from: fromWhatsApp,
      to: `whatsapp:${toNumber}`,
    });
    console.log("✅ WhatsApp Reminder Sent:", response.sid);
  } catch (error) {
    console.error("❌ WhatsApp Reminder Error:", error);
  }
};

module.exports = sendWhatsAppReminder;