import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

export const isDatabaseConfigured = Boolean(
  connectionString &&
    !connectionString.includes("[YOUR-PROJECT-REF]") &&
    !connectionString.includes("[YOUR-PASSWORD]")
);

// Singleton connection untuk mencegah koneksi berlebih saat Next.js hot-reload
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const conn = isDatabaseConfigured
  ? globalForDb.conn ?? postgres(connectionString!, { prepare: false })
  : undefined;

if (process.env.NODE_ENV !== "production" && conn) {
  globalForDb.conn = conn;
}

export const db = conn ? drizzle(conn, { schema }) : null;
export * from "./schema";

