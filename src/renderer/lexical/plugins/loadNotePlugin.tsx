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
      const note = await E.db.loadNote(db, 1);
      console.log('note', note);

      if (note) {
        editor.update(() => {
          const editorState = editor.parseEditorState(note.content_json);
          console.log('editor:', editorState);
          editor.setEditorState(editorState);
        });
      }
    }

    load().then(onLoaded);
  }, [editor, noteId]);

  return null;
}
