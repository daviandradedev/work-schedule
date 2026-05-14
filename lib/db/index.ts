import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  workSchedulePool?: Pool;
};

const connectionString = process.env.DATABASE_URL;

export function assertDatabaseConfigured() {
  if (!connectionString) {
    throw new Error("DATABASE_URL is required. Configure it with your Neon pooled Postgres connection string.");
  }
}

export const pool =
  globalForDb.workSchedulePool ??
  new Pool({
    connectionString,
    max: 5,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.workSchedulePool = pool;
}

export const db = drizzle(pool, { schema });
