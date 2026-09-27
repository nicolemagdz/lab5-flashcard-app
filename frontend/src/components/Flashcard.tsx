import { useState } from "react";
import type { CardDTO, ReviewQuality } from "../../../shared/contracts";

interface FlashcardProps {
  card: CardDTO;
  onGrade: (quality: ReviewQuality) => void;
}

const GRADES: { quality: ReviewQuality; label: string }[] = [
  { quality: "again", label: "Blackout" },
  { quality: "hard", label: "Hard" },
  { quality: "good", label: "Good" },
  { quality: "easy", label: "Easy" },
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
