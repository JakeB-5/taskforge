import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema/index.ts",
  out: "./src/migrations",
  dialect: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL || "file:./data/taskforge.db",
  },
});
