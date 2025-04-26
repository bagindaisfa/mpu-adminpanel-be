const pool = require('../config/db');
const bcrypt = require('bcrypt');

// Get All Users
const getUsers = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username FROM users ORDER BY id ASC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

// Create New User
const createUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [
      username,
      hashedPassword,
    ]);

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

// Update User (Only username and password)
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'UPDATE users SET username = $1, password = $2 WHERE id = $3',
      [username, hashedPassword, id]
    );

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};

module.exports = { getUsers, createUser, updateUser, deleteUser };
