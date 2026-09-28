"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const ApiError_1 = require("../utils/ApiError");
const env_1 = require("../config/env");
function errorHandler(err, _req, res, _next) {
    const isKnown = err instanceof ApiError_1.ApiError;
    const statusCode = isKnown ? err.statusCode : 500;
    if (!isKnown) {
        console.error("Unhandled error:", err);
    }
    const payload = {
        success: false,
        error: {
            message: isKnown ? err.message : "Internal server error",
            code: isKnown && err.code ? err.code : "INTERNAL_ERROR",
            details: isKnown
                ? err.details
                : env_1.env.NODE_ENV === "development"
                    ? err
                    : undefined,
        },
    };
    res.status(statusCode).json(payload);
}
