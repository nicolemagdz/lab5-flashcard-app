import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ReviewQuality } from "@flashcard/shared";
import { cardsApi } from "../api/cards.api";
import { Flashcard } from "../components/Flashcard";

// Drives one study session: pulls due cards for this deck, shows the
// current one, and posts a grade (which advances SM-2 scheduling
// server-side) before moving to the next due card.
export function StudyPage() {
  const { deckId } = useParams<{ deckId: string }>();
  const queryClient = useQueryClient();

  const dueQuery = useQuery({
    queryKey: ["due-cards", deckId],
    queryFn: () => cardsApi.getDue(deckId),
    enabled: Boolean(deckId),
  });

  const reviewMutation = useMutation({
    mutationFn: ({ cardId, quality }: { cardId: string; quality: ReviewQuality }) =>
      cardsApi.review(deckId!, cardId, quality),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["due-cards", deckId] }),
  });

  if (dueQuery.isLoading) return <p>Loading due cards...</p>;

  const cards = dueQuery.data ?? [];
  const currentCard = cards[0];

  if (!currentCard) return <p>Nothing due right now -- nice work!</p>;

  return (
    <Flashcard
      card={currentCard}
      onGrade={(quality) => reviewMutation.mutate({ cardId: currentCard.id, quality })}
    />
  );
}
