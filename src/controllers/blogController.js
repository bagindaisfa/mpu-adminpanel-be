const pool = require('../config/db');

const getCategoryId = async (categoryName) => {
  // Cek apakah sudah ada
  const existing = await pool.query(
    'SELECT id FROM categories WHERE LOWER(name) = LOWER($1)',
    [categoryName]
  );
  return existing.rows[0].id;
};

// Create Blog
const createBlog = async (req, res) => {
  const { title, content, category } = req.body;
  const image = req.file ? req.file.path : null;

  try {
    const categoryId = await getCategoryId(category);
    const result = await pool.query(
      'INSERT INTO blogs (title, content, image_path, category_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, content, image, categoryId]
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
    const result = await pool.query(`
      SELECT b.id, b.title, b.content, b.image_path, b.created_at, c.name AS category
      FROM blogs b
      JOIN categories c ON b.category_id = c.id
      ORDER BY b.created_at DESC
    `);
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
    const result = await pool.query(
      `
      SELECT b.*, c.name AS category 
      FROM blogs b
      JOIN categories c ON b.category_id = c.id
      WHERE b.id = $1
    `,
      [id]
    );

    const baseUrl = process.env.BASE_URL;
    const blogsWithImages = result.rows.map((blog) => ({
      ...blog,
      image_path: `${baseUrl}/${blog.image_path}`, // Path disesuaikan
    }));
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blogsWithImages[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch blog' });
  }
};

const getBlogNav = async (req, res) => {
  const { id } = req.params;
  try {
    const currentPost = await pool.query(`SELECT * FROM blogs WHERE id = $1`, [
      id,
    ]);
    if (currentPost.rows.length === 0)
      return res.status(404).send({ error: 'Not found' });

    const prev = await pool.query(
      `SELECT id, title FROM blogs WHERE id < $1 ORDER BY id DESC LIMIT 1`,
      [id]
    );
    const next = await pool.query(
      `SELECT id, title FROM blogs WHERE id > $1 ORDER BY id ASC LIMIT 1`,
      [id]
    );

    res.json({
      previous: prev.rows[0] || null,
      next: next.rows[0] || null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch blog' });
  }
};

// Update Blog
const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, content, category } = req.body;
  const image = req.file ? req.file.path : null;

  try {
    const categoryId = await getCategoryId(category);
    const existing = await pool.query('SELECT * FROM blogs WHERE id = $1', [
      id,
    ]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const newImage = image ? image : existing.rows[0].image_path;

    const result = await pool.query(
      'UPDATE blogs SET title = $1, content = $2, image_path = $3, category_id = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
      [title, content, newImage, categoryId, id]
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
  getBlogNav,
  updateBlog,
  deleteBlog,
};
