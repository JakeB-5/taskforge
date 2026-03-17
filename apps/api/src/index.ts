import { serve } from "@hono/node-server";
import { getDatabase, migrateDatabase } from "@taskforge/database";
import { createApp } from "./app";
import { config } from "./utils/config";

async function main() {
  // Auto-create tables on startup
  const db = getDatabase();
  await migrateDatabase(db);
  console.log("Database initialized");

  const app = createApp();
  const { port } = config();

  serve({ fetch: app.fetch, port }, (info) => {
    console.log(`TaskForge API running on http://localhost:${info.port}`);
  });
}

main().catch(console.error);
