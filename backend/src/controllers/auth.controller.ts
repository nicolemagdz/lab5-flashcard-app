import { Request, Response } from "express";
import type { ApiResponse, AuthResponse } from "@flashcard/shared";
import { AuthService } from "../services/auth.service";
import { asyncHandler } from "../utils/asyncHandler";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await AuthService.register(req.body);
  const response: ApiResponse<AuthResponse> = { success: true, data: result };
  res.status(201).json(response);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);
  const response: ApiResponse<AuthResponse> = { success: true, data: result };
  res.status(200).json(response);
});
