import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { getDbPool, query } from '../config/db.js';

export const TABLE_SCHEMAS = [
  `CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(191) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'Admin',
    status VARCHAR(20) NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS contacts (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(191) NOT NULL UNIQUE,
    first_name VARCHAR(100) NULL,
    last_name VARCHAR(100) NULL,
    phone VARCHAR(30) NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Active',
    source VARCHAR(50) NULL DEFAULT 'Manual',
    consent_given BOOLEAN NOT NULL DEFAULT TRUE,
    consent_date TIMESTAMP NULL,
    consent_ip VARCHAR(45) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_contacts_status (status),
    INDEX idx_contacts_email (email)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS contact_lists (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'Static',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS contact_list_members (
    id VARCHAR(36) PRIMARY KEY,
    contact_id VARCHAR(36) NOT NULL,
    list_id VARCHAR(36) NOT NULL,
    added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_contact_list (contact_id, list_id),
    INDEX idx_clm_contact (contact_id),
    INDEX idx_clm_list (list_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS tags (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS contact_tags (
    id VARCHAR(36) PRIMARY KEY,
    contact_id VARCHAR(36) NOT NULL,
    tag_id VARCHAR(36) NOT NULL,
    UNIQUE KEY uk_contact_tag (contact_id, tag_id),
    INDEX idx_ct_contact (contact_id),
    INDEX idx_ct_tag (tag_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS templates (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    preview_text VARCHAR(255) NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'Newsletter',
    html_content LONGTEXT NOT NULL,
    editor_json JSON NULL,
    is_popular BOOLEAN NOT NULL DEFAULT FALSE,
    thumbnail_url VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_templates_category (category)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS template_versions (
    id VARCHAR(36) PRIMARY KEY,
    template_id VARCHAR(36) NOT NULL,
    version_number INT NOT NULL,
    html_content LONGTEXT NOT NULL,
    editor_json JSON NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_tv_template (template_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS campaigns (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    preview_text VARCHAR(255) NULL,
    sender_name VARCHAR(100) NOT NULL,
    sender_email VARCHAR(191) NOT NULL,
    reply_to_email VARCHAR(191) NULL,
    template_id VARCHAR(36) NULL,
    list_id VARCHAR(36) NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Draft',
    scheduled_at TIMESTAMP NULL,
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    recipients_total INT NOT NULL DEFAULT 0,
    sent_count INT NOT NULL DEFAULT 0,
    delivered_count INT NOT NULL DEFAULT 0,
    opened_count INT NOT NULL DEFAULT 0,
    clicked_count INT NOT NULL DEFAULT 0,
    bounced_count INT NOT NULL DEFAULT 0,
    complained_count INT NOT NULL DEFAULT 0,
    unsubscribed_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_campaigns_status (status),
    INDEX idx_campaigns_created (created_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS campaign_recipients (
    id VARCHAR(36) PRIMARY KEY,
    campaign_id VARCHAR(36) NOT NULL,
    contact_id VARCHAR(36) NULL,
    email VARCHAR(191) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending',
    ses_message_id VARCHAR(191) NULL,
    sent_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    error_message TEXT NULL,
    UNIQUE KEY uk_campaign_email (campaign_id, email),
    INDEX idx_cr_status (status)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS campaign_events (
    id VARCHAR(36) PRIMARY KEY,
    campaign_id VARCHAR(36) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    data_json JSON NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_ce_campaign (campaign_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS email_events (
    id VARCHAR(36) PRIMARY KEY,
    message_id VARCHAR(191) NOT NULL,
    campaign_id VARCHAR(36) NULL,
    contact_id VARCHAR(36) NULL,
    event_type VARCHAR(50) NOT NULL,
    recipient_email VARCHAR(191) NOT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    link_url TEXT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    raw_payload JSON NULL,
    INDEX idx_ee_msg (message_id),
    INDEX idx_ee_campaign (campaign_id),
    INDEX idx_ee_type (event_type)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS sender_domains (
    id VARCHAR(36) PRIMARY KEY,
    domain VARCHAR(191) NOT NULL,
    subdomain VARCHAR(191) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending',
    spf_status VARCHAR(20) NOT NULL DEFAULT 'Checking',
    dkim_status VARCHAR(20) NOT NULL DEFAULT 'Checking',
    dmarc_status VARCHAR(20) NOT NULL DEFAULT 'Checking',
    warmup_stage VARCHAR(50) NOT NULL DEFAULT 'Stage 1',
    daily_quota_limit INT NOT NULL DEFAULT 500,
    daily_sent_count INT NOT NULL DEFAULT 0,
    reputation_score INT NOT NULL DEFAULT 100,
    verified_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS suppressions (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(191) NOT NULL UNIQUE,
    reason VARCHAR(50) NOT NULL,
    source_campaign VARCHAR(150) NULL,
    notes TEXT NULL,
    suppressed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_suppression_reason (reason)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS unsubscribe_events (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(191) NOT NULL,
    campaign_id VARCHAR(36) NULL,
    ip_address VARCHAR(45) NULL,
    reason VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_ue_email (email)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS automations (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NULL,
    trigger_type VARCHAR(50) NOT NULL DEFAULT 'contact_signup',
    status VARCHAR(20) NOT NULL DEFAULT 'Draft',
    total_enrolled INT NOT NULL DEFAULT 0,
    completed_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS automation_steps (
    id VARCHAR(36) PRIMARY KEY,
    automation_id VARCHAR(36) NOT NULL,
    step_order INT NOT NULL,
    type VARCHAR(30) NOT NULL,
    title VARCHAR(150) NOT NULL,
    subtitle VARCHAR(255) NULL,
    config_json JSON NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_as_order (automation_id, step_order)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS automation_executions (
    id VARCHAR(36) PRIMARY KEY,
    automation_id VARCHAR(36) NOT NULL,
    contact_id VARCHAR(36) NOT NULL,
    current_step_id VARCHAR(36) NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Running',
    enrolled_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    INDEX idx_ae_auto (automation_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS automation_execution_steps (
    id VARCHAR(36) PRIMARY KEY,
    execution_id VARCHAR(36) NOT NULL,
    step_id VARCHAR(36) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Success',
    executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    output_json JSON NULL,
    INDEX idx_aes_exec (execution_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS organization_settings (
    id VARCHAR(36) PRIMARY KEY,
    company_name VARCHAR(150) NOT NULL DEFAULT 'Brainovision Solutions India Pvt Ltd',
    company_address TEXT NOT NULL,
    compliance_contact VARCHAR(191) NOT NULL DEFAULT 'compliance@brainovision.in',
    time_zone VARCHAR(50) NOT NULL DEFAULT 'Asia/Kolkata',
    monthly_quota INT NOT NULL DEFAULT 100000,
    current_usage INT NOT NULL DEFAULT 0,
    plan_name VARCHAR(50) NOT NULL DEFAULT 'Enterprise High-Throughput',
    enforce_two_factor BOOLEAN NOT NULL DEFAULT FALSE,
    webhook_url VARCHAR(255) NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS api_keys (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    key_hash VARCHAR(255) NOT NULL UNIQUE,
    prefix VARCHAR(32) NOT NULL,
    last_used_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS webhooks (
    id VARCHAR(36) PRIMARY KEY,
    url VARCHAR(255) NOT NULL,
    secret VARCHAR(255) NOT NULL,
    events_json JSON NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS webhook_deliveries (
    id VARCHAR(36) PRIMARY KEY,
    webhook_id VARCHAR(36) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    payload_json JSON NOT NULL,
    response_status INT NULL,
    response_body TEXT NULL,
    delivered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_wd_webhook (webhook_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS idempotency_records (
    id VARCHAR(36) PRIMARY KEY,
    idempotency_key VARCHAR(191) NOT NULL UNIQUE,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(36) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
];

export async function initializeDatabase() {
  const pool = getDbPool();

  try {
    // 1. Create all 24 relational tables in MySQL 8
    for (const ddl of TABLE_SCHEMAS) {
      await pool.query(ddl);
    }
    console.log('[DB Init] All 24 MySQL 8 tables verified and initialized.');

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
    console.error('[DB Init] Database schema initialization error:', err);
    throw err;
  }
}

// Allow running directly via CLI: node src/db/initDb.js
if (process.argv[1] && (process.argv[1].endsWith('initDb.js') || process.argv[1].endsWith('initDb'))) {
  initializeDatabase()
    .then(() => {
      console.log('[DB Init] Database setup completed successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[DB Init] Failed to initialize database:', err);
      process.exit(1);
    });
}
