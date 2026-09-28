"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeSession = exports.reviewCard = exports.getSession = exports.listSessionsForDeck = exports.startSession = void 0;
const studySession_service_1 = require("../services/studySession.service");
const asyncHandler_1 = require("../utils/asyncHandler");
const serializers_1 = require("../serializers");
// POST /decks/:deckId/sessions
exports.startSession = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // Your service does NOT have a "start" method.
    // The closest equivalent is createSession(deckId, data)
    const session = await (0, studySession_service_1.createSession)(req.params.deckId, { userId: req.userId });
    const response = {
        success: true,
        data: (0, serializers_1.toStudySessionContract)(session),
    };
    res.status(201).json(response);
});
// GET /decks/:deckId/sessions
exports.listSessionsForDeck = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // Your service does NOT have "listByDeck"
    // It has listSessionsByDeck(deckId, opts)
    const sessions = await (0, studySession_service_1.listSessionsByDeck)(req.params.deckId);
    const response = {
        success: true,
        data: sessions.map(serializers_1.toStudySessionContract),
    };
    res.json(response);
});
// GET /sessions/:sessionId
exports.getSession = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // Your service does NOT have "getById"
    // It has getSessionById(id)
    const session = await (0, studySession_service_1.getSessionById)(req.params.sessionId);
    const response = {
        success: true,
        data: (0, serializers_1.toStudySessionContract)(session),
    };
    res.json(response);
});
// POST /sessions/:sessionId/reviews
exports.reviewCard = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    // Your service does NOT implement appendReview yet.
    // You must implement appendReview in studySession.service.ts
    throw new Error("appendReview() not implemented in studySession.service.ts");
});
// PATCH /sessions/:sessionId/complete
exports.completeSession = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    // Your service does NOT implement complete() yet.
    // You must implement complete() in studySession.service.ts
    throw new Error("complete() not implemented in studySession.service.ts");
});
