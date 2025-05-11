// src/Block.tsx
import React from 'react';
import { Block } from '../types/types';
import { H1_STYLE } from '../styles/objects';

interface BlockProps {
  block: Block;
  onChange: (id: string, newContent: string) => void;
  onEnter: (id: string) => void;
}

export const BlockComponent: React.FC<BlockProps> = ({
  block,
  onChange,
  onEnter,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onEnter(block.id);
    }
  };

  return (
    <div
      contentEditable
      suppressContentEditableWarning
      onInput={(e) =>
        onChange(block.id, (e.target as HTMLDivElement).innerText)
      }
      onKeyDown={handleKeyDown}
      style={block.type == 'heading1' ? H1_STYLE : {}}
    >
      {block.content}
    </div>
  );
};
