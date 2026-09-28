"use strict";
// Data-access layer for StudySession (the review log).
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudySessionModel = void 0;
const prisma_1 = require("../config/prisma");
exports.StudySessionModel = {
    create(data) {
        return prisma_1.prisma.studySession.create({ data });
    },
    findRecentByCard(cardId, limit = 20) {
        return prisma_1.prisma.studySession.findMany({
            where: { cardId },
            orderBy: { reviewedAt: "desc" },
            take: limit,
        });
    },
};
