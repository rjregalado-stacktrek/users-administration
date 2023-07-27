import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/notes', {
        headers: { Authorization: localStorage.getItem('accessToken') },
      });
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error.response.data.error);
    }
  };

  const handleCreateNote = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/notes',
        formData,
        {
          headers: { Authorization: localStorage.getItem('accessToken') },
        }
      );

      if (response.status === 201) {
        fetchNotes();
        setFormData({ title: '', content: '' });
      }
    } catch (error) {
      console.error('Error creating note:', error.response.data.error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/notes/${noteId}`,
        {
          headers: { Authorization: localStorage.getItem('accessToken') },
        }
      );

      if (response.status === 200) {
        fetchNotes();
      }
    } catch (error) {
      console.error('Error deleting note:', error.response.data.error);
    }
  };

  return (
    <div>
      <h2>Notes</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                title: e.target.value,
              }))
            }
            required
          />
        </div>
        <div>
          <label>Content:</label>
          <textarea
            value={formData.content}
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                content: e.target.value,
              }))
            }
            required
          />
        </div>
        <div>
          <button type="button" onClick={handleCreateNote}>
            Create Note
          </button>
        </div>
      </form>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <strong>{note.title}</strong>
            <p>{note.content}</p>
            <button type="button" onClick={() => handleDeleteNote(note.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notes;

