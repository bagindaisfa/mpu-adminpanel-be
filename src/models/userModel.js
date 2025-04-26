const pool = require('../config/db');

// Cari user berdasarkan username
async function findUserByUsername(username) {
  const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [
    username,
  ]);
  return rows[0];
}

module.exports = {
  findUserByUsername,
};
