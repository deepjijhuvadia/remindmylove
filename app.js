require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes');
const { initializeDatabase } = require('./user');
const { initializeScheduler } = require('./emailService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Routes
app.use('/', routes);

// Initialize database and scheduler
(async () => {
  try {
    await initializeDatabase();
    await initializeScheduler();
    console.log('Database and scheduler initialized successfully');
  } catch (error) {
    console.error('Error during initialization:', error);
  }
})();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
