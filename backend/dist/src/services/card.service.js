"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardService = void 0;
const card_model_1 = require("../models/card.model");
const studySession_model_1 = require("../models/studySession.model");
const deck_service_1 = require("./deck.service");
const spacedRepetition_service_1 = require("./spacedRepetition.service");
const ApiError_1 = require("../utils/ApiError");
// Convert ReviewQuality → numeric SM-2 quality
const qualityMap = {
    again: 0,
    hard: 1,
    good: 2,
    easy: 3,
};
function toCardDTO(card) {
    return {
        id: card.id,
        deckId: card.deckId,
        front: card.front,
        back: card.back,
        hint: card.hint ?? undefined,
        srs: {
            easeFactor: Number(card.easeFactor),
            intervalDays: Number(card.interval),
            repetitions: Number(card.repetitions),
            dueAt: card.nextReviewAt.toISOString(),
        },
        createdAt: card.createdAt.toISOString(),
        updatedAt: card.updatedAt.toISOString(),
    };
}
exports.CardService = {
    async listByDeck(deckId, ownerId) {
        await deck_service_1.DeckService.getOwned(deckId, ownerId);
        const cards = await card_model_1.CardModel.findManyByDeck(deckId);
        return cards.map(toCardDTO);
    },
    async create(deckId, ownerId, input) {
        await deck_service_1.DeckService.getOwned(deckId, ownerId);
        const card = await card_model_1.CardModel.create({ ...input, deckId });
        return toCardDTO(card);
    },
    async update(cardId, ownerId, input) {
        const card = await this.getOwnedOrThrow(cardId, ownerId);
        const updated = await card_model_1.CardModel.update(card.id, input);
        return toCardDTO(updated);
    },
    async remove(cardId, ownerId) {
        const card = await this.getOwnedOrThrow(cardId, ownerId);
        await card_model_1.CardModel.remove(card.id);
    },
    async getDue(ownerId, deckId, limit = 20) {
        const cards = await card_model_1.CardModel.findDue({ ownerId, deckId, limit });
        return cards.map(toCardDTO);
    },
    async review(cardId, ownerId, quality) {
        const card = await this.getOwnedOrThrow(cardId, ownerId);
        const result = (0, spacedRepetition_service_1.scheduleNextReview)({
            easeFactor: Number(card.easeFactor),
            intervalDays: Number(card.interval),
            repetitions: Number(card.repetitions),
        }, qualityMap[quality]);
        const updated = await card_model_1.CardModel.updateSchedule(card.id, {
            easeFactor: result.easeFactor,
            interval: result.intervalDays,
            repetitions: result.repetitions,
            nextReviewAt: result.dueAt,
        });
        await studySession_model_1.StudySessionModel.create({
            cardId: card.id,
            quality: qualityMap[quality], // FIXED
        });
        return toCardDTO(updated);
    },
    async getOwnedOrThrow(cardId, ownerId) {
        const card = await card_model_1.CardModel.findById(cardId);
        if (!card)
            throw ApiError_1.ApiError.notFound("Card not found");
        await deck_service_1.DeckService.getOwned(card.deckId, ownerId);
        return card;
    },
};
