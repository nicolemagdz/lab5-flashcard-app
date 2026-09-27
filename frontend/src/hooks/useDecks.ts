import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { DeckDTO, CreateDeckInput } from "../../../shared/contracts";
import { decksApi } from "../api/decks.api";

const DECKS_KEY = ["decks"] as const;

export function useDecks() {
  const queryClient = useQueryClient();

  const decksQuery = useQuery<DeckDTO[]>({ queryKey: DECKS_KEY, queryFn: decksApi.list });

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
