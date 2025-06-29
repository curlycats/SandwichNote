import { open, Database } from 'sqlite';
import { IsNoteExist } from './checkers';
import { db_Note } from '../types/note';

export async function LoadNote(db: Database, id?: number): Promise<db_Note> {
  if (id != null) {
    const isNoteExist = await IsNoteExist(db, id);
    if (isNoteExist) {
      console.log(`Note ID ${id} exist in DB ${db.config.filename}`);
      // Fetch and return the existing note
      const existingNote = await db.get<db_Note>(
        `SELECT * FROM notes
        LEFT JOIN note_content ON notes.id = note_content.id
        WHERE notes.id = ?`,
        [id],
      );
      return existingNote!;
    }
  }
  const result = await db.run(
    `
    INSERT INTO notes DEFAULT VALUES
    `,
  );
  // Retrieve and return the newly created note
  const newNote = await db.get<db_Note>(`SELECT * FROM notes WHERE id = ?`, [
    result.lastID,
  ]);
  return newNote!;
}

export async function UpdateNote(
  db: Database,
  id: number,
  contentJson: object,
): Promise<boolean> {
  const jsonStr = JSON.stringify(contentJson);
  try {
    await db.run(
      `
      UPDATE notes
      SET updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [id],
    );
    await db.run(
      `
      INSERT INTO note_content (id, content_json)
      VALUES (?, ?)
      ON CONFLICT(id) DO UPDATE SET content_json = excluded.content_json
      `,
      [id, jsonStr],
    );
    return true;
  } catch (error) {
    console.error(`Failed to update note with ID ${id}:`, error);
    return false;
  }
}

export async function LoadNotes(db: Database): Promise<Array<db_Note>> {
  return await db.all<Array<db_Note>>(
    `SELECT * FROM notes ORDER BY updated_at DESC`,
  );
}

export async function CreateNote(db: Database): Promise<number> {
  const result = await db.run(
    `
    INSERT INTO notes DEFAULT VALUES;
    `,
  );
  await db.run(
    `
    INSERT INTO note_content (id, content_json) VALUES (?, ?);
  `,
    [result.lastID, '{}'],
  );
  return result.lastID!;
}
