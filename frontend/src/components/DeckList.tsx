import type { DeckDTO } from "@flashcard/shared";

interface DeckListProps {
  decks: DeckDTO[];
  onSelect: (deckId: string) => void;
  onDelete: (deckId: string) => void;
}

// Presentational only: receives data + callbacks as props, has no
// knowledge of React Query or the API layer. Keeps it trivially testable.
export function DeckList({ decks, onSelect, onDelete }: DeckListProps) {
  if (decks.length === 0) {
    return <p>No decks yet -- create one to get started.</p>;
  }

  return (
    <ul>
      {decks.map((deck) => (
        <li key={deck.id}>
          <button onClick={() => onSelect(deck.id)}>
            {deck.title} ({deck.cardCount} cards)
          </button>
          <button onClick={() => onDelete(deck.id)} aria-label={`Delete ${deck.title}`}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
