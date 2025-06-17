// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { C_DB } from '../constants/channels';
import { Database } from 'sqlite';
import { db_Note } from '../db/types';

const electronHandler = {
  db: {
    init: (dirPath: string): Promise<Database> =>
      ipcRenderer.invoke(C_DB.INIT, dirPath),
    updateNote: (id: number, content: object): Promise<db_Note> =>
      ipcRenderer.invoke(C_DB.UPDATE_NOTE, id, content),
    loadNote: (id: number): Promise<db_Note> =>
      ipcRenderer.invoke(C_DB.LOAD_NOTE, id),
    loadNotes: (): Promise<Array<db_Note>> =>
      ipcRenderer.invoke(C_DB.LOAD_NOTES),
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
