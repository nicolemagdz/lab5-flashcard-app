"use strict";
// Generic Zod-schema validation middleware. Pass a schema per route;
// on failure it throws an ApiError(400) with the flattened Zod issues.
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const ApiError_1 = require("../utils/ApiError");
const validate = (schema, part = "body") => (req, _res, next) => {
    const result = schema.safeParse(req[part]);
    if (!result.success) {
        throw ApiError_1.ApiError.badRequest("Validation failed", result.error.flatten());
    }
    req[part] = result.data;
    next();
};
exports.validate = validate;
