const prisma = require('../lib/prisma');
const { ApiError } = require('../middleware/errorHandler');
const { getDeckById } = require('./deck.service');

async function listSessionsByDeck(deckId) {
  await getDeckById(deckId);
  return prisma.studySession.findMany({
    where: { deckId },
    orderBy: { timestamp: 'desc' },
  });
}

async function getSessionById(id) {
  const session = await prisma.studySession.findUnique({ where: { id } });
  if (!session) {
    throw new ApiError(404, `Study session ${id} not found`);
  }
  return session;
}

async function createSession(deckId, data) {
  await getDeckById(deckId);
  return prisma.studySession.create({
    data: { ...data, deckId },
  });
}

module.exports = {
  listSessionsByDeck,
  getSessionById,
  createSession,
};
