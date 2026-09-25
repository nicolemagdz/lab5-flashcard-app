const prisma = require('../lib/prisma');
const { ApiError } = require('../middleware/errorHandler');

const MAX_PAGE_SIZE = 100;
const DEFAULT_PAGE_SIZE = 50;

// One query instead of two: nesting the paginated `cards` selection inside
// the deck lookup does the "does this deck exist" check and the "fetch its
// cards" read in a single round trip to the query engine, and the nested
// take/skip caps the result size instead of returning every card.
async function listCardsByDeck(deckId, { skip = 0, take = DEFAULT_PAGE_SIZE } = {}) {
  const deck = await prisma.deck.findUnique({
    where: { id: deckId },
    select: {
      id: true,
      cards: {
        skip,
        take: Math.min(take, MAX_PAGE_SIZE),
        orderBy: { id: 'asc' },
      },
    },
  });
  if (!deck) {
    throw new ApiError(404, `Deck ${deckId} not found`);
  }
  return deck.cards;
}

async function getCardById(id) {
  const card = await prisma.card.findUnique({ where: { id } });
  if (!card) {
    throw new ApiError(404, `Card ${id} not found`);
  }
  return card;
}

// Relies on the deckId foreign key rather than a separate existence check:
// if deckId doesn't reference a real Deck, Prisma raises P2003 and we turn
// that into a precise 404, in one query instead of two.
async function createCard(deckId, data) {
  try {
    return await prisma.card.create({
      data: { ...data, deckId },
    });
  } catch (err) {
    if (err.code === 'P2003') {
      throw new ApiError(404, `Deck ${deckId} not found`);
    }
    throw err;
  }
}

async function updateCard(id, data) {
  try {
    return await prisma.card.update({ where: { id }, data });
  } catch (err) {
    if (err.code === 'P2025') {
      throw new ApiError(404, `Card ${id} not found`);
    }
    throw err;
  }
}

async function deleteCard(id) {
  try {
    await prisma.card.delete({ where: { id } });
  } catch (err) {
    if (err.code === 'P2025') {
      throw new ApiError(404, `Card ${id} not found`);
    }
    throw err;
  }
}

module.exports = {
  listCardsByDeck,
  getCardById,
  createCard,
  updateCard,
  deleteCard,
};