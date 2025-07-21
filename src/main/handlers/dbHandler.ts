import { ipcMain } from 'electron';
import * as db_mod from '../../db/modifier';
import * as db_initializer from '../../db/initializer';
import { C_DB } from '../../constants/channels';
import { db_Note, db_NoteWithContent } from '../../types/note';

const dbPath = '/Users/Flysandwich/Desktop/sandwichNote';
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
      if (!dbInstance) dbInstance = await InitDatabase(dbPath);
      return await LoadNote(dbInstance, id);
    },
  );

  ipcMain.handle(
    C_DB.UPDATE_NOTE,
    async (_event, id: number, content: object) => {
      if (!dbInstance) dbInstance = await InitDatabase(dbPath);
      return await UpdateNote(dbInstance, id, content);
    },
  );

  ipcMain.handle(C_DB.CREATE_NOTE, async (_event): Promise<number> => {
    if (!dbInstance) dbInstance = await InitDatabase(dbPath);
    return await CreateNote(dbInstance);
  });

  ipcMain.handle(C_DB.LOAD_NOTES, async () => {
    if (!dbInstance) dbInstance = await InitDatabase(dbPath);
    return await LoadNotes(dbInstance);
  });
}
