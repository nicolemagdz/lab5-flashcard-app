"use strict";
// @ts-nocheck
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSessionsByDeck = listSessionsByDeck;
exports.getSessionById = getSessionById;
exports.createSession = createSession;
const prisma_1 = __importDefault(require("../prisma"));
const ApiError_1 = require("../utils/ApiError");
const MAX_PAGE_SIZE = 100;
const DEFAULT_PAGE_SIZE = 50;
async function listSessionsByDeck(deckId, { skip = 0, take = DEFAULT_PAGE_SIZE } = {}) {
    const deck = await prisma_1.default.deck.findUnique({
        where: { id: deckId },
        select: {
            id: true,
            sessions: {
                skip,
                take: Math.min(take, MAX_PAGE_SIZE),
                orderBy: { timestamp: "desc" },
            },
        },
    });
    if (!deck) {
        throw new ApiError_1.ApiError(404, `Deck ${deckId} not found`);
    }
    return deck.sessions;
}
async function getSessionById(id) {
    const session = await prisma_1.default.studySession.findUnique({ where: { id } });
    if (!session) {
        throw new ApiError_1.ApiError(404, `Study session ${id} not found`);
    }
    return session;
}
async function createSession(deckId, data) {
    try {
        return await prisma_1.default.studySession.create({
            data: { ...data, deckId },
        });
    }
    catch (err) {
        if (err.code === "P2003") {
            throw new ApiError_1.ApiError(404, `Deck ${deckId} not found`);
        }
        throw err;
    }
}
