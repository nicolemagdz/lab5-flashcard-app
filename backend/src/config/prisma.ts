// Single shared PrismaClient instance. Never instantiate `new PrismaClient()`
// anywhere else -- multiple instances exhaust DB connections, especially
// in dev with hot reload.

import { PrismaClient } from "@prisma/client";
import { env } from "./env";

export const prisma = new PrismaClient({
  log: env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["warn", "error"],
});
