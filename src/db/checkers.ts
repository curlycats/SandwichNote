import { Database } from 'sqlite';

export async function IsNoteExist(db: Database, id: number): Promise<boolean> {
  const row = await db.get(`SELECT id FROM notes WHERE id = ?`, id);
  return !!row;
}
