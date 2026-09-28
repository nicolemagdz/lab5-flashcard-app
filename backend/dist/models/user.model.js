"use strict";
// Data-access layer for User. Controllers/services never call
// `prisma.user.*` directly -- they go through this repository so the
// query shape lives in one place and is easy to mock in tests.
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const prisma_1 = require("../config/prisma");
exports.UserModel = {
    findByEmail(email) {
        return prisma_1.prisma.user.findUnique({ where: { email } });
    },
    findById(id) {
        return prisma_1.prisma.user.findUnique({ where: { id } });
    },
    create(data) {
        return prisma_1.prisma.user.create({ data });
    },
};
