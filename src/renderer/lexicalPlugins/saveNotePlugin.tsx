import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, EditorState, TextNode } from 'lexical';
import { useEffect, useRef } from 'react';

export function OnChangeSaveToDBPlugin({
  onChange,
}: {
  onChange: (editorState: EditorState) => void;
}) {
  const [editor] = useLexicalComposerContext();
  const prevTextRef = useRef<string>('');

  useEffect(() => {
    return editor.registerMutationListener(TextNode, () => {});
  }, []);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState, mutatedNodes }) => {
      // const currentText = editorState.read(() => {
      //   return editor.getRootElement()?.textContent || '';
      // });
      editorState.read(() => {
        const root = editor.getRootElement();
        if (root) {
          // This will log the root DOM element and its children
          // console.log('root', root);
        }
        // To log all Lexical nodes (not DOM), you can use:
        const lexicalRoot = editor._editorState._nodeMap; // Internal API, not recommended for production
        // console.log('nodes', Array.from(lexicalRoot.values()));
      });
      console.log(mutatedNodes);
      if (mutatedNodes) {
        onChange(editorState);
      }
    });
  }, [editor, onChange]);
  return null;
}
