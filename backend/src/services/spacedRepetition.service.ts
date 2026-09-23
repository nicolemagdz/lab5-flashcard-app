// Implements the SM-2 spaced-repetition scheduling algorithm.
// Kept isolated from card.service so the scheduling math is independently
// unit-testable and swappable (e.g. for a future FSRS implementation).

import type { ReviewQuality } from "@flashcard/shared";

export interface SchedulingState {
  easeFactor: number;
  interval: number;
  repetitions: number;
}

export interface SchedulingResult extends SchedulingState {
  nextReviewAt: Date;
}

const MIN_EASE_FACTOR = 1.3;

/**
 * Given the card's current scheduling state and a 0-5 recall quality
 * grade, returns the next scheduling state per the SM-2 algorithm.
 */
export function scheduleNextReview(
  state: SchedulingState,
  quality: ReviewQuality,
  now: Date = new Date()
): SchedulingResult {
  let { easeFactor, interval, repetitions } = state;

  if (quality < 3) {
    // Failed recall: reset repetitions, review again tomorrow.
    repetitions = 0;
    interval = 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) interval = 1;
    else if (repetitions === 2) interval = 6;
    else interval = Math.round(interval * easeFactor);
  }

  easeFactor = Math.max(
    MIN_EASE_FACTOR,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  const nextReviewAt = new Date(now);
  nextReviewAt.setDate(nextReviewAt.getDate() + interval);

  return { easeFactor, interval, repetitions, nextReviewAt };
}
