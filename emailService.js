const cron = require('node-cron');
const nodemailer = require('nodemailer');
const moment = require('moment-timezone');
const { getActiveUsers } = require('./user');
const { getRandomQuote } = require('./quoteService');

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const reminders = [
  { time: '10:30', message: 'Wake up + hydrate with lemon water', emoji: '🕙' },
  { time: '11:00', message: 'Light yoga + breathing', emoji: '🧘' },
  { time: '11:30', message: 'Breakfast reminder + hormone-friendly food suggestions', emoji: '🍳' },
  { time: '13:00', message: 'Lunch reminder', emoji: '🍲' },
  { time: '17:00', message: 'Healthy snack (dry fruits + banana + herbal tea)', emoji: '🍎' },
  { time: '23:30', message: 'Light dinner + turmeric milk reminder', emoji: '🍛' },
  { time: '02:00', message: 'Sleep reminder + warm words', emoji: '🌙' }
];

const generateWelcomeEmailHTML = (user) => {
  const quote = getRandomQuote();
  const greeting = user.name ? `Hi, ${user.name} ❤️` : 'Hi, Love ❤️';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Your Wellness Journey</title>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500&display=swap" rel="stylesheet">
    </head>
    <body style="
      font-family: 'Poppins', sans-serif;
      line-height: 1.6;
      color: #4a4a4a;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #fff5f5;">
      
      <div style="
        background-color: white;
        border-radius: 15px;
        padding: 30px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <div style="
          font-size: 24px;
          color: #ff6b6b;
          margin-bottom: 20px;">
          ${greeting}
        </div>
        
        <div style="
          font-size: 18px;
          color: #2d3436;
          margin: 20px 0;
          padding: 15px;
          background-color: #fff0f0;
          border-radius: 10px;">
          🌸 Welcome to Your Daily Wellness Journey! 
          
          <p style="margin-top: 15px;">I'm so happy you're here. From now on, I'll be sending you loving reminders throughout the day to help you take care of yourself.</p>
          
          <p>Here's what you can expect:</p>
          <ul style="list-style-type: none; padding-left: 0;">
            ${reminders.map(r => `<li style="margin: 10px 0;">${r.emoji} ${r.time} - ${r.message}</li>`).join('')}
          </ul>
        </div>
        
        <div style="
          font-style: italic;
          color: #636e72;
          margin: 20px 0;
          padding: 15px;
          border-left: 4px solid #ff6b6b;">
          "Starting today, I'll be here to remind you how special and loved you are. Here's your first quote:"
          <br><br>
          "${quote}"
        </div>
        
        <div style="
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ffd3d3;
          color: #ff6b6b;">
          You're not alone. You're deeply loved — from your person 💌
          
          <p style="
            font-size: 14px;
            color: #888;
            margin-top: 15px;">
            P.S. Your first scheduled reminder will arrive soon. Keep an eye on your inbox! 💕
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generateEmailHTML = (user, reminder) => {
  const quote = getRandomQuote();
  const greeting = user.name ? `Hi, ${user.name} ❤️` : 'Hi, Love ❤️';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Wellness Reminder</title>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500&display=swap" rel="stylesheet">
    </head>
    <body style="
      font-family: 'Poppins', sans-serif;
      line-height: 1.6;
      color: #4a4a4a;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #fff5f5;">
      
      <div style="
        background-color: white;
        border-radius: 15px;
        padding: 30px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <div style="
          font-size: 24px;
          color: #ff6b6b;
          margin-bottom: 20px;">
          ${greeting}
        </div>
        
        <div style="
          font-size: 18px;
          color: #2d3436;
          margin: 20px 0;
          padding: 15px;
          background-color: #fff0f0;
          border-radius: 10px;">
          ${reminder.emoji} ${reminder.message}
        </div>
        
        <div style="
          font-style: italic;
          color: #636e72;
          margin: 20px 0;
          padding: 15px;
          border-left: 4px solid #ff6b6b;">
          "${quote}"
        </div>
        
        <div style="
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ffd3d3;
          color: #ff6b6b;">
          You're not alone. You're deeply loved — from your person 💌
        </div>
      </div>
    </body>
    </html>
  `;
};

const sendWelcomeEmail = async (user) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
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

const sendEmail = async (user, reminder) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: user.email,
    subject: `${reminder.emoji} Wellness Reminder: ${reminder.message}`,
    html: generateEmailHTML(user, reminder)
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${user.email} for ${reminder.time}`);
  } catch (error) {
    console.error(`❌ Error sending email to ${user.email}:`, error.message);
  }
};

const scheduleReminder = (reminder) => {
  const [hour, minute] = reminder.time.split(':');
  const cronExpression = `${minute} ${hour} * * *`;

  cron.schedule(cronExpression, async () => {
    try {
      const activeUsers = await getActiveUsers();
      console.log(`\n📬 Processing ${reminder.time} reminder for ${activeUsers.length} active users`);
      
      for (const user of activeUsers) {
        if (user.pause_until && new Date(user.pause_until) > new Date()) {
          console.log(`⏸️ Skipping paused user: ${user.email} (paused until ${user.pause_until})`);
          continue;
        }
        await sendEmail(user, reminder);
      }
    } catch (error) {
      console.error('❌ Error in reminder schedule:', error.message);
    }
  }, {
    timezone: 'Asia/Kolkata'
  });
};

const initializeScheduler = () => {
  reminders.forEach(scheduleReminder);
  console.log('🚀 Email scheduler initialized with the following reminders:');
  reminders.forEach(r => console.log(`   ${r.emoji} ${r.time} - ${r.message}`));
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
  sendEmail,
  sendWelcomeEmail
};
