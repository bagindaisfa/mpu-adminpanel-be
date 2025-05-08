const pool = require('../config/db');

const saveContactMessage = async (req, res) => {
  const { name, email, subject, number, message } = req.body;

  try {
    await pool.query(
      'INSERT INTO contact_messages (name, email, subject, number, message) VALUES ($1, $2, $3, $4, $5)',
      [name, email, subject, number, message]
    );
    res.status(201).json({ message: 'Message saved successfully' });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
};

const getAllContacts = async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT id, name, email, subject, "number", message, created_at
        FROM contact_messages ORDER BY created_at DESC
      `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch contacts' });
  }
};

module.exports = { saveContactMessage, getAllContacts };
