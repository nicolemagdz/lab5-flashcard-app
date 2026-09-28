"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const auth_service_1 = require("../services/auth.service");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.register = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await auth_service_1.AuthService.register(req.body);
    const response = { success: true, data: result };
    res.status(201).json(response);
});
exports.login = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await auth_service_1.AuthService.login(req.body);
    const response = { success: true, data: result };
    res.status(200).json(response);
});
