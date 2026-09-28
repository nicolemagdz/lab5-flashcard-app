import { Router } from "express";
import { authRouter } from "./auth.routes";
import { deckRouter } from "./deck.routes";
import { studySessionRouter } from "./studySession.routes";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/decks", deckRouter);
apiRouter.use("/study", studySessionRouter);
