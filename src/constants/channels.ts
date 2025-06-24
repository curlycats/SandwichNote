// Channel consts start with cap C_ stands for Channel_...

export const C_DB = {
  INIT: 'db:init',
  DROP_DB: 'db:drop',
  LOAD_NOTE: 'db:loadNote',
  UPDATE_NOTE: 'db:updateNote',
  CREATE_NOTE: 'db:createNote',
  LOAD_NOTES: 'db:loadNotes',
} as const;
