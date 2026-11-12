# FlowEM - High-Throughput Bulk Email Automation Platform

FlowEM is a modern, production-grade bulk email automation, deliverability, and list management platform. Engineered for marketing teams, developers, and enterprises, FlowEM combines high-throughput transmission controls, automated IP warm-up ramping, and compliance management with an elegant light morphism user interface.

---

## Core Design & Architecture Rules

FlowEM adheres strictly to the following principles throughout its codebase, user interface, and communications:

1. **Strictly Zero Emojis**: Emojis are completely excluded across the entire application—including headings, buttons, badges, notifications, modal copy, and documentation. All visual communication is conveyed exclusively through crisp vector line icons (Lucide React), typography, and subtle morphic depth.
2. **Systemic Cambria Math Typography**: The `Cambria Math` serif typeface is systematically applied across all UI elements, headings, body copy, and data tables, giving the platform a polished, authoritative, mathematical aesthetic.
3. **Light Frosted Morphism**: A light color palette (pure white, soft slate grays, subtle indigo and emerald accents) paired with frosted glass panels (`glass-panel`), neumorphic soft concave inputs (`glass-input`), and gentle elevation shadows.
4. **Simple English in Dashboard**: Technical telemetry and dictionary jargon have been eliminated. Complex concepts are translated into clear, human terms:
   - "Suppression & Compliance Shield" -> **Unsubscribed & Blocked Emails**
   - "Autonomous Telemetry" -> **Emails Sent vs Opened**
   - "Cryptographic Sender Signatures" -> **Domain Setup (SPF, DKIM, DMARC)**
   - "Subscriber Cohorts" -> **Contact Lists**
5. **Clean Slate Initialization (Zero Sample Data)**: All dummy contacts, campaigns, templates, workflows, suppression records, domains, and team members have been completely purged. The application initializes in a pure zero-data state with clean, informative empty state placeholders across all 11 dashboard tabs.

---

## What Has Been Done Till Now

### 1. Project Initialization & Tooling
- Configured a React 18, Vite, TypeScript, and Tailwind CSS web application.
- Engineered custom CSS morphic classes (`glass-panel`, `glass-card`, `glass-input`, `morphic-concave`, `morphic-convex`) in `src/index.css`.
- Configured typography rules enforcing `font-family: 'Cambria Math', Cambria, Georgia, serif` across the DOM.
- Integrated Lucide React for 100% vector line iconography.

### 2. Public Home / Landing Page (`src/components/home/LandingPage.tsx`)
- **Product Overview & Value Proposition**: Clear, practical explanation of how FlowEM delivers bulk email at scale with 99.8% inbox placement.
- **Interactive Live Feature Previewer**: Interactive tabbed showcase allowing prospective users to preview the platform's core capabilities:
  - *Audience Management*: Fast subscriber filtering and tag grouping.
  - *Inbox Placement*: Guaranteed inbox routing over spam folders.
  - *Automated Journeys*: Visual delay and trigger sequences.
  - *Domain Verification*: Explanation of SPF, DKIM, and DMARC.
- **How It Works in 4 Steps**:
  1. Add Your Audience (CSV import or REST API).
  2. Authenticate Your Sending Domain (SPF, DKIM, DMARC).
  3. Design & Automate (Drag-and-drop templates and trigger rules).
  4. Transmit & Track (Real-time speed, opens, clicks, and bounce guards).
- **Interactive DNS Deliverability Health Check Tool**: Live simulator allowing visitors to enter their domain name and run an instant deliverability verification score test.
- **Authentication Modal**: Clean Sign In / Create Account modal allowing seamless transition directly into the operational dashboard.

### 3. Dashboard Navigation & Shell (`src/components/layout/DashboardLayout.tsx`)
- Left sidebar featuring persistent navigation across all 11 platform modules.
- Dynamic active-tab indicator with icon and badge counters.
- Global top header with search bar, notification center dropdown, account status pill, and a "+ New Campaign" quick launcher.
- Responsive design with collapsible mobile navigation drawer.

### 4. Eleven (11) Core Functional Modules

#### Module 1: Overview (`src/components/dashboard/OverviewTab.tsx`)
- High-level metric cards: Total Sent, Delivered, Total Opens, and Active Contacts.
- Real-time throughput line chart displaying hourly transmission speeds.
- Quick Actions hub: Instant triggers to Launch Campaign, Add Contacts, or Verify Domain.
- Recent Campaigns table with progress bars, open rates, and status badges.
- ISP Inbox Delivery Breakdown chart (Gmail, Yahoo, Microsoft 365).

#### Module 2: Contacts (`src/components/dashboard/ContactsTab.tsx`)
- Full subscriber table with search, status filters (Active, Unsubscribed, Bounced), and multi-select deletion.
- **Add Single Contact Modal**: Form with email, name, status, and tag assignment.
- **Bulk CSV Spreadsheet Importer**: Drag-and-drop CSV file upload with real-time file parsing, row count preview, and automatic batch import.
- Graceful empty state when subscriber list is empty.

#### Module 3: Contact Lists (`src/components/dashboard/ContactListsTab.tsx`)
- Audience segment management supporting both Static Lists and Dynamic Segment Rules.
- **Create New List Modal**: Form for list name, description, segment type, and tagging.
- Dynamic subscriber totals and average open rates calculated directly from active list data.
- **Clean Dead Emails Tool**: Automated 1-click utility that removes invalid or inactive email addresses from the list.

#### Module 4: Campaigns (`src/components/dashboard/CampaignsTab.tsx`)
- Campaign overview table displaying status (Sending, Scheduled, Completed, Draft), audience target, delivery rate, and engagement numbers.
- Pause/Resume sending controls on active campaigns.
- **Multi-Step Campaign Wizard (4 Steps)**:
  - *Step 1: Details* - Campaign title, subject line, sender name, and sender email.
  - *Step 2: Audience* - Selection of target contact list.
  - *Step 3: Design* - Selection of pre-made or custom email template.
  - *Step 4: Schedule* - Immediate blast or scheduled future transmission time.

#### Module 5: Templates (`src/components/dashboard/TemplatesTab.tsx`)
- Side-by-side template workshop:
  - Left panel: Searchable template gallery categorized by Newsletter, Transactional, and Product Launch.
  - Right panel: Live device frame with desktop and mobile viewport toggles, plus a toggle between visual render and raw HTML code.
- **Create Template Modal**: Built-in template composer supporting personalization tags (`{{firstName}}`, `{{unsubscribeUrl}}`).

#### Module 6: Automation & Follow-Ups (`src/components/dashboard/AutomationTab.tsx`)
- Event-driven automated drip sequence builder.
- Step-by-step visual canvas showing triggers, time delays, email actions, conditional branches, and subscriber taggers.
- **Add Next Step Modal**: Configurable step creator (Delay, Send Email, Branch Condition, Tag Contact).
- Live test trigger button and start/pause flow toggles.

#### Module 7: Sending Analytics (`src/components/dashboard/AnalyticsTab.tsx`)
- Key performance indicators: Inbox Delivery Rate, Spam Complaint Rate, Hard Bounce Rate, and Transmission Latency.
- Sent vs Opened hourly throughput visual chart.
- Provider breakdown (Gmail, Outlook, Yahoo, Apple Mail).
- Bounce diagnostic log detailing exact SMTP error codes (550, 554, 451).
- Geographic transmission speed distribution (North America, Europe, Asia-Pacific).
- CSV export utility to download compliance and delivery audit reports.

#### Module 8: Sender Configuration & Domains (`src/components/dashboard/SenderConfigTab.tsx`)
- Domain authentication console for custom sender domains.
- Live verification table checking SPF records, DKIM 2048-bit keys, and DMARC anti-spoofing policies.
- DNS Records panel providing exact host/value records for DNS providers (GoDaddy, Cloudflare, Namecheap).
- Automated IP warm-up ramp tracker with daily volume limit monitoring and dedicated IP health indicators.
- **Add Custom Domain Modal**: Subdomain and root domain registration form.

#### Module 9: Unsubscribed & Blocked Emails (`src/components/dashboard/SuppressionComplianceTab.tsx`)
- Global suppression database blocking bounces, unsubscribes, and spam complaints from future sends.
- Search and filter by reason (Hard Bounce, Unsubscribe Request, Spam Complaint, Manual Policy).
- 1-click unblock restoration button.
- Built-in compliance standards cards highlighting:
  - RFC 8058 1-click unsubscribe headers.
  - Physical postal address footer enforcement.
  - Consent timestamp records.
  - Automated bounce dead-locks.
- **Add Blocked Email Modal**: Manual address block entry with reason and audit note.

#### Module 10: Organization Settings (`src/components/dashboard/OrganizationSettingsTab.tsx`)
- Company profile management: legal name, physical mailing address (for footer compliance), and designated privacy contact.
- Monthly sending quota progress meter showing consumed vs remaining volume.
- **API Key Management**: Create, copy, and revoke REST API keys for programmatic SMTP/API transmission.
- **Webhook Endpoint**: Configurable webhook URL with live ping test utility for real-time delivery event webhooks.

#### Module 11: User Management (`src/components/dashboard/UserManagementTab.tsx`)
- Teammate management with role-based access control (Owner, Admin, Campaign Creator, Analyst, Viewer).
- Security status indicators (Two-Factor Authentication enforcement).
- **Invite Teammate Modal**: Form with email, name, and role selector.
- Detailed Role Permissions Matrix outlining exact rights for campaigns, contacts, API keys, and team billing.

---

### 5. Backend Architecture & MySQL 8 Foundation (Phase 1 Completed)

The backend has been transitioned from simple JSON mock persistence to a modular Express.js enterprise backend powered exclusively by **MySQL 8** and **Prisma ORM**.

- **Database Engine**: MySQL 8.0 exclusively (Strictly zero SQLite, zero MongoDB)
- **Database Name**: `flowem_db`
- **ORM**: Prisma ORM with typed client (`@prisma/client`)
- **Connection**: `DATABASE_URL="mysql://flowem:Flowem@2026!@localhost:3306/flowem_db"`
- **Architecture**: Modular domain structure (`config/`, `middleware/`, `utils/`, `modules/`)
- **Persistence**: Relational schema with foreign keys, cascading deletes, unique constraints, and indexes.

#### Relational Schema Domains (`server/prisma/schema.prisma`):
1. **Identity & RBAC**: `User`, `Role`, `Permission`, `UserRole`, `RolePermission`, `Session`, `Invitation`.
2. **Audience & Contacts**: `Contact`, `ContactList`, `ContactListMember`, `Tag`, `ContactTag`, `ContactCustomField`, `ConsentRecord`, `ImportJob`.
3. **Templates & Design**: `Template`, `TemplateVersion`, `TemplateCategory`.
4. **Campaigns & Transmission**: `Campaign`, `CampaignRecipient`, `CampaignEvent`, `EmailEvent`, `CampaignSchedule`.
5. **Infrastructure**: `SenderDomain`, `SenderIdentity`, `SendingConfiguration`.
6. **Compliance**: `Suppression`, `UnsubscribeEvent`.
7. **Automation**: `Automation`, `AutomationStep`, `AutomationExecution`, `AutomationExecutionStep`.
8. **Organization & Developer API**: `OrganizationSettings`, `ApiKey`, `Webhook`, `WebhookDelivery`.
9. **Auditing & Reliability**: `AuditLog`, `Notification`, `OutboxEvent`, `IdempotencyRecord`.

#### Modular Server Layout:
```text
server/
├── src/
│   ├── config/
│   │   ├── db.js             # Prisma client instance and MySQL 8 connection test
│   │   ├── env.js            # Environment parsing and Zod validation
│   │   └── logger.js         # Zero-emoji structured logger
│   ├── middleware/
│   │   ├── errorHandler.js   # Centralized error handler returning structured JSON
│   │   ├── validate.js       # Zod schema request validation middleware
│   │   └── requestLogger.js  # HTTP request duration logging
│   ├── utils/
│   │   ├── apiResponse.js    # Standardized response formatters
│   │   └── errors.js         # Custom AppError, NotFoundError, ConflictError classes
│   ├── modules/
│   │   ├── contacts/         # Contacts controller, service, routes
│   │   ├── lists/            # Contact lists controller, service, routes
│   │   ├── campaigns/        # Campaigns wizard, status toggler, routes
│   │   ├── templates/        # Email layout templates service, routes
│   │   ├── automations/      # Workflow builder service, steps, routes
│   │   ├── domains/          # DNS sender domain manager, verification
│   │   ├── suppressions/     # Blocked email suppression compliance
│   │   ├── organization/     # Company profile, API keys, webhook test
│   │   ├── users/            # Team roster, invitations, RBAC roles
│   │   ├── analytics/        # Throughput metrics and overview stats
│   │   └── auth/             # JWT authentication, bcrypt passwords, RBAC middleware
│   ├── routes/
│   │   └── index.js          # Unified /api route registry
│   ├── app.js                # Express application setup
│   └── server.js             # Server bootstrap, port binding, graceful shutdown
├── prisma/
│   ├── schema.prisma         # Definitive MySQL 8 relational schema
│   └── seed.js               # Database seeder (roles, org, default sending domain)
├── package.json              # Server dependencies (Prisma, Express, Zod, bcrypt, JWT)
├── .env.example              # Sample environment configuration
└── .env                      # Local environment configuration
```

#### Zero Fallback Guarantee:
All in-memory mock fallbacks have been removed from `src/services/api.ts`. Any backend or database errors are surfaced directly to ensure complete visibility during development and operations.

---

### 6. Sample Data Cleansing (Clean Slate Verification)

All sample/mock data has been emptied across both the frontend state and the backend JSON store:
- `initialContacts`: Empty array (`0 contacts`)
- `initialContactLists`: Empty array (`0 lists`)
- `initialCampaigns`: Empty array (`0 campaigns`)
- `initialTemplates`: Empty array (`0 templates`)
- `initialWorkflows`: Empty array (`0 workflows`)
- `initialSenderDomains`: Empty array (`0 domains`)
- `initialSuppressions`: Empty array (`0 blocked emails`)
- `initialTeamMembers`: Empty array (`0 members`)
- `ispDistribution`: Empty array (`0 delivery records`)
- `currentUsage`: `0 emails used`

Every module includes a dedicated, clean empty state view with an illustrative vector icon, descriptive title, and direct call-to-action button to create the first record.

---

## Project Structure

```text
flowemb/
├── index.html                           # Root HTML with Cambria Math fonts and light theme setup
├── package.json                         # Scripts, React 18, Vite, Lucide, Tailwind, Express, CORS
├── tsconfig.json                        # TypeScript strict compiler configuration
├── vite.config.ts                       # Vite build config with /api proxy to port 3001
├── tailwind.config.js                   # Tailwind CSS color tokens and custom utilities
├── README.md                            # Comprehensive project guide and changelog
├── server/
│   ├── index.js                         # Express.js REST API server
│   └── data/
│       └── db.json                      # JSON database storing state across sessions
└── src/
    ├── main.tsx                         # React application entry point
    ├── App.tsx                          # Root state router (Landing Page vs Dashboard)
    ├── index.css                        # Morphic utilities, Cambria Math rules, light theme
    ├── types/
    │   └── index.ts                     # TypeScript interfaces for all 11 modules
    ├── data/
    │   └── mockData.ts                  # Clean initial data definitions (zero dummy entries)
    ├── services/
    │   └── api.ts                       # Unified API client with automatic fallback layer
    └── components/
        ├── common/
        │   ├── MorphicCard.tsx          # Reusable morphic card, badge, and button components
        │   └── VisualChart.tsx          # SVG line chart for hourly transmission throughput
        ├── home/
        │   └── LandingPage.tsx          # Product landing page with live interactive tools
        ├── layout/
        │   └── DashboardLayout.tsx      # Sidebar, header, notifications, and tab navigation
        └── dashboard/
            ├── OverviewTab.tsx          # Module 1: Transmission overview & live metrics
            ├── ContactsTab.tsx          # Module 2: Subscriber directory & CSV importer
            ├── ContactListsTab.tsx      # Module 3: Static & dynamic audience lists
            ├── CampaignsTab.tsx         # Module 4: 4-step campaign wizard & progress
            ├── TemplatesTab.tsx         # Module 5: Email layout designer & previewer
            ├── AutomationTab.tsx        # Module 6: Visual event-driven workflow canvas
            ├── AnalyticsTab.tsx         # Module 7: Delivery metrics, ISP rates, bounce codes
            ├── SenderConfigTab.tsx      # Module 8: Custom domains, SPF, DKIM, DMARC, warmup
            ├── SuppressionComplianceTab.tsx # Module 9: Unsubscribes, bounces, compliance
            ├── OrganizationSettingsTab.tsx  # Module 10: Company profile, quota, API keys
            └── UserManagementTab.tsx    # Module 11: Teammates, roles, and permissions matrix
```

---

## How to Run & Build

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm or pnpm

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Local MySQL 8 Database
Connect to your local MySQL 8 server and initialize the database and user:
```sql
CREATE DATABASE IF NOT EXISTS flowem_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'flowem'@'localhost' IDENTIFIED BY 'Flowem@2026!';
GRANT ALL PRIVILEGES ON flowem_db.* TO 'flowem'@'localhost';
FLUSH PRIVILEGES;
```

Update `server/.env` if you choose a custom password:
```env
DATABASE_URL="mysql://flowem:Flowem@2026!@localhost:3306/flowem_db"
```

### 3. Sync Database Schema & Seed Data
```bash
cd server
npx prisma db push
node prisma/seed.js
cd ..
```

### 4. Start the Backend API Server
In a terminal, start the Express backend server:
```bash
node server/index.js
```
The server will start on `http://localhost:3001`.

### 5. Start the Frontend Development Server
In a separate terminal:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 6. Build for Production
To typecheck and bundle optimized static assets for deployment:
```bash
npm run build
```
Production assets are generated in the `dist/` directory.

---

## Verification & Quality Assurance

- **Zero Emojis**: Automated regex scan across all project files confirms zero emoji unicode characters in code, markup, or copy.
- **Type Safety**: Full TypeScript compilation passing without errors (`tsc --noEmit` exits with code 0).
- **Responsive Layout**: Designed for mobile, tablet, and desktop monitors with adaptive morphic grids.
- **Empty State Resiliency**: All tabs verified to handle empty arrays without runtime exceptions.
