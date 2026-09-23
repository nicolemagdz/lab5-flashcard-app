"use client"

import { useMemo, useState } from "react"
import type { CardContract } from "@/types/deck"
import styles from "./study-session.module.css"

interface StudySessionProps {
  deckId: string
  /** Cards to study in this session. */
  cards: CardContract[]
}

export function StudySession({ deckId, cards }: StudySessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answerShown, setAnswerShown] = useState(false)

  const total = cards.length
  const currentCard = cards[currentIndex]
  const isComplete = currentIndex >= total

  const progressLabel = useMemo(
    () => `Card ${Math.min(currentIndex + 1, total)} of ${total}`,
    [currentIndex, total],
  )

  function advance(wasCorrect: boolean) {
    if (wasCorrect) {
      setScore((prev) => prev + 1)
    }
    setAnswerShown(false)
    setCurrentIndex((prev) => prev + 1)
  }

  if (total === 0) {
    return (
      <section className={styles.session} aria-labelledby="study-empty-heading">
        <div className={styles.complete}>
          <h2 id="study-empty-heading" className={styles.completeTitle}>
            No cards to study
          </h2>
          <p className={styles.completeScore}>This deck doesn&apos;t have any cards yet.</p>
        </div>
      </section>
    )
  }

  if (isComplete) {
    return (
      <section className={styles.session} aria-labelledby="study-complete-heading">
        <div className={styles.complete} role="status">
          <h2 id="study-complete-heading" className={styles.completeTitle}>
            Session complete
          </h2>
          <p className={styles.completeScore}>
            You scored {score} out of {total}.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.session} aria-labelledby="study-heading">
      <h2 id="study-heading" className="sr-only">
        Studying deck {deckId}
      </h2>

      <header className={styles.header}>
        <span className={styles.progress}>{progressLabel}</span>
        <span className={styles.score} aria-live="polite">
          Score: {score}
        </span>
      </header>

      <article className={styles.card} aria-live="polite">
        <span className={styles.cardLabel}>Prompt</span>
        <p className={styles.cardText}>{currentCard.front}</p>

        {answerShown ? (
          <>
            <hr className={styles.divider} />
            <span className={styles.cardLabel}>Answer</span>
            <p className={styles.cardText}>{currentCard.back}</p>
          </>
        ) : null}
      </article>

      <div className={styles.controls}>
        {answerShown ? (
          <>
            <button
              type="button"
              className={`${styles.button} ${styles.incorrectButton}`}
              onClick={() => advance(false)}
              aria-label="Mark this card incorrect and go to the next card"
            >
              Incorrect
            </button>
            <button
              type="button"
              className={`${styles.button} ${styles.correctButton}`}
              onClick={() => advance(true)}
              aria-label="Mark this card correct and go to the next card"
            >
              Correct
            </button>
          </>
        ) : (
          <button
            type="button"
            className={`${styles.button} ${styles.primaryButton}`}
            onClick={() => setAnswerShown(true)}
            aria-label="Show the answer for the current card"
          >
            Show answer
          </button>
        )}
      </div>
    </section>
  )
}
