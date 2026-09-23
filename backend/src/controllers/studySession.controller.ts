import { Request, Response } from "express";
import type { ApiResponse, CardDTO } from "@flashcard/shared";
import { CardService } from "../services/card.service";
import { asyncHandler } from "../utils/asyncHandler";

// A "review" both records the StudySession log entry AND advances the
// card's SM-2 schedule -- see CardService.review / spacedRepetition.service.
export const reviewCard = asyncHandler(async (req: Request, res: Response) => {
  const { quality } = req.body;
  const card = await CardService.review(req.params.cardId, req.userId!, quality);
  const response: ApiResponse<CardDTO> = { success: true, data: card };
  res.json(response);
});
