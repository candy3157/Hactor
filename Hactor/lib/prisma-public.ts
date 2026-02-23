import { PrismaClient } from "@prisma/client";

const globalForPrismaPublic = globalThis as unknown as {
  prismaPublic?: PrismaClient;
};

const publicDatabaseUrl =
  process.env.DATABASE_URL_PUBLIC ?? process.env.DATABASE_URL;

if (!publicDatabaseUrl) {
  throw new Error(
    "Missing DATABASE_URL_PUBLIC (or DATABASE_URL fallback) environment variable.",
  );
}

const prismaPublic =
  globalForPrismaPublic.prismaPublic ??
  new PrismaClient({
    datasources: {
      db: {
        url: publicDatabaseUrl,
      },
    },
    log: ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrismaPublic.prismaPublic = prismaPublic;
}

export default prismaPublic;
