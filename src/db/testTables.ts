import { Database } from 'sqlite';
import { DB_PATH } from '../constants/general';
import { InitDatabase, DropDatabase } from '../db/initializer';

export async function UseTestData(db: Database) {
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
}
