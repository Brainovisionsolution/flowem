import crypto from 'crypto';
import http from 'http';
import https from 'https';
import { query } from '../config/db.js';

export const webhookDispatcher = {
  /**
   * Broadcasts an event to registered webhooks and the organization webhook URL
   */
  async dispatchEvent(eventType, payload) {
    try {
      const orgRows = await query('SELECT webhook_url FROM organization_settings LIMIT 1');
      const urlsToNotify = [];

      if (orgRows[0]?.webhook_url) {
        urlsToNotify.push({ url: orgRows[0].webhook_url, secret: 'flowem_secret' });
      }

      const registeredWebhooks = await query('SELECT * FROM webhooks WHERE is_active = 1');

      for (const wh of registeredWebhooks) {
        urlsToNotify.push({ url: wh.url, secret: wh.secret, webhookId: wh.id });
      }

      if (urlsToNotify.length === 0) return;

      const bodyString = JSON.stringify({
        event: eventType,
        timestamp: new Date().toISOString(),
        data: payload
      });

      for (const target of urlsToNotify) {
        this.sendPostRequest(target.url, target.secret, bodyString, target.webhookId, eventType);
      }
    } catch (err) {
      console.error('[Webhook Dispatcher] Error dispatching event:', err.message);
    }
  },

  sendPostRequest(targetUrl, secret, bodyString, webhookId, eventType) {
    try {
      const parsedUrl = new URL(targetUrl);
      const isHttps = parsedUrl.protocol === 'https:';
      const client = isHttps ? https : http;

      const signature = crypto
        .createHmac('sha256', secret || 'default_secret')
        .update(bodyString)
        .digest('hex');

      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || (isHttps ? 443 : 80),
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(bodyString),
          'X-FlowEM-Signature': signature,
          'User-Agent': 'FlowEM-Webhook-Engine/1.0'
        },
        timeout: 5000
      };

      const req = client.request(options, (res) => {
        let responseBody = '';
        res.on('data', chunk => { responseBody += chunk; });
        res.on('end', async () => {
          if (webhookId) {
            const deliveryId = crypto.randomUUID();
            await query(
              `INSERT INTO webhook_deliveries (id, webhook_id, event_type, payload_json, response_status, response_body)
               VALUES (?, ?, ?, ?, ?, ?)`,
              [deliveryId, webhookId, eventType, bodyString, res.statusCode, responseBody.substring(0, 1000)]
            ).catch(() => {});
          }
        });
      });

      req.on('error', (err) => {
        console.warn(`[Webhook Dispatcher] Failed delivery to ${targetUrl}:`, err.message);
      });

      req.write(bodyString);
      req.end();
    } catch (err) {
      console.warn(`[Webhook Dispatcher] Invalid target URL ${targetUrl}:`, err.message);
    }
  }
};
