import { PrismaClient } from "@prisma/client";

const globalForPrismaAdmin = globalThis as unknown as {
  prismaAdmin?: PrismaClient;
};

const adminDatabaseUrl =
  process.env.DATABASE_URL_ADMIN ?? process.env.DATABASE_URL;

if (!adminDatabaseUrl) {
  throw new Error(
    "Missing DATABASE_URL_ADMIN (or DATABASE_URL fallback) environment variable.",
  );
}

const prismaAdmin =
  globalForPrismaAdmin.prismaAdmin ??
  new PrismaClient({
    datasources: {
      db: {
        url: adminDatabaseUrl,
      },
    },
    log: ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrismaAdmin.prismaAdmin = prismaAdmin;
}

export default prismaAdmin;
