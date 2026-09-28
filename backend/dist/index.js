"use strict";
// Process entrypoint: boots config, connects Prisma, starts the HTTP server.
// Keeping this separate from app.ts lets tests import `app` without
// binding a real port.
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./config/env");
const prisma_1 = require("./config/prisma");
async function main() {
    await prisma_1.prisma.$connect();
    const app = (0, app_1.createApp)();
    const server = app.listen(env_1.env.PORT, () => {
        console.log(`API listening on http://localhost:${env_1.env.PORT}`);
    });
    const shutdown = async (signal) => {
        console.log(`${signal} received, shutting down gracefully...`);
        server.close();
        await prisma_1.prisma.$disconnect();
        process.exit(0);
    };
    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
}
main().catch((err) => {
    console.error("Fatal error during startup:", err);
    process.exit(1);
});
