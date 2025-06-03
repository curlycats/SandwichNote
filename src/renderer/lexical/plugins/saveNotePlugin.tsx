import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, EditorState, TextNode } from 'lexical';
import { useEffect, useRef } from 'react';

export function OnChangeSaveToDBPlugin({
  onChange,
}: {
  onChange: (editorState: EditorState) => void;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState, mutatedNodes }) => {
      if (mutatedNodes) {
        onChange(editorState);
      }
    });
  }, [editor, onChange]);
  return null;
}
