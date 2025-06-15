const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

// 连接数据库
const db = new sqlite3.Database('./game.db', (err) => {
  if (err) {
    console.error('数据库连接错误:', err.message);
  } else {
    console.log('成功连接到SQLite数据库');
    initializeDatabase();
  }
});

// 初始化数据库表
function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      username TEXT NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS rooms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      owner_id INTEGER NOT NULL,
      status TEXT DEFAULT 'waiting',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (owner_id) REFERENCES users(id)
    )
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      score INTEGER DEFAULT 0,
      FOREIGN KEY (room_id) REFERENCES rooms(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_id INTEGER NOT NULL,
      secret_number INTEGER NOT NULL,
      status TEXT DEFAULT 'in_progress',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (room_id) REFERENCES rooms(id)
    )
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS guesses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_id INTEGER NOT NULL,
      player_id INTEGER NOT NULL,
      guess INTEGER NOT NULL,
      result TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (game_id) REFERENCES games(id),
      FOREIGN KEY (player_id) REFERENCES players(id)
    )
  `);
}

// 数据库操作方法
module.exports = {
  // 用户相关
  getUserByEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },
  
  createUser: (email, username, password) => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (email, username, password) VALUES (?, ?, ?)',
        [email, username, password],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, email, username });
        }
      );
    });
  },
  
  // 房间相关
  getRooms: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM rooms', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },
  
  createRoom: (name, ownerId) => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO rooms (name, owner_id) VALUES (?, ?)',
        [name, ownerId],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, name, owner_id: ownerId });
        }
      );
    });
  },
  
  joinRoom: (roomId, userId) => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO players (room_id, user_id) VALUES (?, ?)',
        [roomId, userId],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, room_id: roomId, user_id: userId });
        }
      );
    });
  }
};