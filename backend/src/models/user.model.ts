// Data-access layer for User. Controllers/services never call
// `prisma.user.*` directly -- they go through this repository so the
// query shape lives in one place and is easy to mock in tests.

import { prisma } from "../config/prisma";

export const UserModel = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  create(data: { email: string; password: string; name?: string }) {
    return prisma.user.create({ data });
  },
};
