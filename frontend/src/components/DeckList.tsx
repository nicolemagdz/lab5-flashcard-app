// This is a merged file of the Claude DeckList and the v0 DeckList, to keep both architecture and UI
import type { DeckContract } from "@/types/deck";
import styles from "./deck-list-page.module.css";

export interface DeckListProps {
  decks: DeckContract[];
  onSelect: (deckId: string) => void;
  onDelete: (deckId: string) => void;
  onCreate: () => void;
}

function formatCardCount(count: number): string {
  return `${count} ${count === 1 ? "card" : "cards"}`;
}

// Presentational-only component: receives data + callbacks, no API or React Query knowledge.
export function DeckList({ decks, onSelect, onDelete, onCreate }: DeckListProps) {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Your Decks</h1>
          <p className={styles.subtitle}>Choose a deck to study or create a new one.</p>
        </div>

        <button
          type="button"
          className={styles.createButton}
          onClick={onCreate}
        >
          <span aria-hidden="true">+</span>
          Create Deck
        </button>
      </header>

      {decks.length === 0 ? (
        <p className={styles.empty}>
          You don&apos;t have any decks yet. Create your first deck to get started.
        </p>
      ) : (
        <ul className={styles.list} aria-label="Flashcard decks">
          {decks.map((deck) => (
            <li key={deck.id} className={styles.item}>
              <div className={styles.deckRow}>
                <button
                  type="button"
                  className={styles.deckButton}
                  onClick={() => onSelect(deck.id)}
                  aria-label={`Study ${deck.title}, ${formatCardCount(deck.cardCount)}`}
                >
                  <span className={styles.deckTitle}>{deck.title}</span>
                  {deck.description ? (
                    <span className={styles.deckDescription}>{deck.description}</span>
                  ) : null}
                  <span className={styles.deckMeta}>{formatCardCount(deck.cardCount)}</span>
                </button>

                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => onDelete(deck.id)}
                  aria-label={`Delete ${deck.title}`}
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
