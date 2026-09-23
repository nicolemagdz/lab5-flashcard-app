import { useState } from "react";
import type { CardDTO, ReviewQuality } from "@flashcard/shared";

interface FlashcardProps {
  card: CardDTO;
  onGrade: (quality: ReviewQuality) => void;
}

const GRADES: { quality: ReviewQuality; label: string }[] = [
  { quality: 0, label: "Blackout" },
  { quality: 2, label: "Hard" },
  { quality: 3, label: "Good" },
  { quality: 5, label: "Easy" },
];

// Flip-card UI for a single study rep. Grading calls straight through to
// the SM-2-backed /review endpoint via the parent's onGrade callback.
export function Flashcard({ card, onGrade }: FlashcardProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div>
      <p>{card.front}</p>
      {revealed ? (
        <>
          <p>{card.back}</p>
          <div>
            {GRADES.map((g) => (
              <button key={g.quality} onClick={() => onGrade(g.quality)}>
                {g.label}
              </button>
            ))}
          </div>
        </>
      ) : (
        <button onClick={() => setRevealed(true)}>Show answer</button>
      )}
    </div>
  );
}
