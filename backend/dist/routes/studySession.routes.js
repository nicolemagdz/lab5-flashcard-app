"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studySessionRouter = void 0;
const express_1 = require("express");
const card_controller_1 = require("../controllers/card.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
// Cross-deck study endpoints, e.g. "everything due today across all decks".
// Per-card review actions live on card.routes.ts (POST /:cardId/review)
// since they operate on a single, already-scoped card.
const router = (0, express_1.Router)();
router.use(auth_middleware_1.requireAuth);
router.get("/due", card_controller_1.getDueCards);
exports.studySessionRouter = router;
