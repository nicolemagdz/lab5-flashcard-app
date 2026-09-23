import { Request, Response } from "express";
import type { ApiResponse, CardDTO } from "@flashcard/shared";
import { CardService } from "../services/card.service";
import { asyncHandler } from "../utils/asyncHandler";

export const listCardsInDeck = asyncHandler(async (req: Request, res: Response) => {
  const cards = await CardService.listByDeck(req.params.deckId, req.userId!);
  const response: ApiResponse<CardDTO[]> = { success: true, data: cards };
  res.json(response);
});

export const createCard = asyncHandler(async (req: Request, res: Response) => {
  const card = await CardService.create(req.params.deckId, req.userId!, req.body);
  const response: ApiResponse<CardDTO> = { success: true, data: card };
  res.status(201).json(response);
});

export const updateCard = asyncHandler(async (req: Request, res: Response) => {
  const card = await CardService.update(req.params.cardId, req.userId!, req.body);
  const response: ApiResponse<CardDTO> = { success: true, data: card };
  res.json(response);
});

export const deleteCard = asyncHandler(async (req: Request, res: Response) => {
  await CardService.remove(req.params.cardId, req.userId!);
  res.status(204).send();
});

export const getDueCards = asyncHandler(async (req: Request, res: Response) => {
  const { deckId, limit } = req.query as { deckId?: string; limit?: string };
  const cards = await CardService.getDue(req.userId!, deckId, limit ? Number(limit) : undefined);
  const response: ApiResponse<CardDTO[]> = { success: true, data: cards };
  res.json(response);
});
