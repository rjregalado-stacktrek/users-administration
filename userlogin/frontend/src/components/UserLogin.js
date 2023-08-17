import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

//import components
//import UserDashboard from './UserDashboard'


const UserLogin = () => {
    const [username, setUsername] = useState('')
    const [pass, setPassword] = useState('')
    const [message, setMessage] = useState('')

    const handleLogin = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post(`http://localhost:5000/user/login`, {username, pass})
        setMessage(response.data.message)

        //console.log(`Message: ${message}`)

      } catch (error) {
        console.error('Login error:', error)
        setMessage('Authentication failed')
        //alert('Authentication failed')
      }
    }

    const handleLogout = () => {
      setMessage('');
    };
      
  return (
    <>
    
    <div className="container mx-auto">
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-16 rounded shadow-2xl w-2/3">

          { message  ? (
            <div>
              {message && <p>{message}</p>}
         
              <button 
              className="block w-full bg-rescue-orange hover:bg-navy-blue hover:from-red-100 hover:to-blue-400 p-4 rounded text-gray-700 hover:text-gray-600 transition duration-300 font-bold text-sm"
              onClick={handleLogout}
              type="submit"
              >Log-Out</button>

            </div>
          ) : (
            <div>
            </div>
          )}

          <h2 className="text-3xl font-bold mb-3 text-gray-800">Log-in</h2>
          <div className="pb-5 mb-5 text-sm text-left text-gray-400">
            <p>You don´t have an account? &nbsp;
            <Link to="/uregistration" className="text-rescue-orange">Register now!</Link></p>
          </div>

          <form className="space-y-5">

            <div>
              <label className="block mb-1 font-bold text-gray-500">User Name</label>
              <input 
                type="text" 
                name="username"
                placeholder="username"
                className="w-full border-2 border-purity p-3 rounded outline-none focus:border-marble-blue" 
                onChange={(e) => setUsername(e.target.value)}/>
            </div>

            <div>
              <label className="block mb-1 font-bold text-gray-500">Password</label>
              <input 
                type="password" 
                name="pass"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-purity p-3 rounded outline-none focus:border-marble-blue" 
                />
            </div>

            <button 
              className="block w-full bg-rescue-orange hover:bg-navy-blue hover:from-red-100 hover:to-blue-400 p-4 rounded text-gray-700 hover:text-gray-600 transition duration-300 font-bold text-sm"
              onClick={handleLogin}
              type="submit"
              >Log-In</button>

          </form>
        </div>
      </div>
    </div>
  </>
  )
}

export default UserLogin