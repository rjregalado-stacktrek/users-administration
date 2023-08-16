const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const pg = require('pg');
const cors = require('cors');

const app = express();
const PORT = 5000;
const dbConfig = {
  user: 'postgres',
  host: 'localhost',
  database: 'useradmindb',
  password: '123456$',
  port: 5432,
};

app.use(bodyParser.json());
app.use(cors());

const pool = new pg.Pool(dbConfig);

app.post('/api/register', async (req, res) => {
  const { username, user_email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (username, user_email, password) VALUES ($1, $2, $3)', [username, user_email, hashedPassword]);
    res.json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/create-league', async (req, res) => {
  const { user_id, name } = req.body;

  try {
    await pool.query('INSERT INTO leagues (user_id, name) VALUES ($1, $2)', [user_id, name]);
    res.json({ message: 'League created successfully' });
  } catch (error) {
    console.error('League creation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
