"use strict";
// Data-access layer for Deck.
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeckModel = void 0;
const prisma_1 = require("../config/prisma");
exports.DeckModel = {
    findManyByOwner(ownerId) {
        return prisma_1.prisma.deck.findMany({
            where: { ownerId },
            include: { _count: { select: { cards: true } } },
            orderBy: { updatedAt: "desc" },
        });
    },
    findByIdForOwner(id, ownerId) {
        return prisma_1.prisma.deck.findFirst({
            where: { id, ownerId },
            include: { _count: { select: { cards: true } } },
        });
    },
    create(data) {
        return prisma_1.prisma.deck.create({ data });
    },
    update(id, data) {
        return prisma_1.prisma.deck.update({ where: { id }, data });
    },
    remove(id) {
        return prisma_1.prisma.deck.delete({ where: { id } });
    },
};
