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

    res.status(201).json({
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

const getAllComments = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, blog_id, name, email, comment, is_approved, created_at
       FROM blog_comments
       ORDER BY created_at DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const updateCommentApproval = async (req, res) => {
  const { commentId } = req.params;
  const { is_approved } = req.body; // true or false

  try {
    const result = await pool.query(
      `UPDATE blog_comments
       SET is_approved = $1
       WHERE id = $2
       RETURNING *`,
      [is_approved, commentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Comment not found.' });
    }

    res.json({
      message: 'Comment approval status updated.',
      comment: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating comment approval:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const deleteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM blog_comments WHERE id = $1 RETURNING *`,
      [commentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Comment not found.' });
    }

    res.json({ message: 'Comment deleted successfully.' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = {
  createComment,
  getCommentsByBlog,
  getAllComments,
  updateCommentApproval,
  deleteComment,
};
