"use strict";
// Centralized, validated environment access. Nothing else in the codebase
// should call `process.env` directly -- import `env` from here instead,
// so a missing/invalid variable fails fast at boot with a clear message.
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "test", "production"]).default("development"),
    PORT: zod_1.z.coerce.number().default(4000),
    CLIENT_ORIGIN: zod_1.z.string().url().default("http://localhost:5173"),
    DATABASE_URL: zod_1.z.string().min(1, "DATABASE_URL is required"),
    JWT_SECRET: zod_1.z.string().min(16, "JWT_SECRET must be at least 16 characters"),
    JWT_EXPIRES_IN: zod_1.z.string().default("7d"),
    BCRYPT_SALT_ROUNDS: zod_1.z.coerce.number().default(10),
});
exports.env = envSchema.parse(process.env);
