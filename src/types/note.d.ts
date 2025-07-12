export type BlockType = 'paragraph' | 'heading1';

export type Block = {
  id: string;
  type: BlockType;
  content: string;
};

export type db_Note = {
  id: number;
  title?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  database_id?: number | null;
};

export type db_NoteContent = {
  note_id: number;
  content_json?: string | null;
};

export type db_Property = {
  id: number;
  name?: string | null;
  type?: string | null;
  description?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type PropertyValueType = {
  propertyId: number;
  propertyName: string;
  propertyType: string;
  value: string | number | boolean | null; // parse raw_value or from property_value
  rawValue: string | null;
};

export type NoteWithProperties = {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  contentJson: string;
  properties: PropertyValueType[];
};
