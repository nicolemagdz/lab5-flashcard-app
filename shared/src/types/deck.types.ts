/**
 * Deck domain contracts.
 */

export interface DeckDTO {
  id: string;
  title: string;
  description: string | null;
  ownerId: string;
  cardCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDeckInput {
  title: string;
  description?: string;
}

export interface UpdateDeckInput {
  title?: string;
  description?: string;
}
