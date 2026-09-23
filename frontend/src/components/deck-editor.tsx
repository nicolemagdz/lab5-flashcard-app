"use client"

import { useId, useState } from "react"
import styles from "./deck-editor.module.css"

/** A single flashcard being edited within a deck. */
export interface CardDraft {
  id: string
  front: string
  back: string
}

export interface DeckEditorProps {
  deckId: string
  /** Optional initial title, e.g. when editing an existing deck. */
  initialTitle?: string
  /** Optional initial cards, e.g. when editing an existing deck. */
  initialCards?: CardDraft[]
  /** Called with the current title and cards when the user saves. */
  onSave?: (deckId: string, payload: { title: string; cards: CardDraft[] }) => void
}

function createCard(): CardDraft {
  return {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `card-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    front: "",
    back: "",
  }
}

export function DeckEditor({ deckId, initialTitle = "", initialCards, onSave }: DeckEditorProps) {
  const [title, setTitle] = useState(initialTitle)
  const [cards, setCards] = useState<CardDraft[]>(() => initialCards ?? [createCard()])

  const titleId = useId()
  const cardsHeadingId = useId()

  function handleAddCard() {
    setCards((prev) => [...prev, createCard()])
  }

  function handleDeleteCard(id: string) {
    setCards((prev) => prev.filter((card) => card.id !== id))
  }

  function handleCardChange(id: string, field: "front" | "back", value: string) {
    setCards((prev) => prev.map((card) => (card.id === id ? { ...card, [field]: value } : card)))
  }

  function handleSave() {
    onSave?.(deckId, { title: title.trim(), cards })
  }

  const canSave = title.trim().length > 0 && cards.length > 0

  return (
    <section className={styles.editor} aria-label="Deck editor">
      <div className={styles.header}>
        <label className={styles.titleLabel} htmlFor={titleId}>
          Deck title
        </label>
        <input
          id={titleId}
          className={styles.titleInput}
          type="text"
          value={title}
          placeholder="e.g. Spanish Vocabulary"
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>

      <div className={styles.cardsHeader}>
        <h2 id={cardsHeadingId} className={styles.cardsTitle}>
          Cards ({cards.length})
        </h2>
        <button type="button" className={styles.addButton} onClick={handleAddCard}>
          Add card
        </button>
      </div>

      {cards.length === 0 ? (
        <p className={styles.empty}>No cards yet. Add your first card to get started.</p>
      ) : (
        <ul className={styles.list} aria-labelledby={cardsHeadingId}>
          {cards.map((card, index) => {
            const frontId = `${card.id}-front`
            const backId = `${card.id}-back`
            const position = index + 1
            return (
              <li key={card.id} className={styles.card}>
                <div className={styles.field}>
                  <label className={styles.fieldLabel} htmlFor={frontId}>
                    Front (card {position})
                  </label>
                  <input
                    id={frontId}
                    className={styles.input}
                    type="text"
                    value={card.front}
                    placeholder="Prompt"
                    onChange={(event) => handleCardChange(card.id, "front", event.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel} htmlFor={backId}>
                    Back (card {position})
                  </label>
                  <input
                    id={backId}
                    className={styles.input}
                    type="text"
                    value={card.back}
                    placeholder="Answer"
                    onChange={(event) => handleCardChange(card.id, "back", event.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => handleDeleteCard(card.id)}
                  aria-label={`Delete card ${position}`}
                >
                  Delete
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <div className={styles.footer}>
        <button type="button" className={styles.saveButton} onClick={handleSave} disabled={!canSave}>
          Save deck
        </button>
      </div>
    </section>
  )
}

export default DeckEditor
