import { PrismaClient } from "@prisma/client";

// Üks jagatud Prisma klient, et arendusrežiimis ei tekiks iga
// koodimuudatusega uut andmebaasiühendust.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
