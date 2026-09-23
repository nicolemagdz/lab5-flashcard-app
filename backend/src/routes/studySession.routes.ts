import { Router } from "express";
import { getDueCards } from "../controllers/card.controller";
import { requireAuth } from "../middlewares/auth.middleware";

// Cross-deck study endpoints, e.g. "everything due today across all decks".
// Per-card review actions live on card.routes.ts (POST /:cardId/review)
// since they operate on a single, already-scoped card.
const router = Router();
router.use(requireAuth);

router.get("/due", getDueCards);

export const studySessionRouter = router;
