import { ipcMain } from 'electron';
import * as db_mod from '../../db/modifier';
import * as db_initializer from '../../db/initializer';
import { C_DB } from '../../constants/channels';
import { db_Note, db_NoteWithContent, Note } from '../../types/note';
import { DB_PATH } from '../../constants/general';
import { UseTestData } from '../../db/testTables';
import { GetNotesForView } from '../../db/getter';

const { LoadNote, UpdateNote, LoadNotes, CreateNote } = db_mod;
const { InitDatabase } = db_initializer;

let dbInstance: Awaited<ReturnType<typeof InitDatabase>> | null = null;

export function registerDBHandlers() {
  ipcMain.handle(C_DB.INIT, async (_event, dirPath: string) => {
    dbInstance = await InitDatabase(dirPath);
    return true;
  });

  ipcMain.handle(
    C_DB.DROP_DB,
    async (_event, dirPath: string): Promise<boolean> => {
      return await db_initializer.DropDatabase(dirPath);
    },
  );

  ipcMain.handle(
    C_DB.LOAD_NOTE,
    async (_event, id: number): Promise<db_NoteWithContent> => {
      if (!dbInstance) dbInstance = await InitDatabase(DB_PATH);
      return await LoadNote(dbInstance, id);
    },
  );

  ipcMain.handle(
    C_DB.UPDATE_NOTE,
    async (_event, id: number, content: object) => {
      if (!dbInstance) dbInstance = await InitDatabase(DB_PATH);
      return await UpdateNote(dbInstance, id, content);
    },
  );

  ipcMain.handle(C_DB.CREATE_NOTE, async (_event): Promise<number> => {
    if (!dbInstance) dbInstance = await InitDatabase(DB_PATH);
    return await CreateNote(dbInstance);
  });

  ipcMain.handle(C_DB.LOAD_NOTES, async (): Promise<Array<db_Note>> => {
    if (!dbInstance) dbInstance = await InitDatabase(DB_PATH);
    return await LoadNotes(dbInstance);
  });

  ipcMain.handle(
    C_DB.LOAD_NOTES_FOR_VIEW,
    async (_event, viewId: number): Promise<Note[]> => {
      if (!dbInstance) dbInstance = await InitDatabase(DB_PATH);
      return await GetNotesForView(dbInstance, viewId);
    },
  );

  // Test

  ipcMain.handle(C_DB.__T_USE_TEST_DATA, async (): Promise<boolean> => {
    db_initializer.DropDatabase(DB_PATH);
    if (!dbInstance) dbInstance = await InitDatabase(DB_PATH);
    // UseTestData is a function that sets up test data in the database
    await UseTestData(dbInstance);
    return true;
  });
}
