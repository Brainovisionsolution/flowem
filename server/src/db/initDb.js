import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { getDbPool, query } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initializeDatabase() {
  const pool = getDbPool();

  try {
    // 1. Read schema.sql directly relative to this module
    const schemaPath = path.resolve(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sqlContent = fs.readFileSync(schemaPath, 'utf8');
      const statements = sqlContent
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      for (const statement of statements) {
        await pool.query(statement);
      }
    }

    // 2. Ensure default Admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@brainovision.in';
    const adminRows = await query('SELECT id FROM users WHERE email = ?', [adminEmail]);

    if (adminRows.length === 0) {
      const passwordPlain = process.env.ADMIN_PASSWORD || 'Admin@Flowem2026!';
      const hash = await bcrypt.hash(passwordPlain, 10);
      const adminId = crypto.randomUUID();

      await query(
        `INSERT INTO users (id, email, password_hash, name, role, status) VALUES (?, ?, ?, ?, ?, ?)`,
        [adminId, adminEmail, hash, 'System Administrator', 'Admin', 'Active']
      );
      console.log(`[DB Init] Seeded initial administrator: ${adminEmail}`);
    }

    // 3. Ensure default organization settings
    const orgRows = await query('SELECT id FROM organization_settings LIMIT 1');
    if (orgRows.length === 0) {
      const orgId = crypto.randomUUID();
      await query(
        `INSERT INTO organization_settings (id, company_name, company_address, compliance_contact, time_zone, monthly_quota, current_usage, plan_name, enforce_two_factor)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orgId,
          'Brainovision Solutions India Pvt Ltd',
          'Plot No. 42, Hitech City, Hyderabad, Telangana 500081, India',
          'compliance@brainovision.in',
          'Asia/Kolkata',
          100000,
          0,
          'Enterprise High-Throughput',
          0
        ]
      );
      console.log('[DB Init] Seeded initial organization settings.');
    }

    // 4. Ensure default sender domain
    const domainRows = await query('SELECT id FROM sender_domains LIMIT 1');
    if (domainRows.length === 0) {
      const domainId = crypto.randomUUID();
      await query(
        `INSERT INTO sender_domains (id, domain, subdomain, status, spf_status, dkim_status, dmarc_status, warmup_stage, daily_quota_limit, daily_sent_count, reputation_score, verified_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          domainId,
          'brainovision.in',
          'mail.brainovision.in',
          'Verified',
          'Valid',
          'Valid',
          'Valid',
          'Stage 1 (Initial Warmup)',
          500,
          0,
          100
        ]
      );
      console.log('[DB Init] Seeded default sender domain: mail.brainovision.in');
    }

    // 5. Ensure starter templates
    const templateRows = await query('SELECT id FROM templates LIMIT 1');
    if (templateRows.length === 0) {
      const t1Id = crypto.randomUUID();
      await query(
        `INSERT INTO templates (id, name, subject, preview_text, category, html_content, is_popular)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          t1Id,
          'Brainovision Workshop Announcement',
          'Exclusive Invitation: Technical Skill Workshop',
          'Join industry experts for a live hands-on engineering workshop.',
          'Newsletter',
          `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b;">
            <h1 style="color: #0f172a; font-size: 24px;">Hello {{firstName}},</h1>
            <p style="font-size: 15px; line-height: 1.6; color: #475569;">You are invited to participate in an exclusive engineering workshop hosted by Brainovision.</p>
            <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; font-weight: bold;">Date: Saturday | Mode: Online Interactive</p>
            </div>
            <p style="font-size: 14px; color: #64748b;">Click below to confirm your registration slot:</p>
            <p><a href="https://brainovision.in/workshops" style="background: #2563eb; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; display: inline-block;">Reserve Seat</a></p>
          </div>`,
          1
        ]
      );
      console.log('[DB Init] Seeded starter email template.');
    }

    // 6. Ensure default automation
    const autoRows = await query('SELECT id FROM automations LIMIT 1');
    if (autoRows.length === 0) {
      const autoId = crypto.randomUUID();
      await query(
        `INSERT INTO automations (id, name, description, trigger_type, status, total_enrolled, completed_count)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          autoId,
          'New Subscriber Welcome Sequence',
          'Automatically dispatches a welcome message and follow-up guidance to newly joined contacts.',
          'contact_signup',
          'Active',
          0,
          0
        ]
      );

      const step1Id = crypto.randomUUID();
      const step2Id = crypto.randomUUID();
      await query(
        `INSERT INTO automation_steps (id, automation_id, step_order, type, title, subtitle) VALUES (?, ?, ?, ?, ?, ?)`,
        [step1Id, autoId, 1, 'trigger', 'Trigger: New Contact Added', 'Fires when a new contact is registered']
      );
      await query(
        `INSERT INTO automation_steps (id, automation_id, step_order, type, title, subtitle) VALUES (?, ?, ?, ?, ?, ?)`,
        [step2Id, autoId, 2, 'email', 'Send Welcome Email', 'Brainovision Welcome Message']
      );
      console.log('[DB Init] Seeded starter automation workflow.');
    }

    return true;
  } catch (err) {
    console.error('[DB Init] Database schema initialization notice:', err.message);
    return false;
  }
}

