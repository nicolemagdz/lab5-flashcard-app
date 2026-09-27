import { Request, Response } from "express";
import type { ApiResponse, StudySessionContract } from "../../../shared/contracts";

import {
  listSessionsByDeck,
  getSessionById,
  createSession,
} from "../services/studySession.service";

import { asyncHandler } from "../utils/asyncHandler";
import { toStudySessionContract } from "../serializers";

// POST /decks/:deckId/sessions
export const startSession = asyncHandler(async (req: Request, res: Response) => {
  // Your service does NOT have a "start" method.
  // The closest equivalent is createSession(deckId, data)
  const session = await createSession(req.params.deckId, { userId: req.userId! });

  const response: ApiResponse<StudySessionContract> = {
    success: true,
    data: toStudySessionContract(session),
  };

  res.status(201).json(response);
});

// GET /decks/:deckId/sessions
export const listSessionsForDeck = asyncHandler(async (req: Request, res: Response) => {
  // Your service does NOT have "listByDeck"
  // It has listSessionsByDeck(deckId, opts)
  const sessions: any[] = await listSessionsByDeck(req.params.deckId);

  const response: ApiResponse<StudySessionContract[]> = {
    success: true,
    data: sessions.map(toStudySessionContract),
  };

  res.json(response);
});

// GET /sessions/:sessionId
export const getSession = asyncHandler(async (req: Request, res: Response) => {
  // Your service does NOT have "getById"
  // It has getSessionById(id)
  const session = await getSessionById(req.params.sessionId);

  const response: ApiResponse<StudySessionContract> = {
    success: true,
    data: toStudySessionContract(session),
  };

  res.json(response);
});

// POST /sessions/:sessionId/reviews
export const reviewCard = asyncHandler(async (_req: Request, res: Response) => {
  // Your service does NOT implement appendReview yet.
  // You must implement appendReview in studySession.service.ts
  throw new Error("appendReview() not implemented in studySession.service.ts");
});

// PATCH /sessions/:sessionId/complete
export const completeSession = asyncHandler(async (_req: Request, res: Response) => {
  // Your service does NOT implement complete() yet.
  // You must implement complete() in studySession.service.ts
  throw new Error("complete() not implemented in studySession.service.ts");
});
