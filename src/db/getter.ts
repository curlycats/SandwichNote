import { Database } from 'sqlite';
import { Note, PropertyValueType } from '../types/note';

function parseRawValue(
  raw: string | null,
  type: string,
  value: string | null,
): string | number | boolean | null {
  if (raw !== null) {
    switch (type) {
      case 'number':
        return Number(raw);
      case 'boolean':
        return raw === 'true';
      default:
        return raw;
    }
  }
  return value;
}

export async function GetNotesForView(
  db: Database,
  viewId: number,
): Promise<Note[]> {
  // 1. get db_id
  const view = await db.get<{ database_id: number }>(
    `SELECT database_id FROM views WHERE id = ?`,
    [viewId],
  );

  if (!view) throw new Error(`View ${viewId} not found`);

  const databaseId = view.database_id;

  // 2. get notes
  const rawNotes = await db.all<
    Array<{
      id: number;
      title: string;
      created_at: string;
      updated_at: string;
    }>
  >(
    `SELECT id, title, created_at, updated_at
     FROM notes
     WHERE database_id = ?`,
    [databaseId],
  );

  if (rawNotes.length === 0) return [];

  const noteIds = rawNotes.map((n) => n.id);

  // 3. 获取该 view 选择的 property（或 fallback 到 database）
  const viewProps = await db.all<Array<{ property_id: number }>>(
    `SELECT property_id FROM view_properties WHERE view_id = ?`,
    [viewId],
  );

  let visiblePropertyIds: number[] = [];
  if (viewProps.length > 0) {
    visiblePropertyIds = viewProps.map((vp) => vp.property_id);
  } else {
    const dbProps = await db.all<Array<{ property_id: number }>>(
      `SELECT property_id FROM database_properties WHERE database_id = ?`,
      [databaseId],
    );
    visiblePropertyIds = dbProps.map((dp) => dp.property_id);
  }

  if (visiblePropertyIds.length === 0) {
    return rawNotes.map((note) => ({
      id: note.id,
      title: note.title ?? '',
      createdAt: note.created_at ?? '',
      updatedAt: note.updated_at ?? '',
      contentJson: '',
      properties: [],
    }));
  }

  // 4. 获取所有相关 note 的属性值（使用 JOIN 一次查全）
  const propertyPlaceholders = visiblePropertyIds.map(() => '?').join(',');

  const propertyRows = await db.all<
    Array<{
      note_id: number;
      property_id: number;
      raw_value: string | null;
      value: string | null;
      name: string;
      type: string;
    }>
  >(
    `
    SELECT np.note_id, np.property_id, np.raw_value, pv.value, p.name, p.type
    FROM note_properties np
    JOIN notes n ON np.note_id = n.id
    LEFT JOIN property_values pv ON np.property_value_id = pv.id
    LEFT JOIN properties p ON np.property_id = p.id
    WHERE n.database_id = ?
      AND np.property_id IN (${propertyPlaceholders})
  `,
    [databaseId, ...visiblePropertyIds],
  );

  // 5. 整合数据
  const noteMap = new Map<number, Note>();

  for (const note of rawNotes) {
    noteMap.set(note.id, {
      id: note.id,
      title: note.title ?? '',
      createdAt: note.created_at ?? '',
      updatedAt: note.updated_at ?? '',
      contentJson: '', // 延迟加载
      properties: [],
    });
  }

  for (const prop of propertyRows) {
    const parsed = parseRawValue(prop.raw_value, prop.type, prop.value);
    const note = noteMap.get(prop.note_id);
    if (note) {
      note.properties.push({
        propertyId: prop.property_id,
        propertyName: prop.name,
        propertyType: prop.type,
        rawValue: prop.raw_value,
        value: parsed,
      });
    }
  }

  return Array.from(noteMap.values());
}
