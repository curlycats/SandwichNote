export type BlockType = 'paragraph' | 'heading1';

export interface Block {
  id: string;
  type: BlockType;
  content: string;
}
