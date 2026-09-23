import { Router } from "express";
import { z } from "zod";
import { createCard, deleteCard, listCardsInDeck, updateCard } from "../controllers/card.controller";
import { reviewCard } from "../controllers/studySession.controller";
import { validate } from "../middlewares/validate.middleware";

// mergeParams so this router can read :deckId when mounted under deck.routes.ts
const router = Router({ mergeParams: true });

const createCardSchema = z.object({
  front: z.string().min(1).max(2000),
  back: z.string().min(1).max(2000),
});
const updateCardSchema = createCardSchema.partial();
const reviewSchema = z.object({ quality: z.number().int().min(0).max(5) });

router.get("/", listCardsInDeck);
router.post("/", validate(createCardSchema), createCard);
router.patch("/:cardId", validate(updateCardSchema), updateCard);
router.delete("/:cardId", deleteCard);
router.post("/:cardId/review", validate(reviewSchema), reviewCard);

export const cardRouter = router;
