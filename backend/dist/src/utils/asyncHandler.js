"use strict";
// Wraps async route handlers so rejected promises are forwarded to
// Express's error pipeline instead of crashing the process silently.
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = void 0;
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
exports.asyncHandler = asyncHandler;
