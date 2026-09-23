import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateDeckInput } from "@flashcard/shared";
import { decksApi } from "../api/decks.api";

const DECKS_KEY = ["decks"] as const;

export function useDecks() {
  const queryClient = useQueryClient();

  const decksQuery = useQuery({ queryKey: DECKS_KEY, queryFn: decksApi.list });

  const createDeck = useMutation({
    mutationFn: (input: CreateDeckInput) => decksApi.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: DECKS_KEY }),
  });

  const deleteDeck = useMutation({
    mutationFn: (deckId: string) => decksApi.remove(deckId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: DECKS_KEY }),
  });

  return { ...decksQuery, createDeck, deleteDeck };
}
