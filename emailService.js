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
  {
    time: '10:30',
    message: 'Wake Up + Hydration',
    emoji: '🌅',
    details: `
      • Warm water + lemon
      • Methi water (1 tsp soaked overnight)
      
      Remember: Start your day with positivity! 💫`
  },
  {
    time: '11:00',
    message: 'Yoga & Breathing Time',
    emoji: '🧘',
    details: `
      Your 30-minute wellness routine:
      • Butterfly Pose (2 min)
      • Child's Pose (2 min)
      • Cobra Pose (2 min)
      • Kapalabhati (3 rounds)
      • Anulom Vilom (5 min)
      
      Take deep breaths and feel the energy flow! 🌸`
  },
  {
    time: '11:30',
    message: 'Breakfast Time',
    emoji: '🍳',
    details: `
      Your nourishing breakfast:
      • Ginger-cinnamon tea
      • 2 boiled eggs or paneer/tofu scramble
      • 1 roti or 2 whole grain toast
      • 1 fruit (papaya/banana/apple)
      
      Eat mindfully and enjoy each bite! ✨`
  },
  {
    time: '12:00',
    message: 'Shower + Prep Time',
    emoji: '🚿',
    details: `
      Self-care time:
      • Take a refreshing shower
      • Play light relaxing music
      • Practice affirmations if desired
      
      Get ready for a wonderful day ahead! 💖`
  },
  {
    time: '13:00',
    message: 'Lunch Time (Pre-Work)',
    emoji: '🍲',
    details: `
      Your balanced lunch:
      • Brown rice or roti
      • Dal + spinach or broccoli
      • Salad: beetroot, carrot, cucumber
      • Buttermilk or curd
      
      Remember to pack your snacks for work:
      • 5 almonds, 2 walnuts, 2 dates
      • 1 banana or natural protein bar
      • Herbal tea (optional)
      
      Enjoy your meal! 🌿`
  },
  {
    time: '23:30',
    message: 'Dinner Time',
    emoji: '🥘',
    details: `
      Light and nurturing dinner:
      • Light dal khichdi or veggie stir-fry with tofu
      • Warm turmeric milk with cinnamon
      
      Eat mindfully and slowly 💝`
  },
  {
    time: '00:00',
    message: 'Our Relaxation Time',
    emoji: '🌙',
    details: `
      Time to unwind together:
      • Keep lights low and calming
      • Play soft, soothing music
      • Avoid heavy conversations or work talk
      
      Let's enjoy this peaceful moment 💕`
  },
  {
    time: '02:00',
    message: 'Light Snack + Wind Down',
    emoji: '🌟',
    details: `
      Final nourishment before sleep:
      • Banana + almond milk
      • Time for gratitude journal or light chat
      
      Remember:
      • Avoid screens after 1:30 AM
      • Keep the room dark
      • Use white noise or calming soundscape if needed
      
      Sweet dreams, my love! 💫`
  }
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
          ${reminder.emoji} <strong>${reminder.message}</strong>
          
          <div style="
            margin-top: 15px;
            white-space: pre-line;
            color: #666;">
            ${reminder.details}
          </div>
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
          margin: 20px 0;
          padding: 15px;
          background-color: #ffefef;
          border-radius: 10px;
          font-size: 14px;">
          <strong style="color: #ff6b6b;">Remember to avoid:</strong>
          <ul style="
            list-style-type: none;
            padding-left: 0;
            margin-top: 10px;">
            <li style="margin: 5px 0;">❌ Cold foods like ice creams or raw smoothies</li>
            <li style="margin: 5px 0;">❌ Over-caffeinated drinks (limit to 1 coffee/day max)</li>
            <li style="margin: 5px 0;">❌ Skipping meals or overeating junk food</li>
            <li style="margin: 5px 0;">❌ Screen exposure right before sleep</li>
          </ul>
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
  const [hour, minute] = reminder.time.split(':').map(num => parseInt(num, 10));
  // Format: second minute hour day month day-of-week
  const cronExpression = `0 ${minute} ${hour} * * *`;

  console.log(`Scheduling reminder "${reminder.message}" for ${hour}:${minute.toString().padStart(2, '0')} IST daily`);

  cron.schedule(cronExpression, async () => {
    try {
      // Get current time in IST
      const now = moment().tz('Asia/Kolkata');
      const scheduledTime = moment().tz('Asia/Kolkata').hour(hour).minute(minute).second(0);
      
      // Only send if we're within 1 minute of scheduled time
      if (Math.abs(now.diff(scheduledTime, 'minutes')) <= 1) {
        const activeUsers = await getActiveUsers();
        console.log(`\n📬 Processing ${reminder.time} reminder for ${activeUsers.length} active users`);
        
        for (const user of activeUsers) {
          if (user.pause_until && new Date(user.pause_until) > new Date()) {
            console.log(`⏸️ Skipping paused user: ${user.email} (paused until ${user.pause_until})`);
            continue;
          }
          await sendEmail(user, reminder);
        }
      } else {
        console.log(`⏭️ Skipping reminder for ${reminder.time} - Not within scheduled time window`);
      }
    } catch (error) {
      console.error('❌ Error in reminder schedule:', error.message);
    }
  }, {
    timezone: 'Asia/Kolkata',
    scheduled: true,
    runOnInit: false
  });
};

const initializeScheduler = () => {
  // Validate all reminder times
  reminders.forEach(reminder => {
    const [hour, minute] = reminder.time.split(':').map(num => parseInt(num, 10));
    if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      throw new Error(`Invalid time format in reminder: ${reminder.time}`);
    }
  });

  console.log('🕒 Initializing scheduler with the following reminders:');
  reminders.forEach(r => {
    console.log(`   ${r.emoji} ${r.time} - ${r.message}`);
    scheduleReminder(r);
  });
  console.log('✅ All reminders scheduled successfully in IST timezone');
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
