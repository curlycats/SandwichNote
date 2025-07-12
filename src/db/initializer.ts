import path from 'path';
import fs from 'fs';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { IsNoteExist } from './checkers';

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
  success = success && (await InitDatabaseTable(db));
  success = success && (await InitPropertyTable(db));
  success = success && (await InitNoteTable(db));
  success = success && (await InitNoteContentTable(db));
  success = success && (await InitPropertyValueTable(db));
  success = success && (await InitNotePropertyRelationTable(db));
  success = success && (await InitViewTable(db));
  success = success && (await InitViewPropertyRelationTable(db));
  success = success && (await InitDatabasePropertiesTable(db));

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
        database_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (database_id) REFERENCES databases(id)
      );
    `);
    return true;
  } catch (e: any) {
    console.error(`Failed to create notes table: ${e.message}`);
    return false;
  }
}

export async function InitNoteContentTable(db: Database): Promise<boolean> {
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS note_content (
        id INTEGER,
        content_json TEXT,
        FOREIGN KEY (id) REFERENCES notes(id),
        PRIMARY KEY (id)
      );
    `);
    return true;
  } catch (e: any) {
    console.error(`Failed to create note_content table: ${e.message}`);
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
        description TEXT,
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
        property_id INTEGER,
        property_value_id INTEGER,
        raw_value TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (note_id) REFERENCES notes(id),
        FOREIGN KEY (property_id) REFERENCES properties(id),
        FOREIGN KEY (property_value_id) REFERENCES property_values(id),
        PRIMARY KEY (note_id, property_id, property_value_id)
      );

      CREATE INDEX IF NOT EXISTS idx_note_properties_note_id
        ON note_properties(note_id);
      CREATE INDEX IF NOT EXISTS idx_note_properties_property_value_id
        ON note_properties(property_value_id);
      CREATE INDEX IF NOT EXISTS idx_note_properties_noteid_propertyid
        ON note_properties (note_id, property_id);
    `);
    return true;
  } catch (e: any) {
    console.error(`Failed to create note_properties table: ${e.message}`);
    return false;
  }
}

export async function InitViewTable(db: Database): Promise<boolean> {
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS views (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        database_id INTEGER,
        name TEXT NOT NULL,
        layout TEXT,
        config_json TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (database_id) REFERENCES databases(id)
      );
    `);
    return true;
  } catch (e: any) {
    console.error(`Failed to create views table: ${e.message}`);
    return false;
  }
}

export async function InitViewPropertyRelationTable(
  db: Database,
): Promise<boolean> {
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS view_properties (
        view_id INTEGER,
        property_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (view_id, property_id),
        FOREIGN KEY (view_id) REFERENCES views(id),
        FOREIGN KEY (property_id) REFERENCES properties(id)
      );

      CREATE INDEX IF NOT EXISTS idx_view_properties_view_id ON view_properties(view_id);
      CREATE INDEX IF NOT EXISTS idx_view_properties_property_id ON view_properties(property_id);
    `);
    return true;
  } catch (e: any) {
    console.error(`Failed to create view_properties table: ${e.message}`);
    return false;
  }
}

export async function InitDatabaseTable(db: Database): Promise<boolean> {
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS databases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    return true;
  } catch (e: any) {
    console.error(`Failed to create databases table: ${e.message}`);
    return false;
  }
}

export async function InitDatabasePropertiesTable(
  db: Database,
): Promise<boolean> {
  try {
    await db.exec(`
      CREATE TABLE database_properties (
        database_id INTEGER,
        property_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (database_id, property_id),
        FOREIGN KEY (database_id) REFERENCES databases(id),
        FOREIGN KEY (property_id) REFERENCES properties(id)
      );

      CREATE INDEX IF NOT EXISTS idx_database_properties_database_id ON database_properties(database_id);
      CREATE INDEX IF NOT EXISTS idx_database_properties_property_id ON database_properties(property_id);
    `);
    return true;
  } catch (e: any) {
    console.error(`Failed to create databases table: ${e.message}`);
    return false;
  }
}
