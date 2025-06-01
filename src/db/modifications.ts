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

  // 创建 notes 表
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

export async function CreateNote(db: Database, id?: number): Promise<number> {
  if (id != null) {
    const isNoteExist = await IsNoteExist(db, id);
    if (isNoteExist) {
      console.log(`Note ID ${id} exist in DB ${db.config.filename}`);
      return id;
    }
  }
  const result = await db.run(
    `
    INSERT INTO notes DEFAULT VALUES
    `,
  );
  return result.lastID as number;
}

export async function UpdateNote(
  db: Database,
  id: number,
  contentJson: object,
) {
  const jsonStr = JSON.stringify(contentJson);
  await db.run(
    `
    UPDATE notes
    SET content_json = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
    `,
    [jsonStr, id],
  );
}

export async function LoadNotes(db: Database) {
  return await db.all(`SELECT * FROM notes ORDER BY updated_at DESC`);
}

export async function LoadNote(db: Database, id: number) {
  const row = await db.get<db_Note>(`SELECT * FROM notes WHERE id = ?`, [id]);
  console.log(row);
  return row;
}
