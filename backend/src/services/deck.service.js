const prisma = require('../lib/prisma');
const { ApiError } = require('../middleware/errorHandler');

async function listDecks() {
  return prisma.deck.findMany({
    orderBy: { title: 'asc' },
  });
}

async function getDeckById(id) {
  const deck = await prisma.deck.findUnique({ where: { id } });
  if (!deck) {
    throw new ApiError(404, `Deck ${id} not found`);
  }
  return deck;
}

async function createDeck(data) {
  return prisma.deck.create({ data });
}

async function updateDeck(id, data) {
  // Confirm existence first so we return a clean 404 instead of a Prisma P2025.
  await getDeckById(id);
  return prisma.deck.update({ where: { id }, data });
}

async function deleteDeck(id) {
  await getDeckById(id);
  // Cascades to Card and StudySession rows per the Prisma schema.
  await prisma.deck.delete({ where: { id } });
}

module.exports = {
  listDecks,
  getDeckById,
  createDeck,
  updateDeck,
  deleteDeck,
};
