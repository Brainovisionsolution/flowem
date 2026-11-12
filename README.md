# FlowEM - High-Throughput Bulk Email Automation Platform

FlowEM is a high-throughput, production-grade bulk email automation, deliverability, and list management platform engineered specifically for Brainovision. Built exclusively on **MySQL 8** (with native `mysql2/promise` connection pooling, strictly zero Prisma, zero SQLite, and zero Docker), FlowEM combines high-throughput transmission controls, Amazon SES delivery infrastructure, Redis + BullMQ asynchronous queuing, automated bounce/suppression compliance, and event-driven automation sequences with an elegant light morphism user interface.

---

## Core Architecture Principles & Constraints

FlowEM strictly adheres to the following core operational and visual guidelines across the entire repository:

1. **Separated Client and Server Architecture**: Clear separation of concerns with an independent `client/` folder (React 18, Vite, TypeScript, Tailwind) and an independent `server/` folder (Express.js, MySQL 8, Redis, BullMQ, AWS SES).
2. **Strictly Zero Emojis**: Emojis are completely banned across all code, headings, buttons, badges, notifications, modals, logs, and documentation. All visual communication is delivered through crisp vector line icons (Lucide React), typography, and clean frosted morphisms.
3. **Pure MySQL 8 Database (No Prisma, No SQLite)**: FlowEM runs on **MySQL 8 exclusively** using native `mysql2/promise` connection pooling and parameterized SQL queries. Strictly zero Prisma, zero SQLite, zero MongoDB, and zero in-memory persistence files anywhere in the architecture.
4. **Zero Docker Dependency**: Runs natively and directly on any server or local host with Node.js and MySQL 8.
5. **Systemic Cambria Math Typography**: The `Cambria Math` serif typeface is systematically applied across all UI components, headings, data tables, and metrics, producing a refined, authoritative, mathematical visual identity.
6. **Light Frosted Morphism**: A light aesthetic (pure white, soft slate grays, frosted glass panels via `glass-panel`, and neumorphic concave inputs via `glass-input`) with gentle elevation shadows.
7. **Simple English in Dashboard**: Technical telemetry and dictionary jargon have been eliminated. Complex concepts are translated into clear, human terms:
   - "Suppression & Compliance Shield" -> **Unsubscribed & Blocked Emails**
   - "Autonomous Telemetry" -> **Emails Sent vs Opened**
   - "Cryptographic Sender Signatures" -> **Domain Setup (SPF, DKIM, DMARC)**
   - "Subscriber Cohorts" -> **Contact Lists**
8. **Single Admin Access Model**: FlowEM operates as an internal company platform managed by a single authenticated Administrator (`admin@brainovision.in`). Public employee self-registration and invitations are disabled.
9. **Clean Slate Initialization**: All sample data has been completely cleared. The platform initializes with zero dummy contacts, zero fake campaigns, zero dummy templates, and clean, actionable empty states across all modules.

---

## Complete Development Implementation

### 1. Pure MySQL 8 Database Layer (`server/src/db/` and `server/src/config/db.js`)
- **Native Driver**: Direct connection pooling using `mysql2/promise` with automatic UTF8MB4 collation support.
- **Auto-Initializing Schema (`server/src/db/schema.sql`)**: 24 relational tables covering users, contacts, lists, campaigns, templates, automations, sender domains, suppressions, events, and API keys.
- **Self-Healing Initializer (`server/src/db/initDb.js`)**: Executes automatically on server bootstrap, creating missing tables and seeding the default Admin (`admin@brainovision.in`), default organization settings, sending domain, starter templates, and welcome automation.

### 2. Single Admin Authentication & Session Security (`server/src/modules/auth/`)
- **Single Administrator Model**: Secure credentials provisioned via database seed (`admin@brainovision.in` / `Admin@Flowem2026!`).
- **Password Security**: Strong password hashing using `bcryptjs`.
- **JWT & HTTP-Only Secure Cookies**: Authentication tokens issued via 7-day JWT and stored in HTTP-only `flowem_token` cookies with SameSite protection to eliminate XSS vulnerability. Also accepts `Authorization: Bearer <token>` for programmatic API clients.
- **Registration Hardening**: Public signup endpoint disabled (returns HTTP 403 Forbidden).
- **Route Guard Middleware**: All 11 core modules guarded with `authenticate` middleware in `server/src/modules/auth/auth.middleware.js`.

### 3. Contacts & Audience Management (`server/src/modules/contacts/` & `lists/`)
- **Contact Directory**: Complete subscriber management with search, status filters (Active, Unsubscribed, Bounced, Complained), and batch operations.
- **Audience Segmentation**: Static lists and dynamic segments with contact association via `contact_list_members`.
- **Bulk CSV Importer**: Batch CSV processing engine with header mapping, duplicate detection, email syntax validation, and audit tracking.
- **CSV Data Export**: Streaming CSV export endpoint (`GET /api/contacts/export`) with download headers.

### 4. Email Template Builder & Personalization Engine (`server/src/modules/templates/`)
- **Template Workshop**: Searchable template catalog with category filtering (Newsletter, Transactional, Product Launch).
- **Email Compiler (`server/src/utils/emailCompiler.js`)**:
  - Dynamic token substitution: `{{firstName}}`, `{{lastName}}`, `{{email}}`, `{{companyName}}`, `{{unsubscribeUrl}}`.
  - CAN-SPAM postal address & unsubscribe footer auto-injection.
  - Transparent 1x1 open tracking pixel auto-injection.
  - Link click tracking wrapping.
- **Test Email Transmitter**: Instant test email delivery via `POST /api/templates/:id/test-email` using Amazon SES.
- **Template Versioning**: Version history tracking in `template_versions` table.

### 5. Amazon SES & Sending Domain Configuration (`server/src/modules/domains/`)
- **AWS SES Client (`server/src/integrations/aws/sesClient.js`)**: Direct integration with `@aws-sdk/client-ses` supporting `SendEmailCommand`, `VerifyDomainIdentityCommand`, and `GetSendQuotaCommand`.
- **India AWS Region Support**: Default sending region configured to `ap-south-1` (Mumbai) for minimum latency for Indian audiences.
- **DNS Record Generator**: Live generation of SPF (`v=spf1 include:amazonses.com ~all`), DKIM 2048-bit CNAME tokens, DMARC policies (`v=DMARC1; p=quarantine`), and MX records for `brainovision.in` / `mail.brainovision.in`.
- **Quota Telemetry**: SES send quota checker (`GET /api/domains/quota`) exposing daily limits and per-second sending speed limits.
- **Safe Development Simulator**: Automatic simulation mode when AWS credentials are not yet configured, preventing local crashes during development.

### 6. Redis + BullMQ High-Throughput Queue Engine (`server/src/queue/`)
- **Asynchronous Queue Pipeline**: High-throughput transmission queue built with `bullmq` and `ioredis`.
- **Rate Limiting & Concurrency**: Configured for 14 emails/second transmission rate (matching AWS SES production tier) with 5 parallel worker threads.
- **Job Retries & Exponential Backoff**: Automatic 3-attempt retry strategy with exponential delay on transient failures.
- **Idempotency Protection**: Pre-send check against `idempotency_records` table prevents duplicate campaign broadcasts.
- **Zero-Failure Local Fallback**: Built-in in-process asynchronous runner that seamlessly executes queued jobs locally when Redis is offline.

### 7. Campaign Management Engine (`server/src/modules/campaigns/`)
- **4-Step Campaign Wizard**: Streamlined flow covering Campaign Details, Audience List Selection, Template Selection, and Scheduling.
- **Batch Recipient Snapshotting**: Resolves list members into `campaign_recipients` records before dispatch.
- **Campaign State Machine**: Full lifecycle tracking (`Draft` -> `Preparing` -> `Sending` -> `Completed` / `Paused` / `Cancelled`).
- **Live Progress Telemetry**: Real-time delivery rates, open rates, click rates, and bounce percentages calculated dynamically from MySQL tables.

### 8. AWS SNS Event Tracking & Analytics Engine (`server/src/modules/analytics/`)
- **SNS Webhook Handler (`POST /api/webhooks/ses-events`)**:
  - Handles AWS SNS `SubscriptionConfirmation` requests automatically.
  - Ingests SES delivery, bounce, complaint, open, and click events.
  - Automatic Hard Bounce detection: writes directly to the `suppressions` table and updates contact status.
  - Automatic Spam Complaint handling: immediately suppresses the address to protect sender reputation.
- **Open Pixel Tracking (`GET /api/track/open/:campaignId/:recipientId`)**:
  - Serves a 1x1 transparent GIF with cache-busting headers (`no-store, no-cache`).
  - Records open timestamp and user agent in `email_events`.
  - Increments `opened_count` in the `campaigns` table.
- **Click Tracking Redirector (`GET /api/track/click/:campaignId/:recipientId`)**:
  - Logs recipient click activity in `email_events`.
  - Increments `clicked_count` on the campaign.
  - Safely redirects recipient to target destination via HTTP 302.

### 9. Suppression & Compliance Engine (`server/src/modules/suppressions/`)
- **RFC 8058 One-Click Unsubscribe**: Fully compliant implementation of modern email standards (required by Gmail and Yahoo):
  - HTTP POST endpoint: `POST /api/compliance/unsubscribe`
  - Web browser opt-out page: `GET /api/compliance/unsubscribe`
- **Zero-Emoji Compliance Confirmation Page**: Clean, branded HTML confirmation page styled with `Cambria Math` typography and frosted morphism.
- **Suppression Registry**: Global suppression database (`suppressions` table) preventing accidental sends to bounced, complained, or unsubscribed addresses.

### 10. Event-Driven Automation Engine (`server/src/modules/automations/`)
- **Automation Canvas (`server/src/modules/automations/automationEngine.js`)**:
  - Event triggers: `contact_signup`, `list_join`, `tag_added`, `campaign_event`.
  - Step execution pipeline: `trigger`, `email`, `delay`, `condition`, `tag`.
- **Execution Tracking**: Tracks contacts through sequences using `automation_executions` and `automation_execution_steps` tables.
- **Contact Signup Trigger**: Automatically fires welcome sequences whenever a new contact registers or is uploaded.

### 11. Developer REST API & Webhook Integrations (`server/src/api/v1/`)
- **API Key Security (`server/src/middleware/apiKeyAuth.js`)**:
  - Authenticates programmatic requests via `X-API-Key` or `Authorization: Bearer flw_live_...`.
  - SHA-256 hashed storage in `api_keys` table.
  - Key prefix tracking and last-used audit timestamps.
- **Public Developer REST API v1 (`/api/v1/`)**:
  - `POST /api/v1/emails/send`: Transmit single transactional emails with custom template tokens.
  - `POST /api/v1/contacts`: Programmatically create or update contacts.
  - `GET /api/v1/contacts`: Paginated contact search and listing.
  - `POST /api/v1/campaigns/:id/send`: Programmatically trigger campaign broadcasts.
- **Outbound Webhook Dispatcher (`server/src/utils/webhookDispatcher.js`)**:
  - Delivers real-time HTTP POST notifications on platform events (`campaign.completed`, `email.bounced`, `contact.unsubscribed`).
  - Signs payloads with HMAC SHA-256 (`X-FlowEM-Signature`).

---

## Project Structure

```text
flowemb/
├── package.json                         # Root package manager (runs client and server scripts)
├── README.md                            # Complete technical documentation
├── .gitignore                           # Git ignore rules for node_modules and env files
│
├── client/                              # FRONTEND APPLICATION (React 18 + Vite + TypeScript)
│   ├── package.json                     # Client dependencies (React, Lucide, Tailwind, Vite)
│   ├── index.html                       # HTML root with Cambria Math fonts
│   ├── vite.config.ts                   # Vite configuration with /api proxy to server:3001
│   ├── tsconfig.json                    # TypeScript strict compiler config
│   ├── tailwind.config.js               # Tailwind design tokens and custom utilities
│   ├── postcss.config.js                # PostCSS autoprefixer setup
│   └── src/
│       ├── main.tsx                     # React application entry point
│       ├── App.tsx                      # Root router (Landing Page vs Protected Dashboard)
│       ├── index.css                    # Morphic utilities, Cambria Math rules, light theme
│       ├── types/
│       │   └── index.ts                 # Strict TypeScript interfaces across all 11 modules
│       ├── data/
│       │   └── mockData.ts              # Clean initial data definitions (zero dummy entries)
│       ├── services/
│       │   └── api.ts                   # Unified API client with automatic token attachment
│       └── components/
│           ├── common/                  # MorphicCard, VisualChart, badges, buttons
│           ├── home/                    # LandingPage with interactive DNS deliverability tool
│           ├── layout/                  # DashboardLayout, persistent sidebar, navigation
│           └── dashboard/               # 11 Operational Modules (Overview, Contacts, Lists,
│                                        # Campaigns, Templates, Automation, Analytics,
│                                        # SenderConfig, Suppression, Organization, Users)
│
└── server/                              # BACKEND REST API & WORKERS (Node.js + Pure MySQL 8)
    ├── package.json                     # Backend dependencies (mysql2, express, bullmq, aws-sdk)
    ├── .env                             # Environment configuration (DATABASE_URL, JWT_SECRET, SES)
    ├── .env.example                     # Sample environment configuration template
    └── src/
        ├── app.js                       # Express application, CORS, cookies, API routes
        ├── server.js                    # Server bootstrap, MySQL connection test, graceful exit
        ├── config/
        │   ├── db.js                    # Pure MySQL 8 pool connection (mysql2/promise)
        │   ├── env.js                   # Environment variables loader with Zod validation
        │   └── logger.js                # Zero-emoji structured console logger
        ├── db/
        │   ├── schema.sql               # Pure MySQL 8 table definitions (CREATE TABLE IF NOT EXISTS)
        │   └── initDb.js                # Automated table creation and admin/org seeder
        ├── middleware/
        │   ├── apiKeyAuth.js            # Developer REST API key authentication
        │   ├── cookieParser.js          # Lightweight native cookie parser
        │   ├── errorHandler.js          # Centralized JSON error response handler (MySQL error codes)
        │   ├── requestLogger.js         # HTTP request telemetry logger
        │   └── validate.js              # Request body validation middleware
        ├── utils/
        │   ├── apiResponse.js           # Standardized API response wrappers
        │   ├── emailCompiler.js         # Dynamic token substitution, tracking pixel, CAN-SPAM footer
        │   ├── errors.js                # Custom application error classes
        │   └── webhookDispatcher.js     # HMAC SHA-256 outbound webhook delivery engine
        ├── integrations/
        │   └── aws/
        │       └── sesClient.js         # Amazon SES SDK client, domain verification, quota checker
        ├── queue/
        │   ├── connection.js            # Redis connection manager with clean fallback
        │   ├── queue.js                 # BullMQ queue runner with in-process memory queue
        │   ├── producers/
        │   │   └── emailProducer.js     # Bulk campaign and transactional email job enqueueing
        │   └── workers/
        │       └── emailProcessor.js    # Pre-send suppression verification, SES sending, metrics
        ├── api/
        │   └── v1/
        │       ├── v1.controller.js     # External programmatic API controller
        │       └── v1.routes.js         # Protected /api/v1 routes
        ├── modules/                     # 11 Core Functional Domains (contacts, lists, campaigns,
        │                                # templates, automations, domains, suppressions,
        │                                # organization, users, analytics, auth)
        └── routes/
            └── index.js                 # Master API route registry
```

---

## How to Run & Build

### 1. Configure MySQL 8 Database
FlowEM is pre-configured to connect to your local MySQL 8 database instance using the credentials in `server/.env` and `.env`:
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=MySQL@2026New
DB_NAME=flowem_db
DATABASE_URL="mysql://root:MySQL%402026New@127.0.0.1:3306/flowem_db"
```

To explicitly verify or initialize all 24 MySQL 8 tables and seed the Admin account at any time:
```bash
npm run db:init
```
*(Note: When you run `npm run dev` or `npm run dev:server`, FlowEM will also automatically create the `flowem_db` database and all 24 tables if they do not exist).*

### 2. Start Both Client and Server Together (from Root)
```bash
npm run dev
```
This runs `npm run dev:server` (API on port 3001) and `npm run dev:client` (Vite UI on port 5173) concurrently.

### 3. Or Run Independently

To run only the backend server:
```bash
npm run dev:server
# or
cd server && npm run dev
```
*(On boot, the server automatically initializes all MySQL 8 tables and seeds the admin user if not present).*

To run only the frontend client:
```bash
npm run dev:client
# or
cd client && npm run dev
```

To build the client for production:
```bash
npm run build
# or
cd client && npm run build
```

---

## Admin Credentials

- **Email**: `admin@brainovision.in`
- **Password**: `Admin@Flowem2026!`

---

## Verification & Quality Assurance Summary

- **Separated Folders**: Cleanly isolated `client/` (UI) and `server/` (API & workers).
- **Pure MySQL 8**: Strictly zero Prisma and zero SQLite. Database persistence is handled directly by `mysql2/promise` with automatic schema initialization via [schema.sql](file:///c:/Users/user2/Downloads/company%20Projects/company%20Projects/flowemb/server/src/db/schema.sql) and [initDb.js](file:///c:/Users/user2/Downloads/company%20Projects/company%20Projects/flowemb/server/src/db/initDb.js).
- **Zero Docker**: Runs natively with standard Node.js runtime and MySQL 8.
- **Zero Emojis**: Automated regex scan across all project files confirmed **0 emoji unicode characters** in code, templates, copy, and documentation.
- **Type Safety**: Full TypeScript compilation in `client/` passes cleanly (`npm run build` exits with code 0).
- **Single Admin Hardening**: Public self-registration and invitations blocked; sensitive operational routes protected by JWT HTTP-only cookies.
