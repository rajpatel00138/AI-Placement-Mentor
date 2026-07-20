import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
const logLevel = process.env.NODE_ENV === "development" ? ["query"] : [];

function createFallbackPrismaClient() {
  return new Proxy({} as PrismaClient, {
    get(_target, prop) {
      if (prop === "user") {
        return {
          findUnique: async () => null,
          create: async () => {
            throw new Error("Prisma is unavailable because DATABASE_URL is not configured.");
          },
        };
      }

      if (prop === "$connect" || prop === "$disconnect" || prop === "$on" || prop === "$transaction" || prop === "$use") {
        return async () => undefined;
      }

      return undefined;
    },
  }) as PrismaClient;
}

function createPrismaClient() {
  if (!connectionString) {
    console.warn("DATABASE_URL is not configured. Using fallback auth behavior without Prisma persistence.");
    return createFallbackPrismaClient();
  }

  try {
    const adapter = new PrismaPg({ connectionString });
    return new PrismaClient({
      adapter,
      log: logLevel,
    } as never);
  } catch (error) {
    console.warn("Prisma initialization failed; using fallback client.", error);
    return createFallbackPrismaClient();
  }
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
