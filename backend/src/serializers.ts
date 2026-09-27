// backend/src/serializers.ts
//
// Normalizes whatever the service/DB layer returns into the EXACT
// contract shape. Do not `res.json(serviceResult)` directly anywhere —
// always pass the result through one of these first. This is what
// actually enforces the contract; imports alone don't.
//
// NOTE: field names below (e.g. deck.userId vs deck.ownerId,
// deck._id vs deck.id) are my best guess based on common Mongo/Prisma
// conventions and the controller code you shared. I don't have
// deck.service.ts / card.service.ts / studySession.service.ts, so
// please diff the `??` fallback chains against your actual model
// fields — that's the one part of this I can't verify from what
// was uploaded.

import type {
  DeckContract,
  CardContract,
  StudySessionContract,
  CardReviewContract,
} from "../shared/contracts";

function toISOString(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return new Date(value).toISOString();
  throw new Error(`Expected a date-like value, got: ${String(value)}`);
}

export function toDeckContract(raw: any): DeckContract {
  return {
    id: String(raw.id ?? raw._id),
    ownerId: String(raw.ownerId ?? raw.userId),
    name: raw.name,
    description: raw.description ?? undefined,
    tags: raw.tags ?? [],
    cardCount: raw.cardCount ?? raw.cards?.length ?? 0,
    isArchived: raw.isArchived ?? false,
    createdAt: toISOString(raw.createdAt),
    updatedAt: toISOString(raw.updatedAt),
  };
}

export function toCardContract(raw: any): CardContract {
  return {
    id: String(raw.id ?? raw._id),
    deckId: String(raw.deckId),
    front: raw.front,
    back: raw.back,
    hint: raw.hint ?? undefined,
    srs: {
      easeFactor: raw.srs?.easeFactor ?? raw.easeFactor,
      intervalDays: raw.srs?.intervalDays ?? raw.intervalDays,
      repetitions: raw.srs?.repetitions ?? raw.repetitions,
      dueAt: toISOString(raw.srs?.dueAt ?? raw.dueAt),
    },
    createdAt: toISOString(raw.createdAt),
    updatedAt: toISOString(raw.updatedAt),
  };
}

function toCardReviewContract(raw: any): CardReviewContract {
  return {
    cardId: String(raw.cardId),
    rating: raw.rating,
    timeSpentMs: raw.timeSpentMs,
    reviewedAt: toISOString(raw.reviewedAt),
  };
}

export function toStudySessionContract(raw: any): StudySessionContract {
  return {
    id: String(raw.id ?? raw._id),
    userId: String(raw.userId ?? raw.ownerId),
    deckId: String(raw.deckId),
    status: raw.status,
    reviews: (raw.reviews ?? []).map(toCardReviewContract),
    cardsStudied: raw.cardsStudied ?? raw.reviews?.length ?? 0,
    cardsCorrect:
      raw.cardsCorrect ??
      (raw.reviews ?? []).filter((r: any) => r.rating === "good" || r.rating === "easy").length,
    startedAt: toISOString(raw.startedAt),
    completedAt: raw.completedAt ? toISOString(raw.completedAt) : undefined,
  };
}