import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "./db";

async function run() {
  console.log("Applying database migrations to PostgreSQL...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("✅ Database tables created successfully!");
  process.exit(0);
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});