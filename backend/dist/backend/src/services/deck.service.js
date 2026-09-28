"use strict";
// Business logic for Deck CRUD + ownership checks.
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeckService = void 0;
const deck_model_1 = require("../models/deck.model");
const ApiError_1 = require("../utils/ApiError");
function toDeckDTO(deck) {
    return {
        id: deck.id,
        title: deck.title,
        description: deck.description,
        ownerId: deck.ownerId,
        cardCount: deck._count?.cards ?? 0,
        createdAt: deck.createdAt.toISOString(),
        updatedAt: deck.updatedAt.toISOString(),
    };
}
exports.DeckService = {
    async list(ownerId) {
        const decks = await deck_model_1.DeckModel.findManyByOwner(ownerId);
        return decks.map(toDeckDTO);
    },
    async getOwned(deckId, ownerId) {
        const deck = await deck_model_1.DeckModel.findByIdForOwner(deckId, ownerId);
        if (!deck)
            throw ApiError_1.ApiError.notFound("Deck not found");
        return toDeckDTO(deck);
    },
    async create(ownerId, input) {
        const deck = await deck_model_1.DeckModel.create({ ...input, ownerId });
        return toDeckDTO({ ...deck, _count: { cards: 0 } });
    },
    async update(deckId, ownerId, input) {
        await this.getOwned(deckId, ownerId); // throws 404 if not owned
        const deck = await deck_model_1.DeckModel.update(deckId, input);
        return toDeckDTO({ ...deck, _count: { cards: 0 } });
    },
    async remove(deckId, ownerId) {
        await this.getOwned(deckId, ownerId);
        await deck_model_1.DeckModel.remove(deckId);
    },
};
