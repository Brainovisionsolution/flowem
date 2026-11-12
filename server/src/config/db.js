import mysql from 'mysql2/promise';
import { env } from './env.js';

let pool = null;

function parseDatabaseUrl(url) {
  try {
    const parsed = new URL(url);
    return {
      host: parsed.hostname || 'localhost',
      port: parsed.port ? parseInt(parsed.port, 10) : 3306,
      user: decodeURIComponent(parsed.username || 'flowem'),
      password: decodeURIComponent(parsed.password || 'Flowem@2026!'),
      database: (parsed.pathname || '/flowem_db').replace(/^\//, '')
    };
  } catch (err) {
    return {
      host: 'localhost',
      port: 3306,
      user: 'flowem',
      password: 'Flowem@2026!',
      database: 'flowem_db'
    };
  }
}

export function getDbPool() {
  if (!pool) {
    const dbConfig = parseDatabaseUrl(env.DATABASE_URL);
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
