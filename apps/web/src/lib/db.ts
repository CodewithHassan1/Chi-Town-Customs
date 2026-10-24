import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function getDatabaseUrl(): string {
  // If an external database URL (e.g. PostgreSQL) is explicitly configured, use it directly
  if (
    process.env.DATABASE_URL &&
    !process.env.DATABASE_URL.includes("dev.db") &&
    !process.env.DATABASE_URL.startsWith("file:")
  ) {
    return process.env.DATABASE_URL;
  }

  const isServerless = Boolean(
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.LAMBDA_TASK_ROOT
  );

  if (isServerless) {
    const tmpDbPath = path.join("/tmp", "chitown.db");

    try {
      const needsCopy = !fs.existsSync(tmpDbPath) || fs.statSync(tmpDbPath).size === 0;
      if (needsCopy) {
        const candidates = [
          path.join(process.cwd(), "public", "seed.db"),
          path.join(process.cwd(), "apps", "web", "public", "seed.db"),
          path.join(process.cwd(), "seed.db"),
          path.join(process.cwd(), "apps", "web", "seed.db"),
          path.join(process.cwd(), "packages", "database", "prisma", "seed.db"),
          path.join(process.cwd(), "packages", "database", "prisma", "dev.db"),
          path.join(__dirname, "seed.db"),
          path.join(__dirname, "..", "seed.db"),
          path.join(__dirname, "..", "..", "seed.db"),
          path.join(__dirname, "..", "..", "public", "seed.db"),
          path.join(__dirname, "..", "..", "..", "public", "seed.db"),
          path.join(__dirname, "..", "..", "..", "apps", "web", "public", "seed.db"),
          path.join(__dirname, "..", "..", "..", "packages", "database", "prisma", "seed.db"),
          path.resolve("public/seed.db"),
          path.resolve("apps/web/public/seed.db"),
          path.resolve("seed.db"),
        ];

        let copied = false;
        for (const candidate of candidates) {
          try {
            if (fs.existsSync(candidate) && fs.statSync(candidate).size > 0) {
              fs.copyFileSync(candidate, tmpDbPath);
              copied = true;
              console.log(`[db] Successfully replicated ${candidate} (${fs.statSync(candidate).size} bytes) to ${tmpDbPath}`);
              break;
            }
          } catch {
            // continue checking
          }
        }

        if (!copied) {
          console.warn("[db] Warning: No pre-seeded database candidate found. Creating fresh file at /tmp/chitown.db");
          fs.writeFileSync(tmpDbPath, "");
        }
      }
    } catch (e) {
      console.warn("[db] Error ensuring /tmp/chitown.db exists:", e);
    }

    return `file:${tmpDbPath}`;
  }

  // Local development fallback
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const localCandidates = [
    path.join(process.cwd(), "dev.db"),
    path.join(process.cwd(), "packages", "database", "prisma", "dev.db"),
    path.join(process.cwd(), "apps", "web", "public", "seed.db"),
  ];

  for (const loc of localCandidates) {
    if (fs.existsSync(loc)) {
      return `file:${loc}`;
    }
  }

  return "file:./dev.db";
}

const activeUrl = getDatabaseUrl();

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: activeUrl,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export default db;
