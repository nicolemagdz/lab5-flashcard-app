const express = require('express');
const deckRoutes = require('./deck.routes');
const cardRoutes = require('./card.routes');

const router = express.Router();

// Deck CRUD + nested card/session creation & retrieval
router.use('/decks', deckRoutes);

// Direct card-by-id operations (get/update/delete a single card)
router.use('/cards', cardRoutes);

module.exports = router;
