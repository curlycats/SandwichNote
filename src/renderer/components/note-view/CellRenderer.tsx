import React from 'react';
import { PropertyType } from '../../../types/property';
import { db_Note } from '../../../types/note';

type CellRendererProps = {
  type: PropertyType;
  note: db_Note;
  field: keyof db_Note;
};

const CellRenderer = ({ type, note, field }: CellRendererProps) => {
  if (!(field in note)) {
    return <div>Invalid field</div>;
  }
  switch (type) {
    case 'file':
      return <div> {note[field]} </div>;
  }
  return <div>CellRenderer</div>;
};

export default CellRenderer;
