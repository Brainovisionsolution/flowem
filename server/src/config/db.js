import mysql from 'mysql2/promise';
import { env } from './env.js';

let pool = null;

export function parseDatabaseConfig() {
  if (process.env.DB_USER && process.env.DB_PASSWORD) {
    return {
      host: process.env.DB_HOST || '127.0.0.1',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'flowem_db'
    };
  }

  const url = env.DATABASE_URL || process.env.DATABASE_URL || '';

  // Handle special characters in password using custom regex
  const regex = /^mysql:\/\/([^:]+):(.*)@([^:/]+)(?::(\d+))?\/([^?]+)/;
  const match = url.match(regex);
  if (match) {
    return {
      user: decodeURIComponent(match[1]),
      password: decodeURIComponent(match[2]),
      host: match[3],
      port: match[4] ? parseInt(match[4], 10) : 3306,
      database: match[5]
    };
  }

  try {
    const parsed = new URL(url);
    return {
      host: parsed.hostname || 'localhost',
      port: parsed.port ? parseInt(parsed.port, 10) : 3306,
      user: decodeURIComponent(parsed.username || 'root'),
      password: decodeURIComponent(parsed.password || 'MySQL@2026New'),
      database: (parsed.pathname || '/flowem_db').replace(/^\//, '')
    };
  } catch (err) {
    return {
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: 'MySQL@2026New',
      database: 'flowem_db'
    };
  }
}

export async function ensureDatabaseExists() {
  const cfg = parseDatabaseConfig();
  try {
    const tempConn = await mysql.createConnection({
      host: cfg.host,
      port: cfg.port,
      user: cfg.user,
      password: cfg.password
    });
    await tempConn.query(
      `CREATE DATABASE IF NOT EXISTS \`${cfg.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    await tempConn.end();
    return true;
  } catch (err) {
    // If temp connection fails, log notice and return false
    console.warn('[DB] Notice during ensureDatabaseExists:', err.message);
    return false;
  }
}

export function getDbPool() {
  if (!pool) {
    const dbConfig = parseDatabaseConfig();
    pool = mysql.createPool({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      waitForConnections: true,
      connectionLimit: 20,
      queueLimit: 0,
      multipleStatements: true,
      charset: 'utf8mb4'
    });
  }
  return pool;
}

export async function query(sql, params = []) {
  const p = getDbPool();
  const [rows] = await p.query(sql, params);
  return rows;
}

export async function execute(sql, params = []) {
  const p = getDbPool();
  const [result] = await p.execute(sql, params);
  return result;
}

export async function checkDatabaseConnection() {
  try {
    await ensureDatabaseExists();
    const p = getDbPool();
    const [rows] = await p.query('SELECT 1 as connected');
    return rows && rows.length > 0;
  } catch (err) {
    return false;
  }
}

export const db = {
  pool: getDbPool,
  query,
  execute,
  checkConnection: checkDatabaseConnection
};
