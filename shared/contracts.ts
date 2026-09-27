// /shared/contracts.ts
//
// Shared TypeScript contracts for the Flashcard Study App.
// Single source of truth between frontend and backend.
// All timestamps are ISO 8601 strings (e.g. "2026-09-25T14:30:00.000Z").

export type ISODateString = string;
export type ReviewRating = "again" | "hard" | "good" | "easy";
export type SessionStatus = "in_progress" | "completed" | "abandoned";

/**
 * ADDED: standard response envelope. The TS controllers already assumed
 * this existed in @flashcard/shared — it did not. Every controller
 * response (success or error) should be shaped as ApiResponse<T>.
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: unknown;
  };
}

export interface DeckContract {
  readonly id: string;
  readonly ownerId: string;
  name: string;
  description?: string;
  tags: string[];
  cardCount: number;
  isArchived: boolean;
  readonly createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CardContract {
  readonly id: string;
  readonly deckId: string;
  front: string;
  back: string;
  hint?: string;
  srs: {
    easeFactor: number;
    intervalDays: number;
    repetitions: number;
    dueAt: ISODateString;
  };
  readonly createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CardReviewContract {
  readonly cardId: string;
  rating: ReviewRating;
  timeSpentMs: number;
  reviewedAt: ISODateString;
}

export interface StudySessionContract {
  readonly id: string;
  readonly userId: string;
  readonly deckId: string;
  status: SessionStatus;
  reviews: CardReviewContract[];
  cardsStudied: number;
  cardsCorrect: number;
  readonly startedAt: ISODateString;
  completedAt?: ISODateString;
}

// AUTH INPUTS
export interface LoginUserInput {
  email: string;
  password: string;
}

export interface RegisterUserInput {
  email: string;
  password: string;
  name: string;
}

// AUTH RESPONSE
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    createdAt: string;
  };
}


// API FAILURE (backend expects this)
export interface ApiFailure {
  success: false;
  error: {
    message: string;
    code: string;
    details?: unknown;
  };
}

// DECK DTOs
export interface CreateDeckInput {
  title: string;
  description?: string;
}

export interface UpdateDeckInput {
  name?: string;
  description?: string;
  tags?: string[];
}

export interface DeckDTO {
  id: string;
  title: string;
  description?: string;
  ownerId: string;
  cardCount: number;
  createdAt: string;
  updatedAt: string;
}

// CARD DTOs
export interface CreateCardInput {
  deckId: string;
  front: string;
  back: string;
  hint?: string;
}

export interface UpdateCardInput {
  front?: string;
  back?: string;
  hint?: string;
}

export interface CardDTO {
  readonly id: string;
  readonly deckId: string;
  front: string;
  back: string;
  hint?: string;

  srs: {
    easeFactor: number;
    intervalDays: number;
    repetitions: number;
    dueAt: ISODateString;
  };

  readonly createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface UserDTO {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}



// REVIEW QUALITY (backend expects this name)
export type ReviewQuality = "again" | "hard" | "good" | "easy";
