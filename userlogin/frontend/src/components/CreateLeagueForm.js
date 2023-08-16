import React, { useState } from 'react';
import axios from 'axios';

function CreateLeagueForm({ user }) {
  const [leagueName, setLeagueName] = useState('');
  const [message, setMessage] = useState('');

  const handleCreateLeague = async () => {
    try {
      if (!user) {
        setMessage('You must be logged in to create a league.');
        return;
      }

      const response = await axios.post('http://localhost:5000/api/create-league', {
        user_id: user.id,
        name: leagueName,
      });

      setMessage(response.data.message);
      setLeagueName('');
    } catch (error) {
      console.error('League creation error:', error);
      setMessage('League creation failed');
    }
  };

  return (
    <div className="mt-4">
      <h3>Create a League</h3>
      <input
        type="text"
        placeholder="League Name"
        value={leagueName}
        onChange={(e) => setLeagueName(e.target.value)}
        className="w-full px-4 py-2 border rounded"
      />
      <button onClick={handleCreateLeague} className="mt-2 px-4 py-2 bg-green-500 text-white rounded">
        Create League
      </button>
      <p className="mt-2 text-red-600">{message}</p>
    </div>
  );
}

export default CreateLeagueForm;
