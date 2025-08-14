const { getRandomQuote } = require('./quoteService');

// Updated daily schedule in IST (Asia/Kolkata)
const DAILY_SCHEDULE = [
  {
    time: '10:30',
    title: 'Wake Up + Hydrate',
    emoji: '🌅',
    details: [
      'Warm water + lemon',
      'Methi water (1 tsp soaked overnight)',
      'Get some sunlight',
      'Gentle neck/shoulder rolls'
    ]
  },
  {
    time: '11:00',
    title: 'Yoga & Breathing',
    emoji: '🧘',
    details: [
      'Butterfly pose (2 min)',
      'Cat-Cow pose (2 min)',
      'Cobra pose (2 min)',
      'Surya Namaskar ×4',
      'Anulom Vilom (5 min)',
      'Kapalabhati (3 rounds)'
    ]
  },
  {
    time: '11:30',
    title: 'Breakfast',
    emoji: '🍳',
    details: [
      'Ginger-cinnamon tea',
      'Eggs/paneer/tofu scramble',
      'Toast/roti',
      'Fresh fruit (papaya/banana/apple)'
    ]
  },
  {
    time: '13:00',
    title: 'Lunch',
    emoji: '🍲',
    details: [
      'Brown rice or roti',
      'Dal + spinach/broccoli',
      'Fresh salad (beetroot, carrot, cucumber)',
      'Buttermilk or curd'
    ]
  },
  {
    time: '17:00',
    title: 'Snack',
    emoji: '🥜',
    details: [
      '5 almonds, 2 walnuts, 2 dates',
      'Banana or natural protein bar',
      'Herbal tea'
    ]
  },
  {
    time: '23:30',
    title: 'Dinner',
    emoji: '🥘',
    details: [
      'Light dal khichdi or veggie stir-fry with tofu',
      'Warm turmeric milk with cinnamon'
    ]
  },
  {
    time: '02:00',
    title: 'Sleep Wind-Down',
    emoji: '🌙',
    details: [
      'Banana + almond milk',
      'Low light environment',
      'Gratitude journal',
      'Prepare for peaceful sleep'
    ]
  }
];

// Grocery list content
const GROCERY_LIST = {
  title: 'Grocery Shopping Reminder',
  emoji: '🛒',
  categories: [
    {
      name: 'Fruits',
      items: ['Papaya', 'Banana', 'Apple', 'Pomegranate', 'Seasonal berries']
    },
    {
      name: 'Vegetables',
      items: ['Spinach', 'Methi', 'Pumpkin', 'Beetroot', 'Broccoli', 'Cucumber', 'Carrot', 'Tomato', 'Lauki']
    },
    {
      name: 'Proteins',
      items: ['Eggs', 'Paneer', 'Tofu', 'Moong dal', 'Masoor dal', 'Chana dal', 'Chickpeas', 'Kidney beans']
    },
    {
      name: 'Grains',
      items: ['Whole wheat flour', 'Brown rice', 'Oats', 'Poha', 'Upma rava', 'Millets (Ragi/Bajra)']
    },
    {
      name: 'Fats & Spices',
      items: ['Almonds', 'Walnuts', 'Flax seeds', 'Chia seeds', 'Sesame seeds', 'Turmeric', 'Ginger', 'Cumin', 'Fennel', 'Cinnamon']
    },
    {
      name: 'Others',
      items: ['Curd/Buttermilk', 'Milk/Almond milk', 'Honey', 'Herbal/Green tea', 'Olive/Groundnut oil']
    }
  ]
};

// Generate HTML for daily reminder emails
const generateDailyReminderHTML = (user, reminder) => {
  const quote = getRandomQuote();
  const greeting = user.name ? `Hi, ${user.name} ❤️` : 'Hi, Love ❤️';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${reminder.title}</title>
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
          font-size: 28px;
          color: #ff6b6b;
          margin-bottom: 20px;
          text-align: center;">
          ${reminder.emoji} ${reminder.title}
        </div>
        
        <div style="
          font-size: 18px;
          color: #2d3436;
          margin: 20px 0;
          padding: 20px;
          background-color: #fff0f0;
          border-radius: 10px;">
          <strong>Time: ${reminder.time}</strong>
          
          <div style="
            margin-top: 15px;
            color: #666;">
            ${reminder.details.map(detail => `• ${detail}`).join('<br>')}
          </div>
        </div>
        
        <div style="
          font-style: italic;
          color: #636e72;
          margin: 20px 0;
          padding: 15px;
          border-left: 4px solid #ff6b6b;
          background-color: #f8f9fa;">
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

// Generate HTML for grocery list emails
const generateGroceryListHTML = (user) => {
  const greeting = user.name ? `Hi, ${user.name} ❤️` : 'Hi, Love ❤️';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Grocery Shopping Reminder</title>
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
          font-size: 28px;
          color: #ff6b6b;
          margin-bottom: 20px;
          text-align: center;">
          ${GROCERY_LIST.emoji} ${GROCERY_LIST.title}
        </div>
        
        <div style="
          font-size: 16px;
          color: #2d3436;
          margin: 20px 0;
          padding: 20px;
          background-color: #fff0f0;
          border-radius: 10px;">
          <p style="margin-bottom: 20px;">It's time to restock your healthy essentials! Here's your complete grocery list:</p>
          
          ${GROCERY_LIST.categories.map(category => `
            <div style="margin-bottom: 20px;">
              <h3 style="color: #ff6b6b; margin-bottom: 10px;">${category.name}</h3>
              <ul style="
                list-style-type: none;
                padding-left: 0;
                margin: 0;">
                ${category.items.map(item => `<li style="margin: 5px 0; padding-left: 20px; position: relative;">
                  <span style="position: absolute; left: 0;">•</span> ${item}
                </li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
        
        <div style="
          margin: 20px 0;
          padding: 15px;
          background-color: #e8f5e8;
          border-radius: 10px;
          font-size: 14px;">
          <strong style="color: #28a745;">Shopping Tips:</strong>
          <ul style="
            list-style-type: none;
            padding-left: 0;
            margin-top: 10px;">
            <li style="margin: 5px 0;">✅ Buy fresh produce for the week</li>
            <li style="margin: 5px 0;">✅ Choose organic when possible</li>
            <li style="margin: 5px 0;">✅ Stock up on pantry essentials</li>
            <li style="margin: 5px 0;">✅ Plan meals around seasonal items</li>
          </ul>
        </div>
        
        <div style="
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ffd3d3;
          color: #ff6b6b;">
          Happy shopping! Your wellness journey continues 💕
        </div>
      </div>
    </body>
    </html>
  `;
};

// Generate welcome email HTML
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
            ${DAILY_SCHEDULE.map(r => `<li style="margin: 10px 0;">${r.emoji} ${r.time} - ${r.title}</li>`).join('')}
          </ul>
          
          <p style="margin-top: 15px;">Plus, you'll receive grocery reminders every 2 days to keep your kitchen stocked with healthy essentials!</p>
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

module.exports = {
  DAILY_SCHEDULE,
  GROCERY_LIST,
  generateDailyReminderHTML,
  generateGroceryListHTML,
  generateWelcomeEmailHTML
};
