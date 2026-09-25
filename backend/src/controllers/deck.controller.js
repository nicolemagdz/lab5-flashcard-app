const { asyncHandler, ApiError } = require('../middleware/errorHandler');
const {
  deckCreateSchema,
  deckUpdateSchema,
  paginationQuerySchema,
  idParamSchema,
} = require('../validators/schemas');
const deckService = require('../services/deck.service');

const getDecks = asyncHandler(async (req, res) => {
  const parsed = paginationQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    throw new ApiError(400, 'Invalid pagination params', parsed.error.flatten());
  }
  const decks = await deckService.listDecks(parsed.data);
  res.status(200).json(decks);
});

const getDeck = asyncHandler(async (req, res) => {
  const { id } = idParamSchema.parse(req.params);
  const deck = await deckService.getDeckById(id);
  res.status(200).json(deck);
});

const createDeck = asyncHandler(async (req, res) => {
  const parsed = deckCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, 'Invalid deck payload', parsed.error.flatten());
  }
  const deck = await deckService.createDeck(parsed.data);
  res.status(201).json(deck);
});

const updateDeck = asyncHandler(async (req, res) => {
  const { id } = idParamSchema.parse(req.params);
  const parsed = deckUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, 'Invalid deck payload', parsed.error.flatten());
  }
  const deck = await deckService.updateDeck(id, parsed.data);
  res.status(200).json(deck);
});

const deleteDeck = asyncHandler(async (req, res) => {
  const { id } = idParamSchema.parse(req.params);
  await deckService.deleteDeck(id);
  res.status(204).send();
});

module.exports = { getDecks, getDeck, createDeck, updateDeck, deleteDeck };