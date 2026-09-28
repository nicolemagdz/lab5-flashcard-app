"use strict";
// Typed application error. Controllers/services throw this; the global
// errorHandler middleware knows how to translate it into the shared
// ApiFailure envelope.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    constructor(statusCode, message, code, details) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        this.name = "ApiError";
    }
    static badRequest(message, details) {
        return new ApiError(400, message, "BAD_REQUEST", details);
    }
    static unauthorized(message = "Unauthorized") {
        return new ApiError(401, message, "UNAUTHORIZED");
    }
    static forbidden(message = "Forbidden") {
        return new ApiError(403, message, "FORBIDDEN");
    }
    static notFound(message = "Resource not found") {
        return new ApiError(404, message, "NOT_FOUND");
    }
}
exports.ApiError = ApiError;
