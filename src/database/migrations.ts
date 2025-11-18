import { getDB } from "./index";

export async function runMigrations() {
  const db = await getDB();

  await db.execute(`
    CREATE TABLE IF NOT EXISTS checklist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section TEXT NOT NULL,
      item TEXT NOT NULL,
      status INTEGER NOT NULL DEFAULT 0
    )
  `);
}
 