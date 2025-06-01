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
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { TRANSFORMERS } from '@lexical/markdown';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { defaultTheme } from '../styles/theme';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';

const theme = {
  // Theme styling goes here
  //...
  ltr: 'ltr',
  rtl: 'rtl',
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
    theme: { ...theme, ...defaultTheme },
    onError,
    nodes: [
      ParagraphNode,
      TextNode,
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
    ],
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container">
        <LoadFromDBPlugin
          noteId={1}
          onLoaded={() => {
            setIsLoaded(true);
          }}
        />

        {isLoaded && (
          <React.Fragment>
            {/* Custom Plugins */}
            <OnChangeSaveToDBPlugin onChange={saveToDB} />

            {/* Prebuild Plugins */}
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
            <ListPlugin hasStrictIndent={false} />
            <LinkPlugin />
            <CheckListPlugin />
            <TabIndentationPlugin />
            <HistoryPlugin />
            <AutoFocusPlugin />

            {/* Core RichText plugin */}
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  aria-placeholder={'Enter some text...'}
                  placeholder={
                    <div className="absolute h-12 -translate-y-6 select-none text-gray-500 pointer-events-none">
                      Enter some text...
                    </div>
                  }
                  className="lexical-editor"
                />
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
          </React.Fragment>
        )}
      </div>
    </LexicalComposer>
  );
};

export default LexicalTest;
