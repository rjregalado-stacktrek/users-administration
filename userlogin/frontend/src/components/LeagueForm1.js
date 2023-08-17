import React, { useState } from 'react';
import './LeagueForm.css';
import axios from 'axios';
import Matches from '../pages/Matches';

const LeagueForm = () => {
  const [leagueData, setLeagueData] = useState({
    league_id: '',
    league_name: '',
    user_id: '',
    start_date: '',
  });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  const [message, setMessage] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setLeagueData({
      ...leagueData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form data:', leagueData);
    // You can perform further actions here, such as sending the form data to a server.
  };

  const handleLeague = async () => {
    try {
      const response = await axios.post('http://localhost:3001/League', leagueData);
      setMessage(response.data.message);
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <button
        onClick={() => setIsPopupOpen(true)}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
      >
        Create League
      </button>

      {isPopupOpen && (
        <div className="popup">
          <div className="popup-inner">
            <button onClick={() => setIsPopupOpen(false)} className="close-button">
              Close
            </button>
            <h2 className="text-2xl font-semibold mb-4">League Data Form</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* ... rest of the form */}
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                onClick={handleLeague}
              >
                Submit
              </button>
              <Matches />
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeagueForm;
