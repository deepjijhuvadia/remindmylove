# Wellness Reminder System

A loving wellness reminder system that sends personalized, time-based email reminders throughout the day. Built with Node.js, Express, and Nodemailer.

## Features

- 💌 Personalized email reminders with user's name/nickname
- ⏰ Time-based reminders for daily wellness activities
- 💝 Beautiful, mobile-friendly HTML email templates
- 🎯 Random love quotes in each email
- 🌟 Pastel-themed, minimalist web interface
- ⏸️ Ability to pause reminders
- 🔄 Unsubscribe functionality

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- Gmail Account
- Gmail App Password
- SQLite3

## Gmail Setup

1. Enable 2-Step Verification in your Google Account:
   - Go to Google Account Settings > Security
   - Enable 2-Step Verification

2. Generate an App Password:
   - Go to Google Account Settings > Security
   - Under "2-Step Verification", click on "App passwords"
   - Select "Mail" and your device
   - Click "Generate"
   - Copy the 16-character password

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd wellness-reminders
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_PASS=your_16_char_app_password
   FROM_EMAIL=your_gmail@gmail.com
   DATABASE_PATH=./database.sqlite
   PORT=3000
   ```

4. Start the application:
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

## Reminder Schedule

- 🕙 10:30 AM – Wake up + hydrate with lemon water
- 🧘 11:00 AM – Light yoga + breathing
- 🍳 11:30 AM – Breakfast reminder + hormone-friendly food suggestions
- 🍲 1:00 PM – Lunch reminder
- 🍎 5:00 PM – Healthy snack
- 🍛 11:30 PM – Light dinner + turmeric milk reminder
- 🌙 2:00 AM – Sleep reminder

## API Endpoints

- POST `/register` - Register new user
- POST `/pause` - Pause reminders for a specified duration
- POST `/unsubscribe` - Unsubscribe from reminders

## Email Template

Each email includes:
- Personal greeting
- Time-specific reminder
- Random love quote
- Warm, caring message
- Beautiful pastel design
- Mobile-responsive layout

## Development

The project structure follows the MVC pattern:
```
src/
├── app.js              # Application entry point
├── routes/             # Route handlers
├── models/             # Database models
├── controllers/        # Business logic
├── services/          # External services (email, scheduling)
├── views/             # Frontend views
└── public/            # Static assets
    ├── css/
    ├── js/
    └── images/
```

## Troubleshooting

1. If emails are not sending:
   - Verify your Gmail app password is correct
   - Ensure 2-Step Verification is enabled
   - Check the console for error messages
   - Verify your Gmail account hasn't hit daily sending limits

2. If reminders are not scheduled:
   - Check your system timezone matches IST
   - Verify cron expressions in emailService.js
   - Check the logs for scheduling confirmation

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License 