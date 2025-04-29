const pool = require('../config/db');

// 1. Stats Summary
const getStats = async (req, res) => {
  try {
    const blogs = await pool.query('SELECT COUNT(*) FROM blogs');
    const comments = await pool.query('SELECT COUNT(*) FROM blog_comments');
    const assessments = await pool.query(
      'SELECT COUNT(*) FROM assessment_answers'
    );
    const visitors = await pool.query('SELECT COUNT(*) FROM visitors');

    const data = [
      { title: 'Total Blogs', value: blogs.rows[0].count },
      { title: 'Total Comments', value: comments.rows[0].count },
      {
        title: 'Total Assessments Submitted',
        value: assessments.rows[0].count,
      },
      { title: 'Total Visitors', value: visitors.rows[0].count },
    ];

    res.json({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
};

// 2. Latest Blogs
const getLatestBlogs = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, title, TO_CHAR(created_at, 'YYYY-MM-DD') AS date
      FROM blogs
      ORDER BY created_at DESC
      LIMIT 5
    `);

    res.json({ data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch latest blogs' });
  }
};

// 3. Latest Comments
const getLatestComments = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, name, comment, TO_CHAR(created_at, 'YYYY-MM-DD') AS date
      FROM blog_comments
      ORDER BY created_at DESC
      LIMIT 5
    `);

    res.json({ data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch latest comments' });
  }
};

// 4. Latest Assessments (substitusi visitor terbaru)
const getLatestAssessments = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, user_name AS name, user_email AS email, user_phone AS phone, TO_CHAR(created_at, 'YYYY-MM-DD') AS date
      FROM assessment_answers
      WHERE user_name IS NOT NULL
      ORDER BY created_at DESC
      LIMIT 5
    `);

    res.json({ data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch latest assessments' });
  }
};

module.exports = {
  getStats,
  getLatestBlogs,
  getLatestComments,
  getLatestAssessments,
};
