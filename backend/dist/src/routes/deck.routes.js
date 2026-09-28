"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deckRouter = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const deck_controller_1 = require("../controllers/deck.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const card_routes_1 = require("./card.routes");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.requireAuth);
const createDeckSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(200),
    description: zod_1.z.string().max(2000).optional(),
});
const updateDeckSchema = createDeckSchema.partial();
router.get("/", deck_controller_1.listDecks);
router.post("/", (0, validate_middleware_1.validate)(createDeckSchema), deck_controller_1.createDeck);
router.get("/:deckId", deck_controller_1.getDeck);
router.patch("/:deckId", (0, validate_middleware_1.validate)(updateDeckSchema), deck_controller_1.updateDeck);
router.delete("/:deckId", deck_controller_1.deleteDeck);
// Cards are nested under their owning deck: /api/v1/decks/:deckId/cards
router.use("/:deckId/cards", card_routes_1.cardRouter);
exports.deckRouter = router;
