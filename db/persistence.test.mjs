import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import pg from "pg";
import { getDirectConnectionString, runMigrations } from "./migrate.mjs";

const { Pool } = pg;
const connectionString = process.env.TEST_DATABASE_URL;

function databaseIdentity(value) {
  const url = new URL(value);
  const hostname = url.hostname.replace(/-pooler(?=\.)/, "");
  return `${hostname}:${url.port || "5432"}${url.pathname}`;
}

test("migrations are repeatable and guestbook data survives a new connection", async () => {
  if (!connectionString) {
    throw new Error("Set TEST_DATABASE_URL in .env.test.local to a dedicated test database.");
  }
  getDirectConnectionString({ DATABASE_URL: connectionString });

  const testDatabaseIdentity = databaseIdentity(connectionString);
  const applicationDatabases = [process.env.DATABASE_URL, process.env.DATABASE_URL_UNPOOLED]
    .filter(Boolean);
  if (applicationDatabases.some((url) => databaseIdentity(url) === testDatabaseIdentity)) {
    throw new Error("TEST_DATABASE_URL must not point to the application's database.");
  }

  await runMigrations(connectionString);
  await runMigrations(connectionString);

  const marker = `persistence-${randomUUID()}`;
  const writer = new Pool({ connectionString, max: 1 });

  try {
    await writer.query(
      "INSERT INTO guestbook_entries (name, message) VALUES ($1, $2)",
      ["Persistence test", marker],
    );
  } finally {
    await writer.end();
  }

  const reader = new Pool({ connectionString, max: 1 });
  try {
    const { rows } = await reader.query(
      "SELECT message FROM guestbook_entries WHERE message = $1",
      [marker],
    );
    assert.equal(rows.length, 1);
    assert.equal(rows[0].message, marker);
  } finally {
    try {
      await reader.query("DELETE FROM guestbook_entries WHERE message = $1", [marker]);
    } finally {
      await reader.end();
    }
  }
});
