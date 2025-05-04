const pool = require('../config/db');

// Create Category
const createCategory = async (req, res) => {
  const { name } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO categories (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      // duplicate name
      res.status(400).json({ message: 'Category already exists' });
    } else {
      res.status(500).json({ message: 'Failed to create category' });
    }
  }
};

// Get All Categories
const getAllCategories = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM categories ORDER BY name ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
};

// Get Category by ID
const getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM categories WHERE id = $1', [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch category' });
  }
};

// Update Category
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const existing = await pool.query(
      'SELECT * FROM categories WHERE id = $1',
      [id]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const result = await pool.query(
      'UPDATE categories SET name = $1 WHERE id = $2 RETURNING *',
      [name, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      res.status(400).json({ message: 'Category name already exists' });
    } else {
      res.status(500).json({ message: 'Failed to update category' });
    }
  }
};

// Delete Category
const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM categories WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete category' });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
