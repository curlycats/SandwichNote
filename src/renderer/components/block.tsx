import React, { useRef, useEffect } from 'react';
import { Block } from '../types/types';

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
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current && divRef.current.innerText !== block.content) {
      divRef.current.innerText = block.content;
    }
  }, [block.content]);

  const handleInput = () => {
    if (divRef.current) {
      onChange(block.id, divRef.current.innerText);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onEnter(block.id);
    }
  };

  return (
    <div
      ref={divRef}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      className={
        block.type === 'heading1' ? 'text-3xl font-bold' : 'text-white'
      }

    />
  );
};
