// Channel consts start with cap C_ stands for Channel_...
// Vars start with __T stands for Test
export const C_DB = {
  INIT: 'db:init',
  DROP_DB: 'db:drop',
  LOAD_NOTE: 'db:loadNote',
  UPDATE_NOTE: 'db:updateNote',
  CREATE_NOTE: 'db:createNote',
  LOAD_NOTES: 'db:loadNotes',

  // Test related channels. Don't use in production!
  __T_USE_TEST_DATA: 'db:test:useTestData',
} as const;
