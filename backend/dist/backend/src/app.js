"use strict";
// Express application factory. Wires global middleware and mounts the
// versioned API router. Exported (rather than started) so integration
// tests can import it directly with supertest.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const env_1 = require("./config/env");
const routes_1 = require("./routes/routes");
const errorHandler_middleware_1 = require("./middlewares/errorHandler.middleware");
function createApp() {
    const app = (0, express_1.default)();
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)({ origin: env_1.env.CLIENT_ORIGIN, credentials: true }));
    app.use((0, compression_1.default)());
    app.use(express_1.default.json());
    app.use((0, morgan_1.default)(env_1.env.NODE_ENV === "development" ? "dev" : "combined"));
    app.use((0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000,
        limit: 300,
        standardHeaders: true,
        legacyHeaders: false,
    }));
    app.get("/health", (_req, res) => res.json({ status: "ok" }));
    app.use("/api/v1", routes_1.apiRouter);
    // Must be registered last: Express identifies error middleware by arity.
    app.use(errorHandler_middleware_1.errorHandler);
    return app;
}
