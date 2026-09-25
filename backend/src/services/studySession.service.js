const prisma = require('../lib/prisma');
const { ApiError } = require('../middleware/errorHandler');

const MAX_PAGE_SIZE = 100;
const DEFAULT_PAGE_SIZE = 50;

// Same fix as listCardsByDeck: one nested, paginated query instead of an
// existence check followed by a separate unbounded findMany.
async function listSessionsByDeck(deckId, { skip = 0, take = DEFAULT_PAGE_SIZE } = {}) {
  const deck = await prisma.deck.findUnique({
    where: { id: deckId },
    select: {
      id: true,
      sessions: {
        skip,
        take: Math.min(take, MAX_PAGE_SIZE),
        orderBy: { timestamp: 'desc' },
      },
    },
  });
  if (!deck) {
    throw new ApiError(404, `Deck ${deckId} not found`);
  }
  return deck.sessions;
}

async function getSessionById(id) {
  const session = await prisma.studySession.findUnique({ where: { id } });
  if (!session) {
    throw new ApiError(404, `Study session ${id} not found`);
  }
  return session;
}

// Relies on the deckId foreign key instead of a preceding existence check —
// P2003 on a bad deckId becomes a precise 404 in a single query.
async function createSession(deckId, data) {
  try {
    return await prisma.studySession.create({
      data: { ...data, deckId },
    });
  } catch (err) {
    if (err.code === 'P2003') {
      throw new ApiError(404, `Deck ${deckId} not found`);
    }
    throw err;
  }
}

module.exports = {
  listSessionsByDeck,
  getSessionById,
  createSession,
};