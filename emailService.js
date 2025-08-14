const cron = require('node-cron');
const nodemailer = require('nodemailer');
const moment = require('moment-timezone');
const { getActiveUsers } = require('./user');
const { 
  DAILY_SCHEDULE, 
  GROCERY_LIST, 
  generateDailyReminderHTML, 
  generateGroceryListHTML, 
  generateWelcomeEmailHTML 
} = require('./templates');

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send individual daily reminder email
const sendDailyReminderEmail = async (user, reminder) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL || process.env.EMAIL_USER,
    to: user.email,
    subject: `${reminder.emoji} ${reminder.title}`,
    html: generateDailyReminderHTML(user, reminder)
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Daily reminder email sent to ${user.email} for ${reminder.title} at ${reminder.time}`);
    return true;
  } catch (error) {
    console.error(`❌ Error sending daily reminder email to ${user.email}:`, error.message);
    return false;
  }
};

// Send grocery list reminder email
const sendGroceryListEmail = async (user) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL || process.env.EMAIL_USER,
    to: user.email,
    subject: `${GROCERY_LIST.emoji} ${GROCERY_LIST.title}`,
    html: generateGroceryListHTML(user)
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Grocery list email sent to ${user.email}`);
    return true;
  } catch (error) {
    console.error(`❌ Error sending grocery list email to ${user.email}:`, error.message);
    return false;
  }
};

// Send welcome email
const sendWelcomeEmail = async (user) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL || process.env.EMAIL_USER,
    to: user.email,
    subject: '🌸 Welcome to Your Daily Wellness Journey!',
    html: generateWelcomeEmailHTML(user)
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✨ Welcome email sent successfully to ${user.email}`);
    return true;
  } catch (error) {
    console.error(`❌ Error sending welcome email to ${user.email}:`, error.message);
    return false;
  }
};

// Schedule individual daily reminder
const scheduleDailyReminder = (reminder) => {
  const [hour, minute] = reminder.time.split(':').map(num => parseInt(num, 10));
  const cronExpression = `0 ${minute} ${hour} * * *`;

  console.log(`🔔 [${new Date().toISOString()}] Scheduling "${reminder.title}" for ${hour}:${minute.toString().padStart(2, '0')} IST`);

  cron.schedule(cronExpression, async () => {
    try {
      const now = moment().tz('Asia/Kolkata');
      console.log(`\n⏰ [${now.format()}] Checking schedule for ${reminder.title}`);
      
      const scheduledTime = moment().tz('Asia/Kolkata').hour(hour).minute(minute).second(0);
      const timeDiff = Math.abs(now.diff(scheduledTime, 'minutes'));
      
      console.log(`📊 Time difference: ${timeDiff} minutes`);
      
      if (timeDiff <= 1) {
        const activeUsers = await getActiveUsers();
        console.log(`\n📬 Processing ${reminder.time} reminder for ${activeUsers.length} active users`);
        
        for (const user of activeUsers) {
          if (user.pause_until && new Date(user.pause_until) > new Date()) {
            console.log(`⏸️ Skipping paused user: ${user.email} (paused until ${user.pause_until})`);
            continue;
          }
          await sendDailyReminderEmail(user, reminder);
        }
      } else {
        console.log(`⏭️ [${now.format()}] Skipping - Outside time window (diff: ${timeDiff}min)`);
      }
    } catch (error) {
      console.error(`❌ [${new Date().toISOString()}] Error:`, error.message);
    }
  }, {
    timezone: 'Asia/Kolkata',
    scheduled: true,
    runOnInit: false
  });
};

// Schedule grocery list reminder (every 2 days at 11:00 AM IST)
const scheduleGroceryListReminder = () => {
  console.log('🛒 Scheduling grocery list reminder for every 2 days at 11:00 AM IST');

  cron.schedule('0 11 */2 * *', async () => {
    try {
      const activeUsers = await getActiveUsers();
      console.log(`\n🛒 Processing grocery list reminder for ${activeUsers.length} active users`);
      
      for (const user of activeUsers) {
        if (user.pause_until && new Date(user.pause_until) > new Date()) {
          console.log(`⏸️ Skipping paused user: ${user.email} (paused until ${user.pause_until})`);
          continue;
        }
        await sendGroceryListEmail(user);
      }
    } catch (error) {
      console.error('❌ Error in grocery list reminder schedule:', error.message);
    }
  }, {
    timezone: 'Asia/Kolkata',
    scheduled: true,
    runOnInit: false
  });
};

// Initialize scheduler with all reminders
const initializeScheduler = () => {
  // Validate all reminder times
  DAILY_SCHEDULE.forEach(reminder => {
    const [hour, minute] = reminder.time.split(':').map(num => parseInt(num, 10));
    if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      throw new Error(`Invalid time format in reminder: ${reminder.time}`);
    }
  });

  console.log('🕒 Initializing scheduler with the following daily reminders:');
  DAILY_SCHEDULE.forEach(r => {
    console.log(`   ${r.emoji} ${r.time} - ${r.title}`);
    scheduleDailyReminder(r);
  });
  
  // Schedule grocery list reminder
  scheduleGroceryListReminder();
  
  console.log('✅ All reminders scheduled successfully in IST timezone');
  console.log('🛒 Grocery list reminder scheduled every 2 days at 11:00 AM IST');
};

// Test email connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email configuration error:', error.message);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

module.exports = {
  initializeScheduler,
  sendDailyReminderEmail,
  sendGroceryListEmail,
  sendWelcomeEmail
};
