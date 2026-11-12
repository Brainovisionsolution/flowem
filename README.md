# FlowEM | Enterprise Bulk Email Automation Platform

**FlowEM** is a high-throughput, enterprise-grade bulk email automation platform engineered for sub-second delivery, autonomous IP warm-up, and 99.8% inbox placement.

---

## Key Platform Modules

### 1. High-Impact Landing Page
- Explains the bulk email platform, multi-region MTA routing architecture, and deliverability guarantees.
- Features rich visual diagrams, live dispatch engine telemetry, and interactive tabbed previews:
  - **MTA Distributed Pipeline**: 4-stage validation, throttling, and IP routing explanation.
  - **Autonomous IP Warm-Up**: Multi-stage gradual volume escalation.
  - **Multi-Branch Journey Canvas**: Visual event-driven workflow preview.
  - **DNS & DMARC Checker Tool**: Live simulated domain authentication query.
- Prominent **Get Started** and **Log In** actions connected to an enterprise authentication modal with instant demo fast-track.

### 2. Contacts Management
- Indexed subscriber directory with engagement scores (0 - 100), delivery counts, open/click ratios, and tags.
- Search and filter by status (`Subscribed`, `Unsubscribed`, `Bounced`, `Complained`).
- **Add Single Contact** modal with tag assignments.
- **Bulk CSV Importer** modal with automatic syntax verification and field mapping.
- **Contact Details Drawer** inspecting delivery history and engagement metrics.
- Export contacts to CSV.

### 3. Contact Lists & Dynamic Segments
- Cohort management supporting both **Static Lists** and **Dynamic Segments**.
- Live subscriber counts, active engagement percentages, and average open rates.
- **Create List / Segment** modal.
- Automated **Hygiene Cleaner Tool** to purge dormant or syntax-invalid addresses.

### 4. Campaigns Orchestrator
- Broadcast dashboard displaying delivery rates, opens, clicks, and bounce diagnostics.
- Dispatch status indicators: `Sending`, `Completed`, `Scheduled`, `Draft`, `Paused`.
- **Multi-Step Campaign Creation Wizard**:
  - Step 1: Setup (Internal Name, Subject Line, Sender Domain, Sender Email, Friendly From Name)
  - Step 2: Target Audience List Selection
  - Step 3: Production Template Selection with live preview
  - Step 4: Throttling & Schedule (Immediate vs Scheduled, Max Hourly Rate)
  - Step 5: Automatic RFC Compliance Injection & Launch

### 5. Responsive Templates Library
- Email templates categorized into `Transactional`, `Marketing`, `Newsletter`, `System Alerts`, and `Product Launch`.
- **Interactive Preview Drawer**:
  - **Desktop** (600px mail client) vs **Mobile** (360px viewport) preview toggle.
  - **Visual Render** vs **HTML Code Inspector** tab.
  - Dynamic variable simulation (`{{firstName}}` substitution test).
- **Create Custom Template** modal.

### 6. Automation & Multi-Branch Journeys
- Visual workflow builder with connected journey nodes:
  - `Trigger Node` (Contact Added, Tag Applied, Webhook Event)
  - `Time Delay Node` (Buffer window, Wait N hours/days)
  - `Action Node` (Dispatch email template, Apply tag, Webhook POST)
  - `Condition Node` (Engagement branch, opens within 48h)
- Append Journey Node modal with customizable parameters.
- Active / Pause status toggles and synthetic test webhook trigger.

### 7. Deliverability Analytics & Telemetry
- Timeframe filters (`24h`, `7d`, `30d`, `MTD`).
- Granular metrics: Inbox Placement (99.84%), Spam Complaint Rate (0.012%), Hard Bounce Rate (0.158%), MTA Socket Latency (38ms).
- SVG transmission throughput velocity curve.
- Recipient ISP breakdown (Google Workspace, Microsoft 365, Yahoo/AOL, Apple iCloud, Corporate MTAs).
- Bounce error diagnostic classification (550 5.1.1, 554 5.7.1, 451 4.4.0, 552 5.2.2).
- Geographic region latency map and exportable telemetry CSV.

### 8. Sender Configuration & Domain Authentication
- Sender domain table with live verification statuses for:
  - **SPF** (Sender Policy Framework TXT record)
  - **DKIM** (2048-Bit Public Key alignment)
  - **DMARC** (Enforcement policy: `p=reject; pct=100`)
  - **MX** (Feedback & bounce return-path routing)
- Live **Re-scan DNS** simulator.
- Dedicated IP warm-up progression tracker with daily limits and IP pool health.
- Add Custom Sending Domain modal.

### 9. Suppression & Global Compliance Shield
- Centralized suppression list enforcing RFC-8058, GDPR, and CAN-SPAM opt-outs.
- Suppression categories: `Hard Bounce`, `Unsubscribe Request`, `Spam Complaint`, `Manual Policy`.
- Add manual suppression entry modal and instant suppression revocation.
- Automated compliance checklist validating One-Click List-Unsubscribe headers, CAN-SPAM physical footers, and consent audit logs.

### 10. Organization Settings
- Corporate legal identity and registered headquarters address for automated footer insertion.
- Monthly dispatch quota utilization meter (2.50M tier).
- **REST API Dispatch Keys**: Provisioning, clipboard token copy, and instant revocation.
- **Webhook Endpoint**: URL configuration, subscribed events, and simulated ping dispatcher.
- Mandatory hardware 2FA security enforcement.

### 11. User Management & RBAC
- Team roster with roles: `Owner`, `Administrator`, `Deliverability Engineer`, `Campaign Manager`, `Analyst`.
- Invite Team Member modal with granular role assignments.
- Member removal / credential revocation.
- **Granular Permissions Matrix** comparing rights across all console modules.

---

## Styling & Design Specifications

- **Typography**: `Cambria Math`, `Cambria`, `Lora`, Georgia, serif applied throughout all pages, inputs, modals, and buttons.
- **Visual Morphisms**: Frosted glass panels (`glass-card`, `glass-panel`), glowing edge borders (`shadow-glow-indigo`, `shadow-glow-cyan`), and neumorphic insets (`morphic-concave`).
- **Professional Tone**: Strictly **zero emojis** throughout the entire application. Clean vector SVG line icons provided by Lucide.
- **Performance**: Lightweight production build (~366 kB JS bundle, ~37 kB CSS bundle), instant render times, and zero external chart library bloat.

---

## Development & Build Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Compile TypeScript and build production bundle
npm run build

# Preview production build locally
npm run preview
```

