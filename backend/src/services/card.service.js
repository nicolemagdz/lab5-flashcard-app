const prisma = require('../lib/prisma');
const { ApiError } = require('../middleware/errorHandler');
const { getDeckById } = require('./deck.service');

async function listCardsByDeck(deckId) {
  // Ensures a 404 on an unknown deck rather than silently returning [].
  await getDeckById(deckId);
  return prisma.card.findMany({
    where: { deckId },
    orderBy: { id: 'asc' },
  });
}

async function getCardById(id) {
  const card = await prisma.card.findUnique({ where: { id } });
  if (!card) {
    throw new ApiError(404, `Card ${id} not found`);
  }
  return card;
}

async function createCard(deckId, data) {
  await getDeckById(deckId);
  return prisma.card.create({
    data: { ...data, deckId },
  });
}

async function updateCard(id, data) {
  await getCardById(id);
  return prisma.card.update({ where: { id }, data });
}

async function deleteCard(id) {
  await getCardById(id);
  await prisma.card.delete({ where: { id } });
}

module.exports = {
  listCardsByDeck,
  getCardById,
  createCard,
  updateCard,
  deleteCard,
};
