import { PrismaClient } from "@prisma/client";

const globalForPrismaPublic = globalThis as unknown as {
  prismaPublic?: PrismaClient;
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
        url: tuneConnectionUrl(publicDatabaseUrl),
      },
    },
    log: ["warn", "error"],
  });

if (!globalForPrismaPublic.prismaPublic) {
  globalForPrismaPublic.prismaPublic = prismaPublic;
}

export default prismaPublic;
