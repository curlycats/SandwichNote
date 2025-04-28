// src/App.tsx
import React, { useState } from 'react';
import { BlockComponent } from './components/block';
import { Block } from './types/types';
import './App.css';

const initialBlocks: Block[] = [
  { id: '1', type: 'heading1', content: '欢迎来到Block Editor' },
  { id: '2', type: 'paragraph', content: '你可以在这里输入文字！' },
];

const App: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);

  const handleChange = (id: string, newContent: string) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === id ? { ...block, content: newContent } : block,
      ),
    );
  };

  const handleEnter = (id: string) => {
    const index = blocks.findIndex((block) => block.id === id);
    const newBlock: Block = {
      id: Date.now().toString(),
      type: 'paragraph',
      content: '',
    };
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    setBlocks(newBlocks);
  };

  return (
    <div style={{ padding: '16px' }}>
      {blocks.map((block) => (
        <BlockComponent
          key={block.id}
          block={block}
          onChange={handleChange}
          onEnter={handleEnter}
        />
      ))}
    </div>
  );
};

export default App;
