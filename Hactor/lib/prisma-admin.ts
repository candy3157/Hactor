import { PrismaClient } from "@prisma/client";

const globalForPrismaAdmin = globalThis as unknown as {
  prismaAdmin?: PrismaClient;
};

const tuneConnectionUrl = (rawUrl: string) => {
  try {
    const parsed = new URL(rawUrl);

    // Prevent Prisma from opening many DB connections per runtime instance.
    if (!parsed.searchParams.has("connection_limit")) {
      parsed.searchParams.set("connection_limit", "1");
    }

    if (!parsed.searchParams.has("pool_timeout")) {
      parsed.searchParams.set("pool_timeout", "20");
    }

    return parsed.toString();
  } catch {
    return rawUrl;
  }
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
        url: tuneConnectionUrl(adminDatabaseUrl),
      },
    },
    log: ["warn", "error"],
  });

if (!globalForPrismaAdmin.prismaAdmin) {
  globalForPrismaAdmin.prismaAdmin = prismaAdmin;
}

export default prismaAdmin;
