import { snsWebhookService } from './snsWebhook.service.js';

export const snsWebhookController = {
  async handleSnsWebhook(req, res) {
    try {
      let payload = req.body;
      if (typeof payload === 'string') {
        try {
          payload = JSON.parse(payload);
        } catch (e) {
          // Keep raw if not json
        }
      }

      const result = await snsWebhookService.processSnsPayload(payload);
      res.status(200).json(result);
    } catch (err) {
      console.error('[SNS Webhook Handler] Error processing SNS notification:', err.message);
      // Return 200 to AWS SNS to acknowledge receipt and prevent endless retries
      res.status(200).json({ success: false, error: err.message });
    }
  }
};

