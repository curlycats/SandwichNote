// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { C_DB } from '../constants/channels';
import { Database } from 'sqlite';
import { db_Note, db_NoteWithContent, Note } from '../types/note';

const electronHandler = {
  db: {
    drop: (dirPath: string): Promise<boolean> =>
      ipcRenderer.invoke(C_DB.DROP_DB, dirPath),
    init: (dirPath: string): Promise<Database> =>
      ipcRenderer.invoke(C_DB.INIT, dirPath),
    updateNote: (id: number, content: object): Promise<db_Note> =>
      ipcRenderer.invoke(C_DB.UPDATE_NOTE, id, content),
    loadNote: (id: number): Promise<db_NoteWithContent> =>
      ipcRenderer.invoke(C_DB.LOAD_NOTE, id),
    loadNotes: (): Promise<Array<db_Note>> =>
      ipcRenderer.invoke(C_DB.LOAD_NOTES),
    createNote: (): Promise<number> => ipcRenderer.invoke(C_DB.CREATE_NOTE),
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
