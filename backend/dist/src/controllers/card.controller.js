"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDueCards = exports.deleteCard = exports.updateCard = exports.createCard = exports.listCardsInDeck = void 0;
const card_service_1 = require("../services/card.service");
const asyncHandler_1 = require("../utils/asyncHandler");
const serializers_1 = require("../serializers");
// CHANGED: CardDTO -> CardContract, all results normalized via toCardContract().
exports.listCardsInDeck = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const cards = await card_service_1.CardService.listByDeck(req.params.deckId, req.userId);
    const response = {
        success: true,
        data: cards.map(serializers_1.toCardContract),
    };
    res.json(response);
});
exports.createCard = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const card = await card_service_1.CardService.create(req.params.deckId, req.userId, req.body);
    const response = { success: true, data: (0, serializers_1.toCardContract)(card) };
    res.status(201).json(response);
});
exports.updateCard = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const card = await card_service_1.CardService.update(req.params.cardId, req.userId, req.body);
    const response = { success: true, data: (0, serializers_1.toCardContract)(card) };
    res.json(response);
});
exports.deleteCard = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await card_service_1.CardService.remove(req.params.cardId, req.userId);
    res.status(204).send();
});
exports.getDueCards = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { deckId, limit } = req.query;
    const cards = await card_service_1.CardService.getDue(req.userId, deckId, limit ? Number(limit) : undefined);
    const response = {
        success: true,
        data: cards.map(serializers_1.toCardContract),
    };
    res.json(response);
});
// REMOVED from this file: reviewCard.
// A card review is a StudySession event, not a card CRUD operation —
// see studySession.controller.ts. Keeping it here was how the session
// contract ended up with no producer at all (see chat notes).
