import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';

const E = window.electron;

export function LoadFromDBPlugin({ noteId }: { noteId: number }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    async function load() {
      const db = await E.db.init('/Users/Flysandwich/Desktop/sandwichNote');
      const id = await E.db.createNote(db, 1);
      console.log(`Loading note ${id}...`);
      const noteJson = await E.db.loadNote(db, noteId);
      console.log(noteJson)

      if (noteJson) {
        editor.update(() => {
          const editorState = JSON.parse(noteJson.content_json);
          editor.setEditorState(editorState);
        });
      }
    }

    load();
  }, [editor, noteId]);

  return null;
}
