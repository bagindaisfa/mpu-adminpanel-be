const pool = require('../config/db');

// Create Question
const createQuestion = async (req, res) => {
  const { question } = req.body;
  try {
    const query =
      'INSERT INTO assessment_questions (question) VALUES ($1) RETURNING *';
    const result = await pool.query(query, [question]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get All Questions
const getAllQuestions = async (req, res) => {
  try {
    const query = 'SELECT * FROM assessment_questions ORDER BY id ASC';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error getting questions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update Question
const updateQuestion = async (req, res) => {
  const { id } = req.params;
  const { question } = req.body;
  try {
    const query = `
      UPDATE assessment_questions
      SET question = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *`;
    const result = await pool.query(query, [question, id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Toggle Visibility
const toggleVisibility = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      UPDATE assessment_questions
      SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *`;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error toggling visibility:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createQuestion,
  getAllQuestions,
  updateQuestion,
  toggleVisibility,
};
