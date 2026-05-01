require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const { Pool } = require('pg');
const routes = require('./api/routes');
const path = require('path');
const fs = require('fs');

const app = express();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('supabase')
    ? { rejectUnauthorized: false }
    : false,
});

app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
});

app.use(limiter);
app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({ message: '後端連線成功！', status: 'OK' });
});

app.get('/api/health/db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS server_time');
    res.json({
      status: 'OK',
      database: 'connected',
      server_time: result.rows[0].server_time,
    });
  } catch (error) {
    console.error('Database health check failed:', error);
    res.status(503).json({
      status: 'ERROR',
      database: 'unavailable',
      code: error.code || 'UNKNOWN',
      message: '資料庫目前不可用，請檢查 Render 環境變數與資料庫連線設定。',
    });
  }
});

app.get('/api/health/config', (req, res) => {
  let databaseHost = null;
  let databaseUser = null;
  let databasePort = null;
  let databaseName = null;
  let passwordLength = null;
  let passwordHasWhitespace = null;
  let passwordHasPlaceholderBrackets = null;
  try {
    if (process.env.DATABASE_URL) {
      const databaseUrl = new URL(process.env.DATABASE_URL);
      databaseHost = databaseUrl.hostname;
      databaseUser = databaseUrl.username;
      databasePort = databaseUrl.port || null;
      databaseName = databaseUrl.pathname.replace(/^\//, '') || null;
      passwordLength = databaseUrl.password.length;
      passwordHasWhitespace = /\s/.test(databaseUrl.password);
      passwordHasPlaceholderBrackets = databaseUrl.password.includes('[') || databaseUrl.password.includes(']');
    }
  } catch {
    databaseHost = 'invalid-url';
  }

  res.json({
    status: 'OK',
    env: process.env.NODE_ENV || 'unset',
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
    databaseHost,
    databaseUser,
    databasePort,
    databaseName,
    passwordLength,
    passwordHasWhitespace,
    passwordHasPlaceholderBrackets,
    hasJwtSecret: Boolean(process.env.JWT_SECRET),
    hasJwtRefreshSecret: Boolean(process.env.JWT_REFRESH_SECRET),
  });
});

app.use('/api', routes);

const webDistDir = path.join(__dirname, 'mobile', 'dist');
if (fs.existsSync(webDistDir)) {
  app.use(express.static(webDistDir, { index: false }));

  app.get('/', (req, res) => {
    res.sendFile(path.join(webDistDir, 'index.html'));
  });

  app.get('/:path', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }

    res.sendFile(path.join(webDistDir, 'index.html'));
  });
}

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
