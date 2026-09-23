// Generic Zod-schema validation middleware. Pass a schema per route;
// on failure it throws an ApiError(400) with the flattened Zod issues.

import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { ApiError } from "../utils/ApiError";

type RequestPart = "body" | "params" | "query";

export const validate =
  (schema: ZodSchema, part: RequestPart = "body") =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[part]);
    if (!result.success) {
      throw ApiError.badRequest("Validation failed", result.error.flatten());
    }
    req[part] = result.data;
    next();
  };
