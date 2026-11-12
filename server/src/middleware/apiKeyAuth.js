import crypto from 'crypto';
import { query } from '../config/db.js';

export async function authenticateApiKey(req, res, next) {
  let rawKey = req.headers['x-api-key'];

  if (!rawKey && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0].toLowerCase() === 'bearer' && parts[1].startsWith('flw_')) {
      rawKey = parts[1];
    }
  }

  if (!rawKey) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Missing API key. Provide X-API-Key header or Authorization: Bearer flw_live_...'
    });
  }

  try {
    const keyHash = crypto.createHash('sha256').update(rawKey.trim()).digest('hex');
    const rows = await query('SELECT * FROM api_keys WHERE key_hash = ? LIMIT 1', [keyHash]);

    if (!rows || rows.length === 0) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or revoked API key.'
      });
    }

    const apiKey = rows[0];

    // Update last used timestamp asynchronously
    query('UPDATE api_keys SET last_used_at = NOW() WHERE id = ?', [apiKey.id]).catch(() => {});

    req.apiKey = apiKey;
    next();
  } catch (err) {
    console.error('[API Key Auth] Authentication error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
