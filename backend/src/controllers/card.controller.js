const { asyncHandler, ApiError } = require('../middleware/errorHandler');
const {
  cardCreateSchema,
  cardUpdateSchema,
  idParamSchema,
  deckIdParamSchema,
} = require('../validators/schemas');
const cardService = require('../services/card.service');

// GET /decks/:deckId/cards
const getCardsForDeck = asyncHandler(async (req, res) => {
  const { deckId } = deckIdParamSchema.parse(req.params);
  const cards = await cardService.listCardsByDeck(deckId);
  res.status(200).json(cards);
});

// GET /cards/:id
const getCard = asyncHandler(async (req, res) => {
  const { id } = idParamSchema.parse(req.params);
  const card = await cardService.getCardById(id);
  res.status(200).json(card);
});

// POST /decks/:deckId/cards
const createCard = asyncHandler(async (req, res) => {
  const { deckId } = deckIdParamSchema.parse(req.params);
  const parsed = cardCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, 'Invalid card payload', parsed.error.flatten());
  }
  const card = await cardService.createCard(deckId, parsed.data);
  res.status(201).json(card);
});

// PATCH /cards/:id
const updateCard = asyncHandler(async (req, res) => {
  const { id } = idParamSchema.parse(req.params);
  const parsed = cardUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, 'Invalid card payload', parsed.error.flatten());
  }
  const card = await cardService.updateCard(id, parsed.data);
  res.status(200).json(card);
});

// DELETE /cards/:id
const deleteCard = asyncHandler(async (req, res) => {
  const { id } = idParamSchema.parse(req.params);
  await cardService.deleteCard(id);
  res.status(204).send();
});

module.exports = { getCardsForDeck, getCard, createCard, updateCard, deleteCard };
