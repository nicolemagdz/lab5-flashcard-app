// Data-access layer for Deck.

import { prisma } from "../config/prisma";

export const DeckModel = {
  findManyByOwner(ownerId: string) {
    return prisma.deck.findMany({
      where: { ownerId },
      include: { _count: { select: { cards: true } } },
      orderBy: { updatedAt: "desc" },
    });
  },

  findByIdForOwner(id: string, ownerId: string) {
    return prisma.deck.findFirst({
      where: { id, ownerId },
      include: { _count: { select: { cards: true } } },
    });
  },

  create(data: { title: string; description?: string; ownerId: string }) {
    return prisma.deck.create({ data });
  },

  update(id: string, data: { title?: string; description?: string }) {
    return prisma.deck.update({ where: { id }, data });
  },

  remove(id: string) {
    return prisma.deck.delete({ where: { id } });
  },
};
