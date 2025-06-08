import path from 'path';
import fs from 'fs';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { IsNoteExist } from './checkers';
import { db_Note } from './types';

export async function InitDatabase(dirPath: string): Promise<Database> {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const dbPath = path.join(dirPath, 'notes.db');

  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      content_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  return db;
}

export async function LoadNote(db: Database, id?: number): Promise<db_Note> {
  if (id != null) {
    const isNoteExist = await IsNoteExist(db, id);
    if (isNoteExist) {
      console.log(`Note ID ${id} exist in DB ${db.config.filename}`);
      // Fetch and return the existing note
      const existingNote = await db.get<db_Note>(
        `SELECT * FROM notes WHERE id = ?`,
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
  await db
    .run(
      `
    UPDATE notes
    SET content_json = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
    `,
      [jsonStr, id],
    )
    .catch((error) => {
      console.error(`Failed to update note with ID ${id}:`, error);
      return false;
    });
  return true;
}

export async function LoadNotes(db: Database): Promise<Array<db_Note>> {
  return await db.all<Array<db_Note>>(
    `SELECT * FROM notes ORDER BY updated_at DESC`,
  );
}
