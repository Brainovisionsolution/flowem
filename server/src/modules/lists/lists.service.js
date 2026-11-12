import { prisma } from '../../config/db.js';

export const listsService = {
  async getAllLists() {
    const lists = await prisma.contactList.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { members: true }
        }
      }
    });

    return lists.map(l => ({
      id: l.id,
      name: l.name,
      description: l.description || '',
      contactCount: l._count.members,
      type: l.type,
      activeSubscribers: l._count.members,
      avgOpenRate: 0,
      createdAt: l.createdAt.toISOString().split('T')[0],
      updatedAt: 'Recently',
      tags: ['Audience']
    }));
  },

  async createList(data) {
    const list = await prisma.contactList.create({
      data: {
        name: data.name,
        description: data.description || '',
        type: data.type || 'Static',
        rulesJson: data.tags ? { tags: data.tags } : null
      }
    });

    return {
      id: list.id,
      name: list.name,
      description: list.description || '',
      contactCount: 0,
      type: list.type,
      activeSubscribers: 0,
      avgOpenRate: 0,
      createdAt: list.createdAt.toISOString().split('T')[0],
      updatedAt: 'Just now',
      tags: data.tags || ['Audience']
    };
  },

  async cleanList(id) {
    // Find suppressed or bounced contacts and remove them from list membership
    const suppressions = await prisma.suppression.findMany({
      select: { email: true }
    });
    const suppressedEmails = suppressions.map(s => s.email);

    let removed = 0;
    if (suppressedEmails.length > 0) {
      const result = await prisma.contactListMember.deleteMany({
        where: {
          listId: id,
          contact: {
            email: { in: suppressedEmails }
          }
        }
      });
      removed = result.count;
    }

    const list = await prisma.contactList.findUnique({
      where: { id },
      include: { _count: { select: { members: true } } }
    });

    return {
      success: true,
      removed,
      list: list ? {
        id: list.id,
        name: list.name,
        description: list.description || '',
        contactCount: list._count.members,
        type: list.type,
        activeSubscribers: list._count.members,
        avgOpenRate: 0,
        createdAt: list.createdAt.toISOString().split('T')[0],
        updatedAt: 'Just now',
        tags: ['Audience']
      } : null
    };
  }
};
