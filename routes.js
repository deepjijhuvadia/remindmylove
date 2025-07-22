const express = require('express');
const { body, validationResult } = require('express-validator');
const path = require('path');
const { createUser, togglePause, unsubscribeUser } = require('./user');
const { sendWelcomeEmail } = require('./emailService');

const router = express.Router();

// Serve the main page
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Register new user
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('name').trim().escape()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email } = req.body;
    const userId = await createUser(name, email);
    
    // Send welcome email
    const welcomeEmailSent = await sendWelcomeEmail({ name, email });
    
    res.json({ 
      message: welcomeEmailSent 
        ? "Welcome aboard! 🌸 Check your email for a special greeting!" 
        : "You're signed up for loving reminders 💖 (Welcome email might be delayed)",
      userId 
    });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      res.status(400).json({ 
        message: 'This email is already registered! You\'re already part of our wellness journey 💕' 
      });
    } else {
      console.error('Registration error:', error);
      res.status(500).json({ 
        message: 'An error occurred during registration. Please try again.' 
      });
    }
  }
});

// Toggle pause reminders
router.post('/pause', [
  body('email').isEmail().normalizeEmail(),
  body('duration').isInt({ min: 1, max: 7 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, duration } = req.body;
    const pauseUntil = new Date();
    pauseUntil.setDate(pauseUntil.getDate() + duration);
    
    await togglePause(email, pauseUntil.toISOString());
    res.json({ message: `Reminders paused for ${duration} days 💫` });
  } catch (error) {
    console.error('Pause error:', error);
    res.status(500).json({ message: 'An error occurred while pausing reminders' });
  }
});

// Unsubscribe
router.post('/unsubscribe', [
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email } = req.body;
    await unsubscribeUser(email);
    res.json({ message: 'Successfully unsubscribed from reminders. Take care! 🌸' });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({ message: 'An error occurred while unsubscribing' });
  }
});

module.exports = router;
