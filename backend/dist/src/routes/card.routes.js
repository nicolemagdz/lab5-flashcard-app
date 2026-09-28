"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardRouter = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const card_controller_1 = require("../controllers/card.controller");
const studySession_controller_1 = require("../controllers/studySession.controller");
const validate_middleware_1 = require("../middlewares/validate.middleware");
// mergeParams so this router can read :deckId when mounted under deck.routes.ts
const router = (0, express_1.Router)({ mergeParams: true });
const createCardSchema = zod_1.z.object({
    front: zod_1.z.string().min(1).max(2000),
    back: zod_1.z.string().min(1).max(2000),
});
const updateCardSchema = createCardSchema.partial();
const reviewSchema = zod_1.z.object({ quality: zod_1.z.number().int().min(0).max(5) });
router.get("/", card_controller_1.listCardsInDeck);
router.post("/", (0, validate_middleware_1.validate)(createCardSchema), card_controller_1.createCard);
router.patch("/:cardId", (0, validate_middleware_1.validate)(updateCardSchema), card_controller_1.updateCard);
router.delete("/:cardId", card_controller_1.deleteCard);
router.post("/:cardId/review", (0, validate_middleware_1.validate)(reviewSchema), studySession_controller_1.reviewCard);
exports.cardRouter = router;
