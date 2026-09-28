"use strict";
// Verifies the Bearer JWT on protected routes and attaches the decoded
// user id to `req.userId`. TODO: swap the ambient Request augmentation
// below into a proper `types/express/index.d.ts` if it grows further.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const ApiError_1 = require("../utils/ApiError");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.requireAuth = (0, asyncHandler_1.asyncHandler)(async (req, _res, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        throw ApiError_1.ApiError.unauthorized("Missing or malformed Authorization header");
    }
    const token = header.slice("Bearer ".length);
    try {
        const payload = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        req.userId = payload.sub;
        next();
    }
    catch {
        throw ApiError_1.ApiError.unauthorized("Invalid or expired token");
    }
});
