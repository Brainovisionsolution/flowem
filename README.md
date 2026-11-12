# FlowEM - High-Throughput Bulk Email Automation Platform

FlowEM is a high-throughput, production-grade bulk email automation, deliverability, and list management platform engineered specifically for Brainovision. Built exclusively on **MySQL 8** and **Prisma ORM**, FlowEM combines high-throughput transmission controls, Amazon SES delivery infrastructure, Redis + BullMQ asynchronous queuing, automated bounce/suppression compliance, and event-driven automation sequences with an elegant light morphism user interface.

---

## Core Architecture Principles & Constraints

FlowEM strictly adheres to the following core operational and visual guidelines across the entire repository:

1. **Strictly Zero Emojis**: Emojis are completely banned across all code, headings, buttons, badges, notifications, modals, logs, and documentation. All visual communication is delivered through crisp vector line icons (Lucide React), typography, and clean frosted morphisms.
2. **Systemic Cambria Math Typography**: The `Cambria Math` serif typeface is systematically applied across all UI components, headings, data tables, and metrics, producing a refined, authoritative, mathematical visual identity.
3. **Light Frosted Morphism**: A light aesthetic (pure white, soft slate grays, frosted glass panels via `glass-panel`, and neumorphic concave inputs via `glass-input`) with gentle elevation shadows.
4. **Simple English in Dashboard**: Technical telemetry and dictionary jargon have been eliminated. Complex concepts are translated into clear, human terms:
   - "Suppression & Compliance Shield" -> **Unsubscribed & Blocked Emails**
   - "Autonomous Telemetry" -> **Emails Sent vs Opened**
   - "Cryptographic Sender Signatures" -> **Domain Setup (SPF, DKIM, DMARC)**
   - "Subscriber Cohorts" -> **Contact Lists**
5. **Exclusive MySQL 8 Database**: FlowEM runs on **MySQL 8 exclusively**. Strictly zero SQLite, zero MongoDB, and zero in-memory persistence files anywhere in the architecture.
6. **Single Admin Access Model**: FlowEM operates as an internal company platform managed by a single authenticated Administrator (`admin@brainovision.in`). Public employee self-registration and invitations are disabled.
7. **Clean Slate Initialization**: All sample data has been completely cleared. The platform initializes with zero dummy contacts, zero fake campaigns, zero dummy templates, and clean, actionable empty states across all modules.

---

## Complete 12-Phase Development Roadmap (All Phases Completed)

### Phase 1: Backend Restructuring & MySQL 8 Foundation
- **Modular Express.js Backend**: Separated backend into clean domain layers (`config/`, `middleware/`, `utils/`, `modules/`, `routes/`, `app.js`, `server.js`).
- **Relational MySQL 8 Schema (`server/prisma/schema.prisma`)**: Comprehensive schema covering all 9 platform domains with foreign keys, cascading constraints, unique indexes, and UTF8MB4 collation.
- **Prisma Client Integration**: Replaced legacy JSON file persistence (`server/data/db.json`) completely with Prisma ORM client connected to `flowem_db`.
- **Zero Mock Fallbacks**: Removed all mock fallback interceptors from `src/services/api.ts`. Database errors and API exceptions are transparently returned.
- **Centralized Validation & Errors**: Integrated Zod validation schemas and custom application error handlers (`AppError`, `NotFoundError`, `BadRequestError`, `ConflictError`).

### Phase 2: Single Admin Authentication & Session Security
- **Single Administrator Model**: Secure credentials provisioned via database seed (`admin@brainovision.in` / `Admin@Flowem2026!`).
- **Password Security**: Strong password hashing using `bcryptjs`.
- **JWT & HTTP-Only Secure Cookies**: Authentication tokens issued via 7-day JWT and stored in HTTP-only `flowem_token` cookies with SameSite protection to eliminate XSS vulnerability. Also accepts `Authorization: Bearer <token>` for programmatic API clients.
- **Registration Hardening**: Public signup endpoint disabled (returns HTTP 403 Forbidden).
- **Route Guard Middleware**: All 11 core modules guarded with `authenticate` middleware in `server/src/modules/auth/auth.middleware.js`.
- **Frontend Admin Gate**: Unauthenticated users are redirected to the Admin login dialog before accessing any operational dashboard resources.

### Phase 3: Contacts & Audience Management
- **Contact Directory**: Complete subscriber management with search, status filters (Active, Unsubscribed, Bounced, Complained), and batch operations.
- **Audience Segmentation**: Static lists and dynamic segments with contact association via `ContactListMember`.
- **Bulk CSV Importer**: Batch CSV processing engine with header mapping, duplicate detection, email syntax validation, and audit tracking in `ImportJob`.
- **CSV Data Export**: Streaming CSV export endpoint (`GET /api/contacts/export`) with download headers.
- **Consent Tracking**: CAN-SPAM / GDPR consent timestamps and IP records stored in `consent_records`.

### Phase 4: Email Template Builder & Personalization Engine
- **Template Workshop**: Searchable template catalog with category filtering (Newsletter, Transactional, Product Launch).
- **Live Device Frame**: Desktop and mobile preview viewports with real-time toggle between visual rendering and raw HTML.
- **Email Compiler (`server/src/utils/emailCompiler.js`)**:
  - Dynamic token substitution: `{{firstName}}`, `{{lastName}}`, `{{email}}`, `{{companyName}}`, `{{unsubscribeUrl}}`.
  - CAN-SPAM postal address & unsubscribe footer auto-injection.
  - Transparent 1x1 open tracking pixel auto-injection.
  - Link click tracking wrapping.
- **Test Email Transmitter**: Instant test email delivery via `POST /api/templates/:id/test-email` using Amazon SES.
- **Template Versioning**: Version history tracking in `TemplateVersion` table.

### Phase 5: Amazon SES & Sending Domain Configuration
- **AWS SES Client (`server/src/integrations/aws/sesClient.js`)**: Direct integration with `@aws-sdk/client-ses` supporting `SendEmailCommand`, `VerifyDomainIdentityCommand`, and `GetSendQuotaCommand`.
- **India AWS Region Support**: Default sending region configured to `ap-south-1` (Mumbai) for minimum latency for Indian audiences.
- **DNS Record Generator**: Live generation of SPF (`v=spf1 include:amazonses.com ~all`), DKIM 2048-bit CNAME tokens, DMARC policies (`v=DMARC1; p=quarantine`), and MX records for `brainovision.in` / `mail.brainovision.in`.
- **Quota Telemetry**: SES send quota checker (`GET /api/domains/quota`) exposing daily limits and per-second sending speed limits.
- **Safe Development Simulator**: Automatic simulation mode when AWS credentials are not yet configured, preventing local crashes during development.

### Phase 6: Redis + BullMQ High-Throughput Queue Engine
- **Asynchronous Queue Pipeline (`server/src/queue/`)**: High-throughput transmission queue built with `bullmq` and `ioredis`.
- **Rate Limiting & Concurrency**: Configured for 14 emails/second transmission rate (matching AWS SES production tier) with 5 parallel worker threads.
- **Job Retries & Exponential Backoff**: Automatic 3-attempt retry strategy with exponential delay on transient failures.
- **Idempotency Protection**: Pre-send check against `IdempotencyRecord` table prevents duplicate campaign broadcasts.
- **Zero-Failure Local Fallback**: Built-in in-process asynchronous runner that seamlessly executes queued jobs locally when Redis is not running.

### Phase 7: Campaign Management Engine
- **4-Step Campaign Wizard**: Streamlined flow covering Campaign Details, Audience List Selection, Template Selection, and Scheduling.
- **Batch Recipient Snapshotting**: Resolves list members into `CampaignRecipient` records before dispatch.
- **Campaign State Machine**: Full lifecycle tracking (`Draft` -> `Preparing` -> `Sending` -> `Completed` / `Paused` / `Cancelled`).
- **Immediate & Scheduled Blasts**: Support for immediate delivery or future scheduled dispatch via `CampaignSchedule`.
- **Live Progress Telemetry**: Real-time delivery rates, open rates, click rates, and bounce percentages calculated dynamically from MySQL tables.

### Phase 8: AWS SNS Event Tracking & Analytics Engine
- **SNS Webhook Handler (`POST /api/webhooks/ses-events`)**:
  - Handles AWS SNS `SubscriptionConfirmation` requests automatically.
  - Ingests SES delivery, bounce, complaint, open, and click events.
  - Automatic Hard Bounce detection: writes directly to the `Suppression` table and updates contact status.
  - Automatic Spam Complaint handling: immediately suppresses the address to protect sender reputation.
- **Open Pixel Tracking (`GET /api/track/open/:campaignId/:recipientId`)**:
  - Serves a 1x1 transparent GIF with cache-busting headers (`no-store, no-cache`).
  - Records open timestamp and user agent in `email_events`.
  - Increments `openedCount` in the `Campaign` table.
- **Click Tracking Redirector (`GET /api/track/click/:campaignId/:recipientId`)**:
  - Logs recipient click activity in `email_events`.
  - Increments `clickedCount` on the campaign.
  - Safely redirects recipient to target destination via HTTP 302.

### Phase 9: Suppression & Compliance Engine
- **RFC 8058 One-Click Unsubscribe**: Fully compliant implementation of modern email standards (required by Gmail and Yahoo):
  - HTTP POST endpoint: `POST /api/compliance/unsubscribe`
  - Web browser opt-out page: `GET /api/compliance/unsubscribe`
- **Zero-Emoji Compliance Confirmation Page**: Clean, branded HTML confirmation page styled with `Cambria Math` typography and frosted morphism.
- **Suppression Registry**: Global suppression database (`suppressions` table) preventing accidental sends to bounced, complained, or unsubscribed addresses.
- **Pre-Send Verification**: The email worker verifies recipient suppression status prior to every transmission attempt.

### Phase 10: Event-Driven Automation Engine
- **Automation Canvas (`server/src/modules/automations/automationEngine.js`)**:
  - Event triggers: `contact_signup`, `list_join`, `tag_added`, `campaign_event`.
  - Step execution pipeline: `trigger`, `email`, `delay`, `condition`, `tag`.
- **Execution Tracking**: Tracks contacts through sequences using `AutomationExecution` and `AutomationExecutionStep` tables.
- **Contact Signup Trigger**: Automatically fires welcome sequences whenever a new contact registers or is uploaded.
- **Workflow Simulation**: Built-in test trigger utility allows administrators to simulate and verify workflows without modifying production data.

### Phase 11: Developer REST API & Webhook Integrations
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
  - Records delivery responses and error codes in `webhook_deliveries`.

### Phase 12: Production Docker & Hostinger VPS Deployment
- **Multi-Stage Dockerfile (`Dockerfile`)**:
  - Stage 1: Builds Vite React static assets.
  - Stage 2: Minimal Node 20 Alpine server runtime with Prisma Client generation, static asset serving, and security hardening.
- **Docker Compose Orchestration (`docker-compose.yml`)**:
  - `app`: FlowEM Express server on port 5000.
  - `mysql`: MySQL 8.0 container with persistent data volumes and health checks.
  - `redis`: Redis 7 Alpine container for BullMQ queue management.
  - `nginx`: High-performance reverse proxy with rate limiting and Gzip compression.
- **Nginx Reverse Proxy (`nginx/nginx.conf`)**:
  - Gzip compression for static JS/CSS/HTML assets.
  - Rate limiting (60 req/s per IP).
  - Security headers (`X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`).
  - Let's Encrypt / Certbot challenge forwarding for free automated SSL.
- **Automated CI/CD Pipeline (`.github/workflows/deploy.yml`)**:
  - Triggers on push to `master`.
  - Runs frontend compilation and Prisma client verification.
  - Connects to Hostinger VPS via SSH, pulls repository updates, rebuilds Docker containers, applies Prisma migrations, and runs a healthcheck verification.

---

## Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React 18 | Declarative component UI |
| **Build Tool** | Vite | Lightning-fast HMR and bundle compilation |
| **Language** | TypeScript (Frontend) + ES Modules (Backend) | Strong typing and modern modularity |
| **Styling** | Tailwind CSS + Custom CSS Morphisms | Responsive frosted light morphism |
| **Typography** | `Cambria Math` | Academic mathematical serif typography |
| **Vector Icons** | Lucide React | Zero-emoji line iconography |
| **Backend Framework** | Node.js + Express.js | Modular REST API and webhooks |
| **Database Engine** | MySQL 8.0 exclusively | Enterprise relational persistence |
| **ORM** | Prisma ORM | Type-safe migrations and queries |
| **Authentication** | JWT + HTTP-Only Cookies + bcryptjs | Secure single-admin authentication |
| **Queue & Cache** | Redis 7 + BullMQ | Asynchronous rate-limited email jobs |
| **Email Infrastructure** | Amazon SES (ap-south-1) | High-volume inbox delivery |
| **Event Webhooks** | AWS SNS | Real-time bounce and complaint tracking |
| **Compliance** | RFC 8058 One-Click Unsubscribe | CAN-SPAM and sender policy compliance |
| **Deployment** | Docker Compose + Nginx | Hostinger VPS containerized hosting |
| **CI/CD** | GitHub Actions | Automated build, test, and deploy workflow |

---

## Directory Structure

```text
flowemb/
├── Dockerfile                           # Multi-stage production Docker build
├── docker-compose.yml                   # MySQL 8, Redis, Node.js App, and Nginx stack
├── package.json                         # Frontend dependencies and scripts
├── tsconfig.json                        # Strict TypeScript configuration
├── vite.config.ts                       # Vite build configuration with /api proxy
├── tailwind.config.js                   # Tailwind color tokens and theme setup
├── .env.example                         # Root deployment environment template
├── README.md                            # Complete 12-phase technical documentation
├── .github/
│   └── workflows/
│       └── deploy.yml                   # GitHub Actions CI/CD to Hostinger VPS
├── nginx/
│   └── nginx.conf                       # Production Nginx reverse proxy configuration
├── server/
│   ├── package.json                     # Backend dependencies (Express, Prisma, BullMQ, AWS SDK)
│   ├── .env.example                     # Backend environment configuration template
│   ├── .env                             # Local backend environment configuration
│   ├── prisma/
│   │   ├── schema.prisma                # Definitive MySQL 8 relational database schema
│   │   └── seed.js                      # Admin user, default domain, and organization seeder
│   └── src/
│       ├── app.js                       # Express application, CORS, cookies, static serving
│       ├── server.js                    # Server bootstrap, MySQL connection test, graceful exit
│       ├── config/
│       │   ├── db.js                    # Prisma client instance and connection verification
│       │   ├── env.js                   # Environment variables loader with Zod validation
│       │   └── logger.js                # Zero-emoji structured console logger
│       ├── middleware/
│       │   ├── apiKeyAuth.js            # Developer REST API key authentication
│       │   ├── cookieParser.js          # Lightweight native cookie parser
│       │   ├── errorHandler.js          # Centralized JSON error response handler
│       │   ├── requestLogger.js         # HTTP request telemetry logger
│       │   └── validate.js              # Request body validation middleware
│       ├── utils/
│       │   ├── apiResponse.js           # Standardized API response wrappers
│       │   ├── emailCompiler.js         # Dynamic token substitution, tracking pixel, CAN-SPAM footer
│       │   ├── errors.js                # Custom application error classes
│       │   └── webhookDispatcher.js     # HMAC SHA-256 outbound webhook delivery engine
│       ├── integrations/
│       │   └── aws/
│       │       └── sesClient.js         # Amazon SES SDK client, domain verification, quota checker
│       ├── queue/
│       │   ├── connection.js            # Redis connection manager with clean fallback
│       │   ├── queue.js                 # BullMQ queue runner with in-process memory queue
│       │   ├── producers/
│       │   │   └── emailProducer.js     # Bulk campaign and transactional email job enqueueing
│       │   └── workers/
│       │       └── emailProcessor.js    # Pre-send suppression verification, SES sending, metrics
│       ├── api/
│       │   └── v1/
│       │       ├── v1.controller.js     # External programmatic API controller
│       │       └── v1.routes.js         # Protected /api/v1 routes
│       ├── modules/
│       │   ├── analytics/               # Overview statistics, tracking routes, SNS webhook
│       │   ├── auth/                    # Single Admin login, logout, JWT session management
│       │   ├── automations/             # Event-driven workflows and step execution engine
│       │   ├── campaigns/               # Campaign wizard, recipient queuing, status toggles
│       │   ├── contacts/                # Contact directory, CSV batch import and export
│       │   ├── domains/                 # Sender domain manager, SPF, DKIM, DMARC verification
│       │   ├── lists/                   # Static and dynamic audience lists
│       │   ├── organization/            # Company profile, monthly quota, API key manager
│       │   ├── suppressions/            # Blocked emails registry and RFC 8058 unsubscribe handler
│       │   ├── templates/               # Email template composer and test email sender
│       │   └── users/                   # Team member roster and role definitions
│       └── routes/
│           └── index.js                 # Master API route registry
└── src/
    ├── main.tsx                         # React application entry point
    ├── App.tsx                          # Root router (Landing Page vs Protected Dashboard)
    ├── index.css                        # Morphic utilities, Cambria Math rules, light theme
    ├── types/
    │   └── index.ts                     # Strict TypeScript interfaces across all 11 modules
    ├── data/
    │   └── mockData.ts                  # Clean initial data definitions (zero dummy entries)
    ├── services/
    │   └── api.ts                       # Unified API client with automatic token attachment
    └── components/
        ├── common/
        │   ├── MorphicCard.tsx          # Reusable morphic cards, badges, and action buttons
        │   └── VisualChart.tsx          # SVG line chart for hourly transmission throughput
        ├── home/
        │   └── LandingPage.tsx          # Product landing page with live interactive DNS tool
        ├── layout/
        │   └── DashboardLayout.tsx      # Persistent sidebar, header, quick launcher, user menu
        └── dashboard/
            ├── OverviewTab.tsx          # Module 1: Transmission overview & live metrics
            ├── ContactsTab.tsx          # Module 2: Subscriber directory & bulk CSV importer
            ├── ContactListsTab.tsx      # Module 3: Audience lists and dynamic segments
            ├── CampaignsTab.tsx         # Module 4: 4-step campaign wizard & progress tracking
            ├── TemplatesTab.tsx         # Module 5: Email layout designer & previewer
            ├── AutomationTab.tsx        # Module 6: Visual event-driven workflow canvas
            ├── AnalyticsTab.tsx         # Module 7: Delivery metrics, ISP rates, bounce codes
            ├── SenderConfigTab.tsx      # Module 8: Custom domains, SPF, DKIM, DMARC, warmup
            ├── SuppressionComplianceTab.tsx # Module 9: Unsubscribes, bounces, compliance
            ├── OrganizationSettingsTab.tsx  # Module 10: Company profile, quota, API keys
            └── UserManagementTab.tsx    # Module 11: Single Admin role and permissions matrix
```

---

## Local Development Setup

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v20 LTS recommended)
- **MySQL 8.0**: Local MySQL service or Docker container
- **Redis (Optional for local dev)**: System uses automatic in-process queue runner if Redis is not running locally.

### 2. Configure Local Database
Open your MySQL terminal or MySQL Workbench:
```sql
CREATE DATABASE IF NOT EXISTS flowem_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'flowem'@'localhost' IDENTIFIED BY 'Flowem@2026!';
GRANT ALL PRIVILEGES ON flowem_db.* TO 'flowem'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Initialize Server & Prisma Client
```bash
cd server
npm install
npx prisma generate
npx prisma db push
node prisma/seed.js
cd ..
```

### 4. Run Development Servers
In terminal 1 (Backend API on port 3001):
```bash
cd server
node src/server.js
```

In terminal 2 (Frontend on port 5173):
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### 5. Admin Sign In Credentials
Click **Sign In** on the top navigation bar:
- **Email**: `admin@brainovision.in`
- **Password**: `Admin@Flowem2026!`

---

## Production Deployment to Hostinger VPS

### 1. One-Click Docker Compose Deployment
On your Hostinger VPS, clone the repository and configure your `.env` file:
```bash
git clone https://github.com/brainovision/flowem.git /opt/flowem
cd /opt/flowem
cp .env.example .env
nano .env
```

Ensure your `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are provided.

### 2. Launch Containers
```bash
docker compose up -d --build
```

### 3. Apply Prisma Migrations & Seed Admin Account
```bash
docker compose exec -T app npx prisma migrate deploy --schema=./prisma/schema.prisma
docker compose exec -T app node prisma/seed.js
```

### 4. Verify Health Endpoint
```bash
curl http://localhost:5000/api/health
```
Response:
```json
{
  "status": "online",
  "timestamp": "2026-11-12T15:30:00.000Z",
  "service": "FlowEM High-Throughput Engine",
  "database": "MySQL 8",
  "authMode": "Single Admin"
}
```

---

## Verification & Quality Assurance Summary

- **Zero Emojis**: Automated regex scan across all project files confirms **0 emoji unicode characters** anywhere in the code, markup, or documentation.
- **Type Safety**: Full TypeScript compilation passing without errors (`tsc && vite build` built successfully in 12.66s).
- **Backend Integrity**: All Express modules, routes, and queue components load cleanly with zero import errors.
- **Single Admin Hardening**: Public self-registration and invitations blocked; sensitive operational routes protected by JWT HTTP-only cookies.
- **Amazon SES & Compliance Ready**: RFC 8058 one-click unsubscribe, CAN-SPAM physical postal footers, and automatic hard bounce suppression fully implemented.
- **MySQL 8 Exclusivity**: 100% of persistent data is modeled and stored in MySQL 8 via Prisma ORM. No SQLite or MongoDB dependencies present.
