import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [username, setUsername] = useState('');
  const [user_email, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/register', { username, user_email, password });
      setMessage(response.data.message);
      
      setUsername('');
      setUserEmail('');
      setPassword('');


    } catch (error) {
      console.error('Registration error:', error);
      setMessage('Registration failed');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/login', { username, password });
      setMessage(response.data.message);
      
      setUsername('');
      setUserEmail('');
      setPassword('');

    } catch (error) {
      console.error('Login error:', error);
      setMessage('Authentication failed');
    }
  };

  const handleLogout = () => {
    setMessage('');

  };

  return (
    <div className="centered text-xl h-screen bg-gray-100">
      <div className="login-container mx-auto p-4 bg-white rounded shadow-md">
        <h2 className="text-blue-900 text-4xl text-center py-2">User Authentication</h2>
        {message ? (
          <div className="py-2 text-center">
            <p>{message}</p>
            <button onClick={handleLogout} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
              Logout
            </button>
          </div>
        ) : (
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 mb-2 border rounded"
            />
            <input
              type="text"
              placeholder="Email"
              value={user_email}
              onChange={(e) => setUserEmail(e.target.value)}
              className="w-full px-4 py-2 mb-2 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mb-4 border rounded"
            />
            <button onClick={handleRegister} className="w-full px-4 py-2 bg-green-500 text-white rounded">
              Register
            </button>
            
            <button onClick={handleLogin} className="w-full mt-2 px-4 py-2 bg-blue-500 text-white rounded">
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

/// import React, { useState } from 'react';
// import axios from 'axios';
// import CreateLeagueForm from './components/CreateLeagueForm';

// function App() {
//   const [username, setUsername] = useState('');
//   const [user_email, setUserEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [user, setUser] = useState('');
//   const [message, setMessage] = useState('');

//   const handleRegister = async () => {
//     try {
//       const response = await axios.post('http://localhost:5000/api/register', { username, user_email, password });
//       setMessage(response.data.message);
//     } catch (error) {
//       console.error('Registration error:', error);
//       setMessage('Registration failed');
//     }
//   };

//   const handleLogin = async () => {
//     try {
//       const response = await axios.post('http://localhost:5000/api/login', { username, password });
//       setMessage(response.data.message);
//     } catch (error) {
//       console.error('Login error:', error);
//       setMessage('Authentication failed');
//     }
//   };

//   const handleLogout = () => {
//     setUser('');
//     setMessage('');
//   };


//   return (
//     <div className="centered text-xl h-screen bg-gray-100">
//       <div className="login-container mx-auto p-4 bg-white rounded shadow-md">
//         <h2 className="text-blue-900 text-4xl text-center py-2">User Authentication</h2>
//         {user ? (
//           <div className="py-2 text-center">
//             <p>{message}</p>
//             <button onClick={handleLogout} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
//               Logout
//             </button>
//           </div>
//         ) : (
//           <div>
//             <input
//               type="text"
//               placeholder="Username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="w-full px-4 py-2 mb-2 border rounded"
//             />
//             <input
//               type="text"
//               placeholder="Email"
//               value={user_email}
//               onChange={(e) => setUserEmail(e.target.value)}
//               className="w-full px-4 py-2 mb-2 border rounded"
//             />
//             <input
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-4 py-2 mb-4 border rounded"
//             />
//             <button onClick={handleRegister} className="w-full px-4 py-2 bg-green-500 text-white rounded">
//               Register
//             </button>
//             <button onClick={handleLogin} className="w-full mt-2 px-4 py-2 bg-blue-500 text-white rounded">
//               Login
//             </button>
//           </div>
//         )}
//           {user && <CreateLeagueForm user={user} />}
//       </div>
//     </div>
//   );
// }

// export default App;
