"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const ApiError_1 = require("../utils/ApiError");
const env_1 = require("../config/env");
function toUserDTO(user) {
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt.toISOString(),
    };
}
function signToken(userId) {
    const options = {
        expiresIn: env_1.env.JWT_EXPIRES_IN,
    };
    return jsonwebtoken_1.default.sign({ sub: userId }, env_1.env.JWT_SECRET, options);
}
exports.AuthService = {
    async register(input) {
        const existing = await user_model_1.UserModel.findByEmail(input.email);
        if (existing)
            throw ApiError_1.ApiError.badRequest("An account with this email already exists");
        const hashed = await bcryptjs_1.default.hash(input.password, env_1.env.BCRYPT_SALT_ROUNDS);
        const user = await user_model_1.UserModel.create({
            email: input.email,
            password: hashed,
            name: input.name,
        });
        return {
            token: signToken(user.id),
            user: toUserDTO(user),
        };
    },
    async login(input) {
        const user = await user_model_1.UserModel.findByEmail(input.email);
        if (!user)
            throw ApiError_1.ApiError.unauthorized("Invalid email or password");
        const valid = await bcryptjs_1.default.compare(input.password, user.password);
        if (!valid)
            throw ApiError_1.ApiError.unauthorized("Invalid email or password");
        return {
            token: signToken(user.id),
            user: toUserDTO(user),
        };
    },
};
