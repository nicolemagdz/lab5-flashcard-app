// Implements the SM-2 spaced-repetition scheduling algorithm.
// Kept isolated from card.service so the scheduling math is independently
// unit-testable and swappable (e.g. for a future FSRS implementation).

import type { ReviewQuality } from "../../../shared/contracts";

export interface SchedulingState {
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
}

export interface SchedulingResult {
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  dueAt: Date;
}

const MIN_EASE_FACTOR = 1.3;

/**
 * Given the card's current scheduling state and a 0-5 recall quality
 * grade, returns the next scheduling state per the SM-2 algorithm.
 */
export function scheduleNextReview(
  state: SchedulingState,
  quality: number
): SchedulingResult {
  let { easeFactor, intervalDays, repetitions } = state;

  // Update ease factor
  easeFactor =
    easeFactor +
    (0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02));

  if (easeFactor < 1.3) easeFactor = 1.3;

  // Update repetitions & interval
  if (quality < 2) {
    repetitions = 0;
    intervalDays = 1;
  } else {
    repetitions += 1;

    if (repetitions === 1) intervalDays = 1;
    else if (repetitions === 2) intervalDays = 6;
    else intervalDays = Math.round(intervalDays * easeFactor);
  }

  const dueAt = new Date();
  dueAt.setDate(dueAt.getDate() + intervalDays);

  return {
    easeFactor,
    intervalDays,
    repetitions,
    dueAt,
  };
}