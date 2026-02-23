import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const workspaceRoot = process.cwd();
const sourceSqlPath = resolve(workspaceRoot, "scripts/newsletter_supabase.sql");
const migrationsDir = resolve(workspaceRoot, "supabase/migrations");
const migrationFileName = "202602230001_newsletter_setup.sql";
const targetMigrationPath = resolve(migrationsDir, migrationFileName);

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("Missing DATABASE_URL. Set it before running this script.");
  process.exit(1);
}

if (!existsSync(sourceSqlPath)) {
  console.error(`Missing source SQL file at ${sourceSqlPath}`);
  process.exit(1);
}

mkdirSync(migrationsDir, { recursive: true });

if (!existsSync(targetMigrationPath)) {
  copyFileSync(sourceSqlPath, targetMigrationPath);
  console.log(`Created migration file: ${targetMigrationPath}`);
} else {
  console.log(`Migration file already exists: ${targetMigrationPath}`);
}

const result = spawnSync(
  "npx",
  ["supabase", "db", "push", "--db-url", databaseUrl, "--include-all", "--yes"],
  {
    stdio: "inherit",
    env: process.env,
  },
);

if (result.status !== 0) {
  console.error("Failed to apply newsletter SQL via Supabase CLI.");
  process.exit(result.status ?? 1);
}

console.log("Newsletter SQL applied successfully.");
