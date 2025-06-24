import path from 'path';
import fs from 'fs';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { IsNoteExist } from './checkers';
import { db_Note } from './types';

export async function DropDatabase(dirPath: string): Promise<boolean> {
  const dbPath = path.join(dirPath, 'notes.db');
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    return true;
  }
  return false;
}

export async function InitDatabase(dirPath: string): Promise<Database> {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const dbPath = path.join(dirPath, 'notes.db');

  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  let success = true;
  success = success && (await InitNoteTable(db));
  success = success && (await InitPropertyTable(db));
  success = success && (await InitPropertyValueTable(db));
  success = success && (await InitNotePropertyRelationTable(db));
  if (!success) {
    throw new Error('Failed to initialize database tables');
  }
  return db;
}

export async function InitNoteTable(db: Database): Promise<boolean> {
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        content_json TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    return true;
  } catch (e: any) {
    console.error(`Failed to create notes table: ${e.message}`);
    return false;
  }
}

export async function InitPropertyTable(db: Database): Promise<boolean> {
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS properties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        type TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    return true;
  } catch (e: any) {
    console.error(`Failed to create properties table: ${e.message}`);
    return false;
  }
}

export async function InitPropertyValueTable(db: Database): Promise<boolean> {
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS property_values (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        property_id INTEGER,
        value TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (property_id) REFERENCES properties(id)
      );
      CREATE INDEX IF NOT EXISTS idx_property_values_property_id ON property_values(property_id);
    `);
    return true;
  } catch (e: any) {
    console.error(`Failed to create property_values table: ${e.message}`);
    return false;
  }
}

export async function InitNotePropertyRelationTable(
  db: Database,
): Promise<boolean> {
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS note_properties (
        note_id INTEGER,
        property_value_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (note_id) REFERENCES notes(id),
        FOREIGN KEY (property_value_id) REFERENCES property_values(id),
        PRIMARY KEY (note_id, property_value_id)
      );

      CREATE INDEX IF NOT EXISTS idx_note_properties_note_id ON note_properties(note_id);
      CREATE INDEX IF NOT EXISTS idx_note_properties_property_key ON note_properties(property_value_id);
    `);
    return true;
  } catch (e: any) {
    console.error(`Failed to create note_properties table: ${e.message}`);
    return false;
  }
}
