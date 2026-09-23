import { Router } from "express";
import { z } from "zod";
import {
  createDeck,
  deleteDeck,
  getDeck,
  listDecks,
  updateDeck,
} from "../controllers/deck.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { cardRouter } from "./card.routes";

const router = Router();
router.use(requireAuth);

const createDeckSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
});
const updateDeckSchema = createDeckSchema.partial();

router.get("/", listDecks);
router.post("/", validate(createDeckSchema), createDeck);
router.get("/:deckId", getDeck);
router.patch("/:deckId", validate(updateDeckSchema), updateDeck);
router.delete("/:deckId", deleteDeck);

// Cards are nested under their owning deck: /api/v1/decks/:deckId/cards
router.use("/:deckId/cards", cardRouter);

export const deckRouter = router;
