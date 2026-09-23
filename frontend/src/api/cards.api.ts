import type { CardDTO, CreateCardInput, ReviewQuality, UpdateCardInput } from "@flashcard/shared";
import { apiClient, unwrap } from "./client";

export const cardsApi = {
  listInDeck: (deckId: string) => unwrap<CardDTO[]>(apiClient.get(`/decks/${deckId}/cards`)),
  create: (deckId: string, input: CreateCardInput) =>
    unwrap<CardDTO>(apiClient.post(`/decks/${deckId}/cards`, input)),
  update: (deckId: string, cardId: string, input: UpdateCardInput) =>
    unwrap<CardDTO>(apiClient.patch(`/decks/${deckId}/cards/${cardId}`, input)),
  remove: (deckId: string, cardId: string) => apiClient.delete(`/decks/${deckId}/cards/${cardId}`),
  getDue: (deckId?: string, limit?: number) =>
    unwrap<CardDTO[]>(apiClient.get("/study/due", { params: { deckId, limit } })),
  review: (deckId: string, cardId: string, quality: ReviewQuality) =>
    unwrap<CardDTO>(apiClient.post(`/decks/${deckId}/cards/${cardId}/review`, { quality })),
};
