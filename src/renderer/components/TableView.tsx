import React, { useEffect, useState } from 'react';
import { db_Note } from '../../db/types';

const E = window.electron;

const TableView = () => {
  const [notes, setNotes] = useState<Array<db_Note>>([]);
  useEffect(() => {
    const fetchNotes = async () => {
      const db = await E.db.init('/Users/Flysandwich/Desktop/sandwichNote');
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
            className="h-full flex"
            key={note.id}
            contentEditable="plaintext-only"
          >
            {note.title}: {note.created_at.toString()}
          </div>
        );
      })}
    </div>
  );
};

export default TableView;
