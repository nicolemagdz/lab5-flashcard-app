/**
 * Card domain contracts.
 * easeFactor / interval / repetitions / nextReviewAt back the SM-2 style
 * spaced-repetition scheduling implemented in
 * backend/src/services/spacedRepetition.service.ts
 */

export interface CardDTO {
  id: string;
  deckId: string;
  front: string;
  back: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCardInput {
  front: string;
  back: string;
}

export interface UpdateCardInput {
  front?: string;
  back?: string;
}

/** 0-5 recall quality grade, as used by the SM-2 algorithm. */
export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5;

export interface ReviewCardInput {
  quality: ReviewQuality;
}
