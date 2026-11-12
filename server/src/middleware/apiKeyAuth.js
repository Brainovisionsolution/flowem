import crypto from 'crypto';
import { prisma } from '../config/db.js';

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
    const apiKey = await prisma.apiKey.findUnique({
      where: { keyHash }
    });

    if (!apiKey) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or revoked API key.'
      });
    }

    // Update last used timestamp asynchronously
    prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() }
    }).catch(() => {});

    req.apiKey = apiKey;
    next();
  } catch (err) {
    console.error('[API Key Auth] Authentication error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
