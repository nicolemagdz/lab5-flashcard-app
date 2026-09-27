import prisma from "../prisma";
import { ApiError } from "../utils/ApiError";

const MAX_PAGE_SIZE = 100;
const DEFAULT_PAGE_SIZE = 50;

export async function listSessionsByDeck(
  deckId: string,
  { skip = 0, take = DEFAULT_PAGE_SIZE }: { skip?: number; take?: number } = {}
) {
  const deck = await prisma.deck.findUnique({
    where: { id: deckId },
    select: {
      id: true,
      sessions: {
        skip,
        take: Math.min(take, MAX_PAGE_SIZE),
        orderBy: { timestamp: "desc" },
      },
    },
  });

  if (!deck) {
    throw new ApiError(404, `Deck ${deckId} not found`);
  }

  return deck.sessions;
}

export async function getSessionById(id: string) {
  const session = await prisma.studySession.findUnique({ where: { id } });

  if (!session) {
    throw new ApiError(404, `Study session ${id} not found`);
  }

  return session;
}

export async function createSession(deckId: string, data: any) {
  try {
    return await prisma.studySession.create({
      data: { ...data, deckId },
    });
  } catch (err: any) {
    if (err.code === "P2003") {
      throw new ApiError(404, `Deck ${deckId} not found`);
    }
    throw err;
  }
}
