const schedule = require("node-schedule");
const Task = require("./models/task");
const nodemailer = require("nodemailer");
const sendWhatsAppReminder = require("./sendWhatsappReminder");
require("dotenv").config(); 


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


const sendEmailReminder = async (task) => {
  try {
    if (!task.userEmail) {
      console.warn(`⚠️ No email found for task "${task.title}". Skipping.`);
      await task.remove(); 
      return;
    }

    console.log(`📤 Sending email to ${task.userEmail} for task "${task.title}"`);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: task.userEmail,
      subject: "Task Reminder",
      text: `⏰ Hey! This is a reminder for your task: "${task.title}". Don't forget to complete it!`,
    });

    console.log(`✅ Email sent to ${task.userEmail} for task: "${task.title}"`);
  } catch (error) {
    console.error(`❌ Failed to send email for task "${task.title}":`, error.message);
  }
};


schedule.scheduleJob("* * * * *", async () => {
  const now = new Date();
  console.log("🕒 Checking for upcoming task reminders...");

  try {
    const tasks = await Task.find({
      reminderTime: {
        $lte: new Date(Date.now() + 1000 * 60),   
        $gte: new Date(Date.now() - 1000 * 60),   
      },      
      completed: false,
      reminderSent: { $ne: true },
    });

    console.log("📋 Tasks found for reminder:", tasks.map(t => ({
      title: t.title,
      reminderTime: t.reminderTime,
      reminderType: t.reminderType,
      phone: t.userPhoneNumber
    })));

    if (tasks.length === 0) {
      console.log("🔍 No pending reminders found.");
    }

    for (const task of tasks) {
      const message = `⏰ Reminder: ${task.title} is due now!`;

      if (task.reminderType === "email") {
        await sendEmailReminder(task);

      } else if (task.reminderType === "whatsapp") {
        if (task.userPhoneNumber) {
          await sendWhatsAppReminder(task.userPhoneNumber, message);
        } else {
          console.warn(`⚠️ No phone number for WhatsApp reminder: "${task.title}"`);
        }

      } else if (task.reminderType === "site") {
        console.log(`🔔 Site Notification for task: "${task.title}"`);
        
      } else {
        console.log(`⚠️ No reminder method set for task: "${task.title}"`);
      }

      task.reminderSent = true;
      await task.save();
    }
  } catch (error) {
    console.error("❌ Reminder scheduler error:", error.message);
  }
});



module.exports = {};
