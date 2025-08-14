# Wellness Reminder System Setup Guide

## Overview
This updated Wellness Reminder System sends personalized daily wellness reminders and grocery list reminders, with automatic Google Calendar integration.

## Features
- **7 Daily Wellness Reminders** at specific IST times
- **Grocery List Reminders** every 2 days
- **Google Calendar Integration** with automatic event creation
- **Individual Email Reminders** for each activity
- **Pause/Unsubscribe** functionality
- **Mobile-friendly** HTML email templates

## Daily Schedule (IST - Asia/Kolkata)
- **10:30 AM** - Wake Up + Hydrate
- **11:00 AM** - Yoga & Breathing
- **11:30 AM** - Breakfast
- **1:00 PM** - Lunch
- **5:00 PM** - Snack
- **11:30 PM** - Dinner
- **2:00 AM** - Sleep Wind-Down

## Prerequisites
1. **Node.js** (v14 or higher)
2. **Gmail Account** with App Password
3. **Google Cloud Project** with Calendar API enabled

## Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the project root with:

```env
# Email Configuration (Gmail SMTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FROM_EMAIL=your-email@gmail.com

# Google OAuth2 Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback

# Database Configuration (Optional)
DATABASE_PATH=./database.sqlite

# Server Configuration
PORT=3000
```

### 3. Gmail App Password Setup
1. Go to Google Account Settings
2. Enable 2-Factor Authentication
3. Generate App Password for "Mail"
4. Use this password in `EMAIL_PASS`

### 4. Google Cloud Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Calendar API
4. Create OAuth 2.0 credentials
5. Set authorized redirect URIs to `http://localhost:3000/auth/google/callback`
6. Copy Client ID and Client Secret to `.env`

## Usage

### Start the Server
```bash
npm start
```

### Development Mode
```bash
npm run dev
```

## How It Works

### 1. User Registration
- User fills out registration form
- System sends welcome email
- User is prompted to connect Google Calendar

### 2. Google Calendar Integration
- User clicks "Connect Google Calendar"
- Redirected to Google OAuth
- After authorization, system creates:
  - 7 daily recurring wellness events
  - 1 grocery list event every 2 days
- All events have 10-minute popup notifications

### 3. Daily Reminders
- System sends individual emails at scheduled times
- Each reminder includes:
  - Activity details
  - Random love quote
  - Wellness guidelines
  - Mobile-friendly design

### 4. Grocery Reminders
- Sent every 2 days at 11:00 AM IST
- Complete categorized grocery list
- Shopping tips and guidelines

## Database Schema
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  timezone TEXT DEFAULT 'Asia/Kolkata',
  is_active BOOLEAN DEFAULT 1,
  pause_until DATETIME,
  access_token TEXT,
  refresh_token TEXT,
  calendar_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## File Structure
```
├── app.js                 # Main server file
├── routes.js              # API routes
├── user.js                # User database operations
├── emailService.js        # Email scheduling and sending
├── googleCalendarService.js # Google Calendar integration
├── templates.js           # Email templates and schedules
├── quoteService.js        # Random love quotes
├── index.html             # Frontend interface
├── main.js                # Frontend JavaScript
├── style.css              # Frontend styles
└── database.sqlite        # SQLite database
```

## Testing

### Test Daily Reminders
1. Start server
2. Register a user
3. Connect Google Calendar
4. Wait for scheduled times or manually trigger

### Test Grocery Reminders
- Grocery reminders run every 2 days at 11:00 AM IST
- Check console logs for scheduling confirmation

### Test Calendar Integration
1. Check Google Calendar for recurring events
2. Verify event descriptions and times
3. Confirm 10-minute notification settings

## Troubleshooting

### Email Issues
- Verify Gmail app password
- Check EMAIL_USER and EMAIL_PASS in .env
- Ensure Gmail account has SMTP access enabled

### Google Calendar Issues
- Verify OAuth credentials
- Check redirect URI matches exactly
- Ensure Calendar API is enabled
- Check console logs for OAuth errors

### Scheduling Issues
- Verify server timezone is correct
- Check cron job initialization in console
- Ensure all reminder times are valid

## Security Notes
- Store sensitive credentials in environment variables
- Use HTTPS in production
- Implement rate limiting for production use
- Regular token refresh handling
- Secure session management

## Production Deployment
1. Use HTTPS
2. Set proper redirect URIs for production domain
3. Implement proper error handling
4. Add monitoring and logging
5. Use production database (PostgreSQL/MySQL)
6. Set up proper backup strategies

## Support
For issues or questions, check the console logs and ensure all environment variables are properly configured.
