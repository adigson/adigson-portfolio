import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import pg from "pg";

const migrationsDirectory = fileURLToPath(new URL("./migrations/", import.meta.url));
const { Pool } = pg;

export function getDirectConnectionString(environment = process.env) {
  const connectionString = environment.DATABASE_URL_UNPOOLED || environment.DATABASE_URL;

  if (!connectionString) {
    throw new Error("Set DATABASE_URL_UNPOOLED (preferred) or DATABASE_URL before running migrations.");
  }

  let hostname;
  try {
    hostname = new URL(connectionString).hostname;
  } catch {
    throw new Error("The database connection string must be a valid PostgreSQL URL.");
  }

  if (hostname.split(".")[0].endsWith("-pooler")) {
    throw new Error("Migrations require a direct connection URL; use DATABASE_URL_UNPOOLED.");
  }

  return connectionString;
}

export async function runMigrations(connectionString = getDirectConnectionString()) {
  const pool = new Pool({ connectionString, max: 1 });
  let client;

  try {
    client = await pool.connect();
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(hashtext('adigson-portfolio-migrations'))");
    await client.query(`
      CREATE TABLE IF NOT EXISTS adigson_schema_migrations (
        filename TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    const filenames = (await readdir(migrationsDirectory))
      .filter((filename) => filename.endsWith(".sql"))
      .sort();

    for (const filename of filenames) {
      const { rows } = await client.query(
        "SELECT 1 FROM adigson_schema_migrations WHERE filename = $1",
        [filename],
      );

      if (rows.length > 0) {
        continue;
      }

      const migration = await readFile(new URL(`./migrations/${filename}`, import.meta.url), "utf8");
      await client.query(migration);
      await client.query(
        "INSERT INTO adigson_schema_migrations (filename) VALUES ($1)",
        [filename],
      );
      console.log(`Applied ${filename}`);
    }

    await client.query("COMMIT");
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK");
    }
    throw error;
  } finally {
    client?.release();
    await pool.end();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    await runMigrations();
  } catch (error) {
    console.error("Database migration failed:", error);
    process.exitCode = 1;
  }
}
