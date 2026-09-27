import { Request, Response } from "express";
import type { ApiResponse, DeckContract } from "../../../shared/contracts";
import { DeckService } from "../services/deck.service";
import { asyncHandler } from "../utils/asyncHandler";
import { toDeckContract } from "../serializers";

// CHANGED: DeckDTO -> DeckContract everywhere, and every service result
// is passed through toDeckContract() before it leaves the controller.

export const listDecks = asyncHandler(async (req: Request, res: Response) => {
  const decks = await DeckService.list(req.userId!);
  const response: ApiResponse<DeckContract[]> = {
    success: true,
    data: decks.map(toDeckContract),
  };
  res.json(response);
});

export const getDeck = asyncHandler(async (req: Request, res: Response) => {
  const deck = await DeckService.getOwned(req.params.deckId, req.userId!);
  const response: ApiResponse<DeckContract> = { success: true, data: toDeckContract(deck) };
  res.json(response);
});

export const createDeck = asyncHandler(async (req: Request, res: Response) => {
  const deck = await DeckService.create(req.userId!, req.body);
  const response: ApiResponse<DeckContract> = { success: true, data: toDeckContract(deck) };
  res.status(201).json(response);
});

export const updateDeck = asyncHandler(async (req: Request, res: Response) => {
  const deck = await DeckService.update(req.params.deckId, req.userId!, req.body);
  const response: ApiResponse<DeckContract> = { success: true, data: toDeckContract(deck) };
  res.json(response);
});

export const deleteDeck = asyncHandler(async (req: Request, res: Response) => {
  await DeckService.remove(req.params.deckId, req.userId!);
  res.status(204).send();
});