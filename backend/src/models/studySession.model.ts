// Data-access layer for StudySession (the review log).

import { prisma } from "../config/prisma";

export const StudySessionModel = {
  create(data: { cardId: string; quality: number }) {
    return prisma.studySession.create({ data });
  },

  findRecentByCard(cardId: string, limit = 20) {
    return prisma.studySession.findMany({
      where: { cardId },
      orderBy: { reviewedAt: "desc" },
      take: limit,
    });
  },
};
