"use strict";
// Single shared PrismaClient instance. Never instantiate `new PrismaClient()`
// anywhere else -- multiple instances exhaust DB connections, especially
// in dev with hot reload.
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const env_1 = require("./env");
exports.prisma = new client_1.PrismaClient({
    log: env_1.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["warn", "error"],
});
