import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import { CreateNote, InitDatabase, LoadNote } from '../../db/modifications';

export function LoadFromDBPlugin({ noteId }: { noteId: number }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    async function load() {
      const db = await InitDatabase('/Users/Flysandwich/Desktop/sandwichNote');
      const id = await CreateNote(db, 1);
      console.log(`Loading note ${id}...`);
      const noteJson = await LoadNote(db, noteId);

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
