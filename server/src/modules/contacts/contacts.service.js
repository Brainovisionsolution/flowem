import { prisma } from '../../config/db.js';

export const contactsService = {
  async getAllContacts(search = '') {
    const where = search ? {
      OR: [
        { email: { contains: search } },
        { firstName: { contains: search } },
        { lastName: { contains: search } }
      ]
    } : {};

    const contacts = await prisma.contact.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        listMembers: {
          include: { list: true }
        },
        tags: {
          include: { tag: true }
        }
      }
    });

    // Map Prisma models to the frontend Contact interface
    return contacts.map(c => ({
      id: c.id,
      email: c.email,
      firstName: c.firstName || '',
      lastName: c.lastName || '',
      status: c.status === 'Active' ? 'Subscribed' : c.status,
      lists: c.listMembers.map(lm => lm.list.name),
      engagementScore: 85,
      lastSentAt: 'Pending',
      createdAt: c.createdAt.toISOString().split('T')[0],
      deliveriesCount: 0,
      opensCount: 0,
      clicksCount: 0,
      tags: c.tags.map(t => t.tag.name)
    }));
  },

  async createContact(data) {
    // Check if contact already exists
    const existing = await prisma.contact.findUnique({
      where: { email: data.email }
    });

    if (existing) {
      return existing;
    }

    const contact = await prisma.contact.create({
      data: {
        email: data.email,
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        phone: data.phone || null,
        status: data.status === 'Subscribed' ? 'Active' : (data.status || 'Active'),
        source: data.source || 'Manual',
        consentGiven: true,
        consentDate: new Date()
      }
    });

    // Handle tag connections
    if (data.tags && Array.isArray(data.tags)) {
      for (const tagName of data.tags) {
        if (!tagName) continue;
        const tag = await prisma.tag.upsert({
          where: { name: tagName.trim() },
          create: { name: tagName.trim() },
          update: {}
        });
        await prisma.contactTag.create({
          data: {
            contactId: contact.id,
            tagId: tag.id
          }
        }).catch(() => {});
      }
    }

    return {
      id: contact.id,
      email: contact.email,
      firstName: contact.firstName,
      lastName: contact.lastName,
      status: 'Subscribed',
      lists: data.lists || ['General Audience'],
      engagementScore: 85,
      lastSentAt: 'Pending',
      createdAt: contact.createdAt.toISOString().split('T')[0],
      deliveriesCount: 0,
      opensCount: 0,
      clicksCount: 0,
      tags: data.tags || ['Customer']
    };
  },

  async deleteContact(id) {
    return await prisma.contact.delete({
      where: { id }
    });
  },

  async importBatch(items) {
    let imported = 0;
    let failed = 0;

    for (const item of items) {
      try {
        if (!item.email || !item.email.includes('@')) {
          failed++;
          continue;
        }

        await this.createContact({
          email: item.email.trim(),
          firstName: item.firstName || item.first_name || '',
          lastName: item.lastName || item.last_name || '',
          status: 'Active',
          tags: item.tags ? (Array.isArray(item.tags) ? item.tags : [item.tags]) : ['CSV Import']
        });
        imported++;
      } catch (err) {
        failed++;
      }
    }

    return { imported, failed, total: items.length };
  }
};
