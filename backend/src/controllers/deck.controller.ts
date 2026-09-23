import { Request, Response } from "express";
import type { ApiResponse, DeckDTO } from "@flashcard/shared";
import { DeckService } from "../services/deck.service";
import { asyncHandler } from "../utils/asyncHandler";

export const listDecks = asyncHandler(async (req: Request, res: Response) => {
  const decks = await DeckService.list(req.userId!);
  const response: ApiResponse<DeckDTO[]> = { success: true, data: decks };
  res.json(response);
});

export const getDeck = asyncHandler(async (req: Request, res: Response) => {
  const deck = await DeckService.getOwned(req.params.deckId, req.userId!);
  const response: ApiResponse<DeckDTO> = { success: true, data: deck };
  res.json(response);
});

export const createDeck = asyncHandler(async (req: Request, res: Response) => {
  const deck = await DeckService.create(req.userId!, req.body);
  const response: ApiResponse<DeckDTO> = { success: true, data: deck };
  res.status(201).json(response);
});

export const updateDeck = asyncHandler(async (req: Request, res: Response) => {
  const deck = await DeckService.update(req.params.deckId, req.userId!, req.body);
  const response: ApiResponse<DeckDTO> = { success: true, data: deck };
  res.json(response);
});

export const deleteDeck = asyncHandler(async (req: Request, res: Response) => {
  await DeckService.remove(req.params.deckId, req.userId!);
  res.status(204).send();
});
