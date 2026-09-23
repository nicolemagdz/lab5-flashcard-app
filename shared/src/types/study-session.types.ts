/**
 * Study session / review-log contracts.
 */

export interface StudySessionDTO {
  id: string;
  cardId: string;
  quality: number;
  reviewedAt: string;
}

export interface DueCardsQuery {
  deckId?: string;
  limit?: number;
}
