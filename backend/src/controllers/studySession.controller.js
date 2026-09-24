const { asyncHandler, ApiError } = require('../middleware/errorHandler');
const {
  studySessionCreateSchema,
  deckIdParamSchema,
} = require('../validators/schemas');
const studySessionService = require('../services/studySession.service');

// GET /decks/:deckId/sessions
const getSessionsForDeck = asyncHandler(async (req, res) => {
  const { deckId } = deckIdParamSchema.parse(req.params);
  const sessions = await studySessionService.listSessionsByDeck(deckId);
  res.status(200).json(sessions);
});

// POST /decks/:deckId/sessions
const createSession = asyncHandler(async (req, res) => {
  const { deckId } = deckIdParamSchema.parse(req.params);
  const parsed = studySessionCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, 'Invalid study session payload', parsed.error.flatten());
  }
  const session = await studySessionService.createSession(deckId, parsed.data);
  res.status(201).json(session);
});

module.exports = { getSessionsForDeck, createSession };
