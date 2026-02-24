import express from 'express';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import Database from 'better-sqlite3';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

declare module 'express-session' {
  interface SessionData {
    userId: any;
  }
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database('wardrobe.db');

// Initialize DB
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password_hash TEXT
    );
    CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY,
      user_id INTEGER,
      name TEXT,
      category TEXT,
      price REAL,
      brand TEXT,
      material TEXT,
      purchaseDate TEXT,
      condition TEXT,
      imageUrl TEXT,
      wearsPerYear INTEGER,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);
  
  // Ensure default user exists
  const userExists = db.prepare('SELECT id FROM users WHERE id = 1').get();
  if (!userExists) {
    db.prepare('INSERT INTO users (id, username) VALUES (1, "guest")').run();
  }
  
  console.log('Database initialized successfully');
} catch (err) {
  console.error('Database initialization failed:', err);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.set('trust proxy', 1);
  app.use(express.json({ limit: '50mb' }));
  app.use(session({
    secret: 'wardrobe-capital-secret',
    resave: false,
    saveUninitialized: false,
    proxy: true, // Required for secure cookies behind a proxy
    cookie: { 
      secure: true, // Required for SameSite=None
      sameSite: 'none', // Required for cross-origin iframe
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Auth Middleware
  const requireAuth = (req: any, res: any, next: any) => {
    req.session.userId = 1; // Default user
    next();
  };

  // API Routes
  
  // Register
  app.post('/api/auth/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const stmt = db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)');
      const info = stmt.run(username, hashedPassword);
      
      const userId = Number(info.lastInsertRowid);
      req.session.userId = userId;
      res.json({ id: userId, username });
    } catch (err: any) {
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        res.status(400).json({ error: 'Username already exists' });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  });

  // Login
  app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    const user = stmt.get(username) as any;

    if (user && await bcrypt.compare(password, user.password_hash)) {
      req.session.userId = user.id;
      res.json({ id: user.id, username: user.username });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });

  // Logout
  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy(() => {
      res.json({ message: 'Logged out' });
    });
  });

  // Me
  app.get('/api/auth/me', (req, res) => {
    if (req.session.userId) {
      const stmt = db.prepare('SELECT id, username FROM users WHERE id = ?');
      const user = stmt.get(req.session.userId);
      if (user) {
        res.json(user);
      } else {
        res.status(401).json({ error: 'User not found' });
      }
    } else {
      res.status(401).json({ error: 'Not authenticated' });
    }
  });

  // Items CRUD
  app.get('/api/items', requireAuth, (req: any, res) => {
    try {
      const stmt = db.prepare('SELECT * FROM items WHERE user_id = ?');
      const items = stmt.all(1); // Use default user ID 1
      res.json(items);
    } catch (error) {
      console.error('Error fetching items:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });

  app.post('/api/items', requireAuth, (req: any, res) => {
    const { id, name, category, price, brand, material, purchaseDate, condition, imageUrl, wearsPerYear } = req.body;
    const stmt = db.prepare(`
      INSERT INTO items (id, user_id, name, category, price, brand, material, purchaseDate, condition, imageUrl, wearsPerYear)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    try {
      stmt.run(id, 1, name, category, price, brand, material, purchaseDate, condition, imageUrl, wearsPerYear);
      res.json({ message: 'Item added' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to add item' });
    }
  });

  app.delete('/api/items/:id', requireAuth, (req: any, res) => {
    const stmt = db.prepare('DELETE FROM items WHERE id = ? AND user_id = ?');
    const info = stmt.run(req.params.id, 1);
    if (info.changes > 0) {
      res.json({ message: 'Item deleted' });
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  });

  // Vite Middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
