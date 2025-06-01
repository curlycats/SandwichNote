import { EditorThemeClasses } from 'lexical';

export const defaultTheme: EditorThemeClasses = {
  text: {
    bold: 'lex-bold',
    italic: 'lex-italic',
    underline: 'lex-underline',
  },
  heading: {
    h1: 'lex-h1',
    h2: 'lex-h2',
    h3: 'lex-h3',
    h4: 'lex-h4',
    h5: 'lex-h5',
    h6: 'lex-h6',
  },
  code: 'editor-code',
  list: {
    ul: 'lex-ul',
    ulDepth: ['lex-ul-1', 'lex-ul-2', 'lex-ul-3'],
    ol: 'lex-ol',
    olDepth: ['lex-ol-1', 'lex-ol-2', 'lex-ol-3'],
    checklist: 'lex-checklist',
    listitem: 'lex-listitem',
    listitemChecked: 'lex-listitem-checked',
    listitemUnchecked: 'lex-listitem-unchecked',
    nested: {
      list: 'lex-nested-list',
      listitem: 'lex-nested-listitem',
    },
  },
  listItem: 'lex-listitem',
  table: 'lex-table',
  tableCell: 'lex-tablecell',
  tableRow: 'lex-tablerow',
};
