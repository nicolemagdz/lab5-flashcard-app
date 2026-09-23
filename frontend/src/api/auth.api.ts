import type { AuthResponse, LoginUserInput, RegisterUserInput } from "@flashcard/shared";
import { apiClient, unwrap } from "./client";

export const authApi = {
  login: (input: LoginUserInput) => unwrap<AuthResponse>(apiClient.post("/auth/login", input)),
  register: (input: RegisterUserInput) =>
    unwrap<AuthResponse>(apiClient.post("/auth/register", input)),
};
