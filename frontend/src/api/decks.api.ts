import type { CreateDeckInput, DeckDTO, UpdateDeckInput } from "@flashcard/shared";
import { apiClient, unwrap } from "./client";

export const decksApi = {
  list: () => unwrap<DeckDTO[]>(apiClient.get("/decks")),
  get: (deckId: string) => unwrap<DeckDTO>(apiClient.get(`/decks/${deckId}`)),
  create: (input: CreateDeckInput) => unwrap<DeckDTO>(apiClient.post("/decks", input)),
  update: (deckId: string, input: UpdateDeckInput) =>
    unwrap<DeckDTO>(apiClient.patch(`/decks/${deckId}`, input)),
  remove: (deckId: string) => apiClient.delete(`/decks/${deckId}`),
};
