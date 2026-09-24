const express = require('express');
const cardController = require('../controllers/card.controller');

const router = express.Router();

router.get('/:id', cardController.getCard);
router.patch('/:id', cardController.updateCard);
router.delete('/:id', cardController.deleteCard);

module.exports = router;
