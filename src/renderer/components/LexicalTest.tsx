import React, { useEffect, useState } from 'react';

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { OnChangeSaveToDBPlugin } from '../lexicalPlugins/saveNotePlugin';
import { LoadFromDBPlugin } from '../lexicalPlugins/loadNotePlugin';
import { EditorState } from 'lexical';
import { $createParagraphNode, ParagraphNode, TextNode } from 'lexical';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import ToolbarPlugin from '../lexicalPlugins/toolbarPlugin';

const theme = {
  // Theme styling goes here
  //...
  ltr: 'ltr',
  rtl: 'rtl',
  paragraph: 'editor-paragraph',
};

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
  console.error(error);
}

async function saveToDB(editorState: EditorState) {
  const editorJson = editorState.toJSON();
  const db = await window.electron.db.init(
    '/Users/Flysandwich/Desktop/sandwichNote',
  );
  const id = 1;
  console.log(`Saving Note ${id} to DB...`);
  await window.electron.db.updateNote(db, id, editorJson);
  console.log(`Saved`);
}

const LexicalTest = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const initialConfig = {
    namespace: 'MyEditor',
    theme,
    onError,
    nodes: [ParagraphNode, TextNode, ],
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <LoadFromDBPlugin
        noteId={1}
        onLoaded={() => {
          setIsLoaded(true);
        }}
      />
      {isLoaded && (
        <React.Fragment>
          <ToolbarPlugin />
          <OnChangeSaveToDBPlugin onChange={saveToDB} />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                aria-placeholder={'Enter some text...'}
                placeholder={<div>Enter some text...</div>}
                className="lexical-editor"
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </React.Fragment>
      )}
    </LexicalComposer>
  );
};

export default LexicalTest;
