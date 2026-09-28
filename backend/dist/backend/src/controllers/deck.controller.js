"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDeck = exports.updateDeck = exports.createDeck = exports.getDeck = exports.listDecks = void 0;
const deck_service_1 = require("../services/deck.service");
const asyncHandler_1 = require("../utils/asyncHandler");
const serializers_1 = require("../serializers");
// CHANGED: DeckDTO -> DeckContract everywhere, and every service result
// is passed through toDeckContract() before it leaves the controller.
exports.listDecks = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const decks = await deck_service_1.DeckService.list(req.userId);
    const response = {
        success: true,
        data: decks.map(serializers_1.toDeckContract),
    };
    res.json(response);
});
exports.getDeck = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const deck = await deck_service_1.DeckService.getOwned(req.params.deckId, req.userId);
    const response = { success: true, data: (0, serializers_1.toDeckContract)(deck) };
    res.json(response);
});
exports.createDeck = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const deck = await deck_service_1.DeckService.create(req.userId, req.body);
    const response = { success: true, data: (0, serializers_1.toDeckContract)(deck) };
    res.status(201).json(response);
});
exports.updateDeck = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const deck = await deck_service_1.DeckService.update(req.params.deckId, req.userId, req.body);
    const response = { success: true, data: (0, serializers_1.toDeckContract)(deck) };
    res.json(response);
});
exports.deleteDeck = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await deck_service_1.DeckService.remove(req.params.deckId, req.userId);
    res.status(204).send();
});
