// Data-access layer for Card.

import { prisma } from "../config/prisma";

export const CardModel = {
  findManyByDeck(deckId: string) {
    return prisma.card.findMany({ where: { deckId }, orderBy: { createdAt: "asc" } });
  },

  findById(id: string) {
    return prisma.card.findUnique({ where: { id } });
  },

  findDue(params: { ownerId: string; deckId?: string; limit: number }) {
    return prisma.card.findMany({
      where: {
        nextReviewAt: { lte: new Date() },
        deck: { ownerId: params.ownerId, ...(params.deckId ? { id: params.deckId } : {}) },
      },
      orderBy: { nextReviewAt: "asc" },
      take: params.limit,
    });
  },

  create(data: { front: string; back: string; deckId: string }) {
    return prisma.card.create({ data });
  },

  update(id: string, data: Partial<{ front: string; back: string }>) {
    return prisma.card.update({ where: { id }, data });
  },

  updateSchedule(
    id: string,
    data: { easeFactor: number; interval: number; repetitions: number; nextReviewAt: Date }
  ) {
    return prisma.card.update({ where: { id }, data });
  },

  remove(id: string) {
    return prisma.card.delete({ where: { id } });
  },
};
