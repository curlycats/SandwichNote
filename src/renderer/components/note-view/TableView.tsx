import React, { useEffect, useState } from 'react';
import { db_Note } from '../../../types/note';
import { useRefreshEffect } from '../../hooks/useRefreshEffect';
import AddNoteButton from './AddNoteButton';
import CellRenderer from './CellRenderer';

const E = window.electron;

const TableView = () => {
  const [notes, setNotes] = useState<Array<db_Note>>([]);
  useRefreshEffect(() => {
    const fetchNotes = async () => {
      // E.db.drop('/Users/Flysandwich/Desktop/sandwichNote');
      const tempNotes = await E.db.loadNotes();
      console.log('Fetched Notes:', tempNotes);
      setNotes(tempNotes);
    };
    fetchNotes();
  }, []);

  return (
    <div className="flex flex-col overflow-x-auto">
      <div className="h-full flex flex-nowrap last:border-b-0">
        {Object.keys(notes[0] || {}).map((key) => (
          <div
            key={key}
            className="p-2 border-l border-b border-gray-300 w-32 grow-0 shrink-0
                overflow-x-hidden overflow-y-auto first:border-l-0"
          >
            {key}
          </div>
        ))}
      </div>
      {notes.map((note) => {
        return (
          <div className="h-full flex flex-nowrap" key={note.id}>
            {Object.entries(note).map(([key, value]) => (
              <div
                key={key}
                className="p-2 border-l border-b border-gray-300 w-32 grow-0 shrink-0
                overflow-x-hidden overflow-y-auto first:border-l-0"
              >
                {/* {value} */}
                <CellRenderer
                  type={'file'}
                  field={key as keyof db_Note}
                  note={note}
                />
              </div>
            ))}
          </div>
        );
      })}
      <AddNoteButton />
    </div>
  );
};

export default TableView;
