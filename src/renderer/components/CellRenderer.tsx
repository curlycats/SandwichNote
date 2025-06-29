import React from 'react';
import { PropertyType } from '../../types/property';

type CellRendererProps = {
  type: PropertyType;
  text: string;
};

const CellRenderer = ({ type, text }: CellRendererProps) => {
  switch (type) {
    case 'file':
      return <div> {text} </div>;
  }
  return <div>CellRenderer</div>;
};

export default CellRenderer;
