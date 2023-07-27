import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', formData);

      if (response.status === 200) {
        const data = response.data;
        // Store the access token and refresh token securely
        localStorage.setItem('accessToken', data.token);
        // You may receive a refresh token in the response, you can store it as well.
        // localStorage.setItem('refreshToken', data.refreshToken);
        alert('Login successful!');
        navigate('/notes'); // Redirect to user notes page
      } else {
        console.error('Error logging in:', response.data.error);
        alert('Error logging in. Please try again.');
      }
    } catch (error) {
      console.error('Error logging in:', error.response.data.error);
      alert('Error logging in. Please try again.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;

