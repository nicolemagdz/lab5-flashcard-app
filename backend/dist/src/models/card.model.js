"use strict";
// Data-access layer for Card.
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardModel = void 0;
const prisma_1 = require("../config/prisma");
exports.CardModel = {
    findManyByDeck(deckId) {
        return prisma_1.prisma.card.findMany({ where: { deckId }, orderBy: { createdAt: "asc" } });
    },
    findById(id) {
        return prisma_1.prisma.card.findUnique({ where: { id } });
    },
    findDue(params) {
        return prisma_1.prisma.card.findMany({
            where: {
                nextReviewAt: { lte: new Date() },
                deck: { ownerId: params.ownerId, ...(params.deckId ? { id: params.deckId } : {}) },
            },
            orderBy: { nextReviewAt: "asc" },
            take: params.limit,
        });
    },
    create(data) {
        return prisma_1.prisma.card.create({ data });
    },
    update(id, data) {
        return prisma_1.prisma.card.update({ where: { id }, data });
    },
    updateSchedule(id, data) {
        return prisma_1.prisma.card.update({ where: { id }, data });
    },
    remove(id) {
        return prisma_1.prisma.card.delete({ where: { id } });
    },
};
