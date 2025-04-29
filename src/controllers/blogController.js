const pool = require('../config/db');

// Create Blog
const createBlog = async (req, res) => {
  const { title, content } = req.body;
  const image = req.file ? req.file.path : null;

  try {
    const result = await pool.query(
      'INSERT INTO blogs (title, content, image_path) VALUES ($1, $2, $3) RETURNING *',
      [title, content, image]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create blog' });
  }
};

// Get All Blogs
const getAllBlogs = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, title, content, image_path, created_at FROM blogs ORDER BY created_at DESC'
    );

    const baseUrl = process.env.BASE_URL;
    const blogsWithImages = result.rows.map((blog) => ({
      ...blog,
      image_path: `${baseUrl}/${blog.image_path}`, // Path disesuaikan
    }));

    res.json(blogsWithImages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch blogs' });
  }
};

// Get Blog by ID
const getBlogById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM blogs WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch blog' });
  }
};

// Update Blog
const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const image = req.file ? req.file.path : null;

  try {
    const existing = await pool.query('SELECT * FROM blogs WHERE id = $1', [
      id,
    ]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const newImage = image ? image : existing.rows[0].image_path;

    const result = await pool.query(
      'UPDATE blogs SET title = $1, content = $2, image_path = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [title, content, newImage, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update blog' });
  }
};

// Delete Blog
const deleteBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM blogs WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete blog' });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};
