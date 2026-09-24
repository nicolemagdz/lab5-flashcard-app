const express = require('express');
const deckController = require('../controllers/deck.controller');
const cardController = require('../controllers/card.controller');
const studySessionController = require('../controllers/studySession.controller');

const router = express.Router();

router.get('/', deckController.getDecks);
router.post('/', deckController.createDeck);
router.get('/:id', deckController.getDeck);
router.patch('/:id', deckController.updateDeck);
router.delete('/:id', deckController.deleteDeck);

// Nested resources: cards and study sessions belong to a deck.
router.get('/:deckId/cards', cardController.getCardsForDeck);
router.post('/:deckId/cards', cardController.createCard);

router.get('/:deckId/sessions', studySessionController.getSessionsForDeck);
router.post('/:deckId/sessions', studySessionController.createSession);

module.exports = router;
