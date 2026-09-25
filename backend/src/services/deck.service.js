const prisma = require('../lib/prisma');
const { ApiError } = require('../middleware/errorHandler');

const MAX_PAGE_SIZE = 100;
const DEFAULT_PAGE_SIZE = 50;

// Paginated instead of unbounded: `take` is clamped so a client can't force
// a full-table scan/response by passing an arbitrarily large value.
async function listDecks({ skip = 0, take = DEFAULT_PAGE_SIZE } = {}) {
  return prisma.deck.findMany({
    orderBy: { title: 'asc' },
    skip,
    take: Math.min(take, MAX_PAGE_SIZE),
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

// Single atomic query: let Prisma's own "record to update not found" error
// (P2025) do the existence check, instead of a separate findUnique first.
// That removes a round trip and closes the check-then-act race window where
// the deck could be deleted between the check and the write.
async function updateDeck(id, data) {
  try {
    return await prisma.deck.update({ where: { id }, data });
  } catch (err) {
    if (err.code === 'P2025') {
      throw new ApiError(404, `Deck ${id} not found`);
    }
    throw err;
  }
}

async function deleteDeck(id) {
  try {
    // Cascades to Card and StudySession rows per the Prisma schema.
    await prisma.deck.delete({ where: { id } });
  } catch (err) {
    if (err.code === 'P2025') {
      throw new ApiError(404, `Deck ${id} not found`);
    }
    throw err;
  }
}

module.exports = {
  listDecks,
  getDeckById,
  createDeck,
  updateDeck,
  deleteDeck,
};