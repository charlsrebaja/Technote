import { PrismaClient } from "@prisma/client";

declare global {
  // Prevent multiple PrismaClient instances in development due to HMR.
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
