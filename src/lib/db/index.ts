import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

function getDatabaseUrl(): string {
  const candidates = [
    process.env.DATABASE_URL,
    // Vercel Postgres (Neon) commonly sets these:
    process.env.POSTGRES_URL,
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.POSTGRES_PRISMA_URL,
  ];
  const url =
    candidates.find(
      (value) => typeof value === "string" && value.trim().length > 0,
    ) ?? "";

  const trimmed = url.trim();
  if (!trimmed) {
    throw new Error(
      "Missing database URL. Set DATABASE_URL (or POSTGRES_URL / POSTGRES_URL_NON_POOLING) in .env.local / Vercel env.",
    );
  }
  if (/\s/.test(trimmed)) {
    throw new Error(
      "Database URL contains whitespace. Remove whitespace or URL-encode the password if needed.",
    );
  }
  const atCount = (trimmed.match(/@/g) ?? []).length;
  if (atCount > 1) {
    throw new Error(
      "Database URL contains multiple '@' characters. If your password contains '@', URL-encode it as '%40'.",
    );
  }
  return trimmed;
}

export const pool = new Pool({
  connectionString: getDatabaseUrl(),
});

export const db = drizzle(pool);
