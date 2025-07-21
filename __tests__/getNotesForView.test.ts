import path from 'path';
import fs from 'fs';
import { InitDatabase, DropDatabase } from '../src/db/initializer';
import { getNotesForView } from '../src/db/getter';

const TEST_DB_DIR = path.join(__dirname, 'test-data');

describe('getNotesForView', () => {
  let db: Awaited<ReturnType<typeof InitDatabase>>;

  beforeAll(async () => {
    await DropDatabase(TEST_DB_DIR);
    db = await InitDatabase(TEST_DB_DIR);

    // 1. 创建数据库 & view
    await db.run(`INSERT INTO databases (id, name) VALUES (1, 'Test DB')`);
    await db.run(
      `INSERT INTO views (id, database_id, name) VALUES (1, 1, 'Default View')`,
    );

    // 2. 创建 note
    await db.run(
      `INSERT INTO notes (id, database_id, title) VALUES (100, 1, 'Test Note')`,
    );

    // 3. 创建 property & 设置 fallback（数据库级 property）
    await db.run(
      `INSERT INTO properties (id, name, type) VALUES (200, 'Status', 'text')`,
    );
    await db.run(
      `INSERT INTO database_properties (database_id, property_id) VALUES (1, 200)`,
    );

    // 4. 添加 note property 关联
    await db.run(`
      INSERT INTO note_properties (note_id, property_id, raw_value, property_value_id)
      VALUES (100, 200, 'todo', NULL)
    `);
  });

  afterAll(async () => {
    await db.close();
    // await DropDatabase(TEST_DB_DIR);
    // fs.rmdirSync(TEST_DB_DIR, { recursive: true });
  });

  it('should return note with fallback property', async () => {
    const notes = await getNotesForView(1, db);
    expect(notes).toHaveLength(1);
    const note = notes[0];
    expect(note.id).toBe(100);
    expect(note.title).toBe('Test Note');
    expect(note.properties).toHaveLength(1);
    expect(note.properties[0]).toMatchObject({
      propertyName: 'Status',
      propertyType: 'text',
      rawValue: 'todo',
      value: 'todo',
    });
  });
});
