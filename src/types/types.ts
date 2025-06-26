export type BlockType = 'paragraph' | 'heading1';

export interface Block {
  id: string;
  type: BlockType;
  content: string;
}

export interface db_Note {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  content_json?: string; 
}
