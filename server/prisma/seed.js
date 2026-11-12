import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('[FlowEM Seed] Seeding MySQL 8 database...');

  // 1. Organization Settings
  const org = await prisma.organizationSettings.upsert({
    where: { id: 'default-org-settings' },
    update: {},
    create: {
      id: 'default-org-settings',
      companyName: 'Brainovision Solutions India Pvt Ltd',
      companyAddress: 'Hyderabad, Telangana, India',
      complianceContact: 'compliance@brainovision.in',
      timeZone: 'Asia/Kolkata',
      monthlyQuota: 100000,
      currentUsage: 0,
      planName: 'Enterprise High-Throughput',
      enforceTwoFactor: false
    }
  });
  console.log('[FlowEM Seed] Organization settings created:', org.companyName);

  // 2. Standard Roles
  const roles = [
    { name: 'Owner', description: 'Complete platform control and system administration', isSystem: true },
    { name: 'Admin', description: 'User, contact, campaign and configuration management', isSystem: true },
    { name: 'Campaign Creator', description: 'Create and manage email campaigns and templates', isSystem: true },
    { name: 'Analyst', description: 'View analytics, reports, and delivery logs', isSystem: true },
    { name: 'Viewer', description: 'Read-only access across the dashboard', isSystem: true }
  ];

  for (const r of roles) {
    await prisma.role.upsert({
      where: { name: r.name },
      update: { description: r.description },
      create: r
    });
  }
  console.log('[FlowEM Seed] 5 standard RBAC roles created.');

  // 3. Default Sender Domain
  await prisma.senderDomain.upsert({
    where: { subdomain: 'mail.brainovision.in' },
    update: {},
    create: {
      domain: 'brainovision.in',
      subdomain: 'mail.brainovision.in',
      status: 'Verified',
      spfStatus: 'Valid',
      dkimStatus: 'Valid',
      dmarcStatus: 'Valid',
      warmupStage: 'Stage 1 (Initial Warmup)',
      dailyQuotaLimit: 500,
      dailySentCount: 0,
      reputationScore: 100,
      verifiedAt: new Date()
    }
  });
  console.log('[FlowEM Seed] Sender domain mail.brainovision.in initialized.');

  console.log('[FlowEM Seed] Database seeding complete.');
}

main()
  .catch((e) => {
    console.error('[FlowEM Seed] Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
