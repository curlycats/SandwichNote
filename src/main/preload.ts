// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { C_DB } from '../constants/channels';
import { Database } from 'sqlite';

const electronHandler = {
  db: {
    init: (dirPath: string) => ipcRenderer.invoke(C_DB.INIT, dirPath),
    createNote: (db: Database, id?: number) =>
      ipcRenderer.invoke(C_DB.CREATE_NOTE, id),
    updateNote: (db: Database, id: number, content: object) =>
      ipcRenderer.invoke(C_DB.UPDATE_NOTE, id, content),
    loadNote: (db: Database, id: number) =>
      ipcRenderer.invoke(C_DB.LOAD_NOTE, id),
    loadNotes: (db: Database) => ipcRenderer.invoke(C_DB.LOAD_NOTES),
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
