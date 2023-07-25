import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Notes = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/notes', {
        headers: { Authorization: localStorage.getItem('token') },
      });
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error.response.data.error);
    }
  };

  return (
    <div>
      <h2>Notes</h2>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <strong>{note.title}</strong>
            <p>{note.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notes;
