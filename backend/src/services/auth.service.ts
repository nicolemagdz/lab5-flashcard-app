import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { AuthResponse, LoginUserInput, RegisterUserInput } from "../../../shared/contracts";
import { UserModel } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";
import type { SignOptions } from "jsonwebtoken";

function toUserDTO(user: { id: string; email: string; name: string | null; createdAt: Date }) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt.toISOString(),
  };
}

function signToken(userId: string): string {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as any,
  };

  return jwt.sign(
    { sub: userId },
    env.JWT_SECRET,
    options
  );
}

export const AuthService = {
  async register(input: RegisterUserInput): Promise<AuthResponse> {
    const existing = await UserModel.findByEmail(input.email);
    if (existing) throw ApiError.badRequest("An account with this email already exists");

    const hashed = await bcrypt.hash(input.password, env.BCRYPT_SALT_ROUNDS);
    const user = await UserModel.create({
      email: input.email,
      password: hashed,
      name: input.name,
    });

    return {
      token: signToken(user.id),
      user: toUserDTO(user),
    };
  },

  async login(input: LoginUserInput): Promise<AuthResponse> {
    const user = await UserModel.findByEmail(input.email);
    if (!user) throw ApiError.unauthorized("Invalid email or password");

    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) throw ApiError.unauthorized("Invalid email or password");

    return {
      token: signToken(user.id),
      user: toUserDTO(user),
    };
  },
};
