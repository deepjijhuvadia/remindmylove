const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(process.env.DATABASE_PATH || path.join(__dirname, '../../database.sqlite'));

const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE NOT NULL,
        timezone TEXT DEFAULT 'Asia/Kolkata',
        is_active BOOLEAN DEFAULT 1,
        pause_until DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

const createUser = (name, email) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email],
      function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
};

const getActiveUsers = () => {
  return new Promise((resolve, reject) => {
    const now = new Date().toISOString();
    db.all(
      `SELECT * FROM users 
       WHERE is_active = 1 
       AND (pause_until IS NULL OR pause_until < ?)`,
      [now],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};

const togglePause = (email, pauseUntil) => {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE users SET pause_until = ? WHERE email = ?',
      [pauseUntil, email],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
};

const unsubscribeUser = (email) => {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE users SET is_active = 0 WHERE email = ?',
      [email],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
};

module.exports = {
  initializeDatabase,
  createUser,
  getActiveUsers,
  togglePause,
  unsubscribeUser
};
