const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Pool } = require('pg');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json())


const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'usersAdmin',
  password: '123456$',
  port: 5432,
});

const ACCESS_TOKEN_SECRET = generateSecretKey();
const REFRESH_TOKEN_SECRET = generateSecretKey();
console.log(`ATS: ${ACCESS_TOKEN_SECRET}`)
console.log(`RTS: ${REFRESH_TOKEN_SECRET}`)

// Function to generate a strong secret key for JWT
function generateSecretKey() {
  return crypto.randomBytes(64).toString('hex');
}

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  try {
    const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token.' });
  }
}

// Middleware to check if user is an admin
function isAdmin(req, res, next) {
  const userRole = req.user.role;

  if (userRole !== 'admin') {
    return res.status(403).json({ error: 'Access forbidden. Admin rights required.' });
  }

  next();
}

// Middleware to check if user can update/delete a specific note
function canUpdateOrDeleteNote(req, res, next) {
  const userRole = req.user.role;
  const noteOwnerId = req.note.user_id;

  if (userRole === 'admin' || req.user.id === noteOwnerId) {
    // Admin or the owner of the note can update/delete
    return next();
  }

  return res.status(403).json({ error: 'Access forbidden. You are not authorized to update/delete this note.' });
}

// Route for user registration
app.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const client = await pool.connect();
    await client.query(
      'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)',
      [username, email, hashedPassword, role]
    );
    
    const user = result.rows[0]; // Get the inserted user details
    
    client.release();
    
    const accessToken = generateAccessToken(user.id, user.username, user.role);
    console.log(accessToken)
    const refreshToken = generateRefreshToken(user.id, user.username, user.role);
    console.log(refreshToken)

    return res.status(201).json({ message: 'User registered successfully!', accessToken, refreshToken });
    //res.status(201).json({ message: 'User registered successfully!' });
    
  } catch (error) {
    res.status(500).json({ error: 'Error registering user.' });
  }
});

// Route for user registration
app.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)',
      [username, email, hashedPassword, role]
    );
    res.json(result)
    
    //client.release();
    
    const accessToken = generateAccessToken(username, email, role); // Use username and email here
    console.log(accessToken);
    const refreshToken = generateRefreshToken(username, email, role); // Use username and email here
    console.log(refreshToken);

    res.status(201).json({ message: 'User registered successfully!', accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user.' });
  }
});



// Route for getting user's notes
app.get('/notes', isAuthenticated, async (req, res) => {
  const userId = req.user.id;

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM notes WHERE user_id = $1', [userId]);
    client.release();
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error getting notes.' });
  }
});

// Route for creating a note
app.post('/notes', isAuthenticated, async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;

  try {
    const client = await pool.connect();
    await client.query('INSERT INTO notes (title, content, user_id) VALUES ($1, $2, $3)', [title, content, userId]);
    client.release();
    res.status(201).json({ message: 'Note created successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Error creating note.' });
  }
});

// Route for updating a note
app.put('/notes/:noteId', isAuthenticated, canUpdateOrDeleteNote, async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content } = req.body;

  try {
    const client = await pool.connect();
    await client.query('UPDATE notes SET title = $1, content = $2 WHERE id = $3', [title, content, noteId]);
    client.release();
    res.status(200).json({ message: 'Note updated successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating note.' });
  }
});

// Route for deleting a note
app.delete('/notes/:noteId', isAuthenticated, canUpdateOrDeleteNote, async (req, res) => {
  const noteId = req.params.noteId;

  try {
    const client = await pool.connect();
    await client.query('DELETE FROM notes WHERE id = $1', [noteId]);
    client.release();
    res.status(200).json({ message: 'Note deleted successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting note.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


/*

1. **Importing Required Modules:**
   - The code starts by importing required modules from various npm packages. These modules are essential for building the server and handling different functionalities. The modules include:
     - `express`: A popular web framework for Node.js that simplifies building web applications and APIs.
     - `body-parser`: Middleware to parse incoming request bodies, allowing us to access data sent in the request.
     - `cors`: Middleware that enables Cross-Origin Resource Sharing, allowing requests from different origins to access the server.
     - `bcryptjs`: A library for hashing passwords securely.
     - `jsonwebtoken`: A library for generating and verifying JSON Web Tokens (JWTs) for authentication.
     - `crypto`: A Node.js module for generating cryptographic functions, used to generate the secret key for JWT.

2. **Creating Express App and Setting Up Middleware:**
   - The code creates an instance of an Express application using `express()` and assigns it to the `app` variable.
   - It sets up middleware using `app.use()`:
     - `bodyParser.json()`: Parses incoming JSON data in the request body.
     - `cors()`: Enables CORS for cross-origin requests.

3. **Setting Up PostgreSQL Database Connection:**
   - The code creates a `pool` object using the `pg` module, which provides a connection pool to interact with the PostgreSQL database.
   - The database connection details (username, host, database name, password, and port) are specified in the `pool` configuration.

4. **Generating Secret Key for JWT:**
   - The code defines a function `generateSecretKey()` to create a strong random secret key for JWT.
   - The generated secret key is stored in the `secretKey` variable, which will be used for signing and verifying JWTs.

5. **Authentication Middleware (isAuthenticated):**
   - The `isAuthenticated` middleware is defined to check if the user making a request is authenticated (i.e., has a valid JWT).
   - It reads the JWT from the `Authorization` header of the request, decodes the token using the `jwt.verify()` method, and attaches the decoded user information to the request object (`req.user`).
   - If the JWT is missing or invalid, the middleware returns a 401 status with an error message.

6. **Authorization Middleware (isAdmin and canUpdateOrDeleteNote):**
   - The `isAdmin` middleware checks if the authenticated user is an admin by inspecting the `role` property in the decoded JWT (`req.user.role`).
   - The `canUpdateOrDeleteNote` middleware checks if the authenticated user has the permission to update or delete a specific note. It compares the user's role and user ID with the note's owner ID.
   - If the user is not an admin and not the owner of the note, the middleware returns a 403 status with an error message.

7. **Routes for User Registration and Login:**
   - The server defines two routes: `/register` and `/login` for user registration and login, respectively.
   - When a client sends a POST request to `/register`, the server hashes the password, inserts the user's details (username, email, hashed password, and role) into the `users` table in the database.
   - When a client sends a POST request to `/login`, the server checks the username, fetches the user's details from the `users` table, and compares the hashed password with the provided password. If the credentials are valid, it generates a JWT and sends it back to the client.

8. **Routes for CRUD Operations on Notes:**
   - The server defines routes for CRUD operations on notes (`/notes`). These routes are protected with the `isAuthenticated` middleware to ensure that only authenticated users can access them.
   - The routes include:
     - `GET /notes`: Fetches notes associated with the authenticated user's ID from the `notes` table in the database.
     - `POST /notes`: Creates a new note in the `notes` table with the provided title, content, and the authenticated user's ID.
     - `PUT /notes/:noteId`: Updates the title and content of a specific note (specified by `noteId`) in the `notes` table. The request is also checked with the `canUpdateOrDeleteNote` middleware to ensure the user has the appropriate permissions.
     - `DELETE /notes/:noteId`: Deletes a specific note (specified by `noteId`) from the `notes` table. The request is also checked with the `canUpdateOrDeleteNote` middleware to ensure the user has the appropriate permissions.

9. **Listening to Server Port:**
   - The server listens on the specified port (`5000`) and prints a message in the console indicating that the server is running.

*/

/*

Access tokens will be used for authenticating and authorizing API requests, while refresh tokens will be used to obtain new access tokens when the old ones expire.

*/
