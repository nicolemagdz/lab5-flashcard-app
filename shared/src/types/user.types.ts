/**
 * User domain contracts.
 * These mirror (a safe subset of) the Prisma User model and are the
 * shape the API actually sends over the wire -- never the raw DB row
 * (e.g. password is intentionally omitted).
 */

export interface UserDTO {
  id: string;
  email: string;
  name: string | null;
  createdAt: string; // ISO date string over the wire
}

export interface RegisterUserInput {
  email: string;
  password: string;
  name?: string;
}

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserDTO;
  accessToken: string;
}
