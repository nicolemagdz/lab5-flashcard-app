import { Request, Response } from "express";
import type { ApiResponse, StudySessionContract } from "../shared/contracts";
import { StudySessionService } from "../services/studySession.service";
import { asyncHandler } from "../utils/asyncHandler";
import { toStudySessionContract } from "../serializers";

// ADDED: this file previously exported ONLY reviewCard, which returned a
// CardContract. Nothing anywhere produced a StudySessionContract. These
// five endpoints are the minimum needed to actually satisfy the contract:
// start a session, log reviews against it, read it, list it, close it.
//
// ASSUMPTION: `StudySessionService` needs these methods added on the
// service layer (start/getById/listByDeck/appendReview/complete) —
// I don't have services/studySession.service.ts, so these calls are
// written to the shape the contract implies, not verified against
// existing service code.

// POST /decks/:deckId/sessions
export const startSession = asyncHandler(async (req: Request, res: Response) => {
  const session = await StudySessionService.start(req.params.deckId, req.userId!);
  const response: ApiResponse<StudySessionContract> = {
    success: true,
    data: toStudySessionContract(session),
  };
  res.status(201).json(response);
});

// GET /decks/:deckId/sessions
export const listSessionsForDeck = asyncHandler(async (req: Request, res: Response) => {
  const sessions = await StudySessionService.listByDeck(req.params.deckId, req.userId!);
  const response: ApiResponse<StudySessionContract[]> = {
    success: true,
    data: sessions.map(toStudySessionContract),
  };
  res.json(response);
});

// GET /sessions/:sessionId
export const getSession = asyncHandler(async (req: Request, res: Response) => {
  const session = await StudySessionService.getById(req.params.sessionId, req.userId!);
  const response: ApiResponse<StudySessionContract> = {
    success: true,
    data: toStudySessionContract(session),
  };
  res.json(response);
});

// POST /sessions/:sessionId/reviews
// Replaces the old reviewCard: a review both advances the card's SM-2
// schedule AND appends a CardReviewContract entry to the active session.
export const reviewCard = asyncHandler(async (req: Request, res: Response) => {
  const { cardId, rating, timeSpentMs } = req.body;
  const session = await StudySessionService.appendReview(
    req.params.sessionId,
    req.userId!,
    { cardId, rating, timeSpentMs }
  );
  const response: ApiResponse<StudySessionContract> = {
    success: true,
    data: toStudySessionContract(session),
  };
  res.json(response);
});

// PATCH /sessions/:sessionId/complete
export const completeSession = asyncHandler(async (req: Request, res: Response) => {
  const session = await StudySessionService.complete(req.params.sessionId, req.userId!);
  const response: ApiResponse<StudySessionContract> = {
    success: true,
    data: toStudySessionContract(session),
  };
  res.json(response);
});