-- Create the database (replace 'your_database_name' with your desired database name)
CREATE DATABASE usersAdmin;

-- Connect to the newly created database
\c usersAdmin;

-- Create the 'users' table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL
);

-- Create the 'notes' table
CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

-- Create a default admin user (You can customize this as per your application's needs)
INSERT INTO users (username, email, password, role) VALUES ('admin', 'admin@example.com', 'adminpassword', 'admin');

SELECT * FROM users;

-- Add sample notes associated with the user ID 1 (Assuming user ID 1 is the admin)
INSERT INTO notes (title, content, user_id) VALUES
  ('Note 1', 'This is the content of Note 1', 1),
  ('Note 2', 'This is the content of Note 2', 1),
  ('Note 3', 'This is the content of Note 3', 1);
  ('Note 4', 'This is the content of Note 3', 5);

-- Add sample notes associated with the user ID 2 (Assuming user ID 2 is a regular user)
INSERT INTO notes (title, content, user_id) VALUES
  ('User Note 1', 'This is the content of User Note 1', 2),
  ('User Note 2', 'This is the content of User Note 2', 2);

-- Add sample data to the 'users' table
INSERT INTO users (username, email, password, role) VALUES
  ('user5', 'user1@example.com', 'user1password', 'user'),

SELECT * FROM notes;

















-- Create a default admin user (You can customize this as per your application's needs)
INSERT INTO users (username, email, password, role) VALUES ('admin', 'admin@example.com', 'adminpassword', 'admin');
