// Single place that turns any thrown error into the shared ApiFailure
// shape defined in @flashcard/shared, so the frontend always parses one
// consistent structure.

import { NextFunction, Request, Response } from "express";
import type { ApiFailure } from "@flashcard/shared";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const isKnown = err instanceof ApiError;
  const statusCode = isKnown ? err.statusCode : 500;

  if (!isKnown) {
    console.error("Unhandled error:", err);
  }

  const payload: ApiFailure = {
    success: false,
    error: {
      message: isKnown ? err.message : "Internal server error",
      code: isKnown ? err.code : "INTERNAL_ERROR",
      details: isKnown ? err.details : env.NODE_ENV === "development" ? err : undefined,
    },
  };

  res.status(statusCode).json(payload);
}
