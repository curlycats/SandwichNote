import { ipcMain } from 'electron';
import * as db_mod from '../../db/modifications';
import { C_DB } from '../../constants/channels';

let dbInstance: Awaited<ReturnType<typeof InitDatabase>> | null = null;
const dbPath = '/Users/Flysandwich/Desktop/sandwichNote';
const { InitDatabase, CreateNote, LoadNote, UpdateNote, LoadNotes } = db_mod;

export function registerDBHandlers() {
  ipcMain.handle(C_DB.INIT, async (_event, dirPath: string) => {
    dbInstance = await InitDatabase(dirPath);
    return true;
  });

  ipcMain.handle(C_DB.CREATE_NOTE, async (_event, id?: number) => {
    if (!dbInstance) dbInstance = await InitDatabase(dbPath);
    return await CreateNote(dbInstance, id);
  });

  ipcMain.handle(C_DB.LOAD_NOTE, async (_event, id: number) => {
    if (!dbInstance) dbInstance = await InitDatabase(dbPath);
    return await LoadNote(dbInstance, id);
  });

  ipcMain.handle(
    C_DB.UPDATE_NOTE,
    async (_event, id: number, content: object) => { 
      if (!dbInstance) dbInstance = await InitDatabase(dbPath);
      return await UpdateNote(dbInstance, id, content);
    },
  );

  ipcMain.handle(C_DB.LOAD_NOTES, async () => {
    if (!dbInstance) dbInstance = await InitDatabase(dbPath);
    return await LoadNotes(dbInstance);
  });
}
