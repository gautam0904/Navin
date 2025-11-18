import { getDB } from "./index";

export async function getAllChecklistItems() {
  const db = await getDB();
  return await db.select("SELECT * FROM checklist");
}

export async function addChecklistItem(section: string, item: string) {
  const db = await getDB();

  await db.execute(
    "INSERT INTO checklist (section, item) VALUES (?, ?)",
    [section, item]
  );
}

export async function updateChecklistStatus(id: number, status: number) {
  const db = await getDB();

  await db.execute(
    "UPDATE checklist SET status = ? WHERE id = ?",
    [status, id]
  );
}
export async function deleteChecklistItem(id: number) {
  const db = await getDB(); 
    await db.execute(
    "DELETE FROM checklist WHERE id = ?",
    [id]
  );
}
