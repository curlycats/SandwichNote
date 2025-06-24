import React, { useEffect, useState } from 'react';
import { db_Note } from '../../db/types';

const E = window.electron;

const TableView = () => {
  const [notes, setNotes] = useState<Array<db_Note>>([]);
  useEffect(() => {
    const fetchNotes = async () => {
      // E.db.drop('/Users/Flysandwich/Desktop/sandwichNote');
      const tempNotes = await E.db.loadNotes();
      setNotes(tempNotes);
    };
    fetchNotes();
  }, []);

  return (
    <div>
      {notes.map((note) => {
        return (
          <div
            className="h-full flex flex-nowrap"
            key={note.id}
            contentEditable="plaintext-only"
          >
            {Object.entries(note).map(([key, value]) => (
              <div
                key={key}
                className="p-2 border border-gray-300 w-32  grow-0 shrink-0 overflow-x-hidden overflow-y-auto line-clamp-3 "
              >
                {value}
              </div>
            ))}
            {note.title}: {note.created_at.toString()}
          </div>
        );
      })}
    </div>
  );
};

export default TableView;
