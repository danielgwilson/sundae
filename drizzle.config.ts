import { config } from "dotenv";
import type { Config } from "drizzle-kit";

config({ path: ".env.local" });
config({ path: ".env" });

function validateDatabaseUrl(url: string) {
  const trimmed = url.trim();
  if (!trimmed) {
    throw new Error(
      "Missing database URL. Set DATABASE_URL (or POSTGRES_URL / POSTGRES_URL_NON_POOLING) in .env.local.",
    );
  }
  if (/\s/.test(trimmed)) {
    throw new Error(
      "DATABASE_URL contains whitespace. Remove whitespace or URL-encode the password if needed.",
    );
  }
  const atCount = (trimmed.match(/@/g) ?? []).length;
  if (atCount > 1) {
    throw new Error(
      "DATABASE_URL contains multiple '@' characters. If your password contains '@', URL-encode it as '%40'.",
    );
  }
  return trimmed;
}

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./src/lib/db/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: (() => {
      const candidates = [
        process.env.DATABASE_URL,
        process.env.SUPABASE_DB_URL,
        process.env.SUPABASE_DATABASE_URL,
        process.env.POSTGRES_URL_NON_POOLING,
        process.env.POSTGRES_PRISMA_URL,
        process.env.POSTGRES_URL,
      ];
      const url =
        candidates.find(
          (value) => typeof value === "string" && value.trim().length > 0,
        ) ?? "";
      return validateDatabaseUrl(url);
    })(),
  },
} satisfies Config;
