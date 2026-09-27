import { Request, Response } from "express";
import type { ApiResponse, CardContract } from "../shared/contracts";
import { CardService } from "../services/card.service";
import { asyncHandler } from "../utils/asyncHandler";
import { toCardContract } from "../serializers";

// CHANGED: CardDTO -> CardContract, all results normalized via toCardContract().

export const listCardsInDeck = asyncHandler(async (req: Request, res: Response) => {
  const cards = await CardService.listByDeck(req.params.deckId, req.userId!);
  const response: ApiResponse<CardContract[]> = {
    success: true,
    data: cards.map(toCardContract),
  };
  res.json(response);
});

export const createCard = asyncHandler(async (req: Request, res: Response) => {
  const card = await CardService.create(req.params.deckId, req.userId!, req.body);
  const response: ApiResponse<CardContract> = { success: true, data: toCardContract(card) };
  res.status(201).json(response);
});

export const updateCard = asyncHandler(async (req: Request, res: Response) => {
  const card = await CardService.update(req.params.cardId, req.userId!, req.body);
  const response: ApiResponse<CardContract> = { success: true, data: toCardContract(card) };
  res.json(response);
});

export const deleteCard = asyncHandler(async (req: Request, res: Response) => {
  await CardService.remove(req.params.cardId, req.userId!);
  res.status(204).send();
});

export const getDueCards = asyncHandler(async (req: Request, res: Response) => {
  const { deckId, limit } = req.query as { deckId?: string; limit?: string };
  const cards = await CardService.getDue(req.userId!, deckId, limit ? Number(limit) : undefined);
  const response: ApiResponse<CardContract[]> = {
    success: true,
    data: cards.map(toCardContract),
  };
  res.json(response);
});

// REMOVED from this file: reviewCard.
// A card review is a StudySession event, not a card CRUD operation —
// see studySession.controller.ts. Keeping it here was how the session
// contract ended up with no producer at all (see chat notes).