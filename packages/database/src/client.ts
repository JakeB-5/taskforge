import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { mkdirSync } from "fs";
import { dirname } from "path";
import * as schema from "./schema/index";

export type DatabaseClient = ReturnType<typeof createDatabase>;

export function createDatabase(url?: string) {
  const dbUrl = url ?? process.env.DATABASE_URL ?? "file:./data/taskforge.db";
  // Ensure the directory exists for local file databases
  if (dbUrl.startsWith("file:")) {
    const dbPath = dbUrl.replace("file:", "");
    mkdirSync(dirname(dbPath), { recursive: true });
  }
  const client = createClient({ url: dbUrl });
  return drizzle(client, { schema });
}

// Default singleton instance
let _db: DatabaseClient | null = null;

export function getDatabase(): DatabaseClient {
  if (!_db) {
    _db = createDatabase();
  }
  return _db;
}
