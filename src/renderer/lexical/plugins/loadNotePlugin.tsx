import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';

const E = window.electron;

export function LoadFromDBPlugin({
  noteId,
  onLoaded,
}: {
  noteId: number;
  onLoaded: () => void;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    async function load() {
      const db = await E.db.init('/Users/Flysandwich/Desktop/sandwichNote');
      const id = await E.db.createNote(db, 1);
      console.log(`Loading note ${id}...`);
      const noteJson = await E.db.loadNote(db, noteId);
      console.log(noteJson);

      if (noteJson) {
        editor.update(() => {
          const editorState = editor.parseEditorState(noteJson.content_json);
          console.log('editor:', editorState);
          editor.setEditorState(editorState);
        });
      }
    }

    load().then(onLoaded);
  }, [editor, noteId]);

  return null;
}
