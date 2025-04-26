const pool = require('../config/db');

const createComment = async (req, res) => {
  const blogId = req.params.id;
  const { name, email, comment } = req.body;

  if (!name || !email || !comment) {
    return res
      .status(400)
      .json({ message: 'Name, email, and comment are required.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO blog_comments (blog_id, name, email, comment)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [blogId, name, email, comment]
    );

    res
      .status(201)
      .json({
        message: 'Comment created successfully.',
        comment: result.rows[0],
      });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getCommentsByBlog = async (req, res) => {
  const blogId = req.params.id;

  try {
    const result = await pool.query(
      `SELECT id, name, comment, created_at FROM blog_comments
       WHERE blog_id = $1
       ORDER BY created_at DESC`,
      [blogId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = {
  createComment,
  getCommentsByBlog,
};
