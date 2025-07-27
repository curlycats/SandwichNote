import React from 'react';
import { PropertyType } from '../../../types/property';
import { db_Note, Note } from '../../../types/note';

type CellRendererProps = {
  type: PropertyType;
  note: Note;
  field: keyof Note;
};

const CellRenderer = ({ type, note, field }: CellRendererProps) => {
  console.log('CellRenderer', type, field);
  if (!(field in note)) {
    return <div>Invalid field</div>;
  }
  switch (field) {
    case 'properties':
      return <div> {} </div>;
    default:
      return <div>{note[field]}</div>;
  }
  return <div>CellRenderer</div>;
};

export default CellRenderer;
