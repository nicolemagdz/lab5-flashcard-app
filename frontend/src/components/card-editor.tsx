"use client"

import { useId, useState, type FormEvent } from "react"
import type { CardContract } from "@/types/deck"
import styles from "./card-editor.module.css"

interface CardEditorProps {
  card: CardContract
  /** Called with the updated card when the user saves. */
  onSave: (card: CardContract) => void
}

export function CardEditor({ card, onSave }: CardEditorProps) {
  const [front, setFront] = useState(card.front)
  const [back, setBack] = useState(card.back)

  const frontId = useId()
  const backId = useId()

  const isUnchanged = front.trim() === card.front && back.trim() === card.back
  const isEmpty = front.trim() === "" || back.trim() === ""

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isEmpty) return
    onSave({ ...card, front: front.trim(), back: back.trim() })
  }

  return (
    <form className={styles.editor} onSubmit={handleSubmit} aria-label="Edit card">
      <div className={styles.field}>
        <label className={styles.label} htmlFor={frontId}>
          Front
        </label>
        <textarea
          id={frontId}
          className={styles.textarea}
          value={front}
          onChange={(event) => setFront(event.target.value)}
          placeholder="Question or prompt"
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor={backId}>
          Back
        </label>
        <textarea
          id={backId}
          className={styles.textarea}
          value={back}
          onChange={(event) => setBack(event.target.value)}
          placeholder="Answer"
          required
        />
      </div>

      <div className={styles.footer}>
        <button type="submit" className={styles.saveButton} disabled={isEmpty || isUnchanged}>
          Save card
        </button>
      </div>
    </form>
  )
}
