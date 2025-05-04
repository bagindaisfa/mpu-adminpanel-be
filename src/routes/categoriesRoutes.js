const express = require('express');
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoriesController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Endpoint: /api/categories
router.post('/', authenticateToken, createCategory);
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.put('/:id', authenticateToken, updateCategory);
router.delete('/:id', authenticateToken, deleteCategory);

module.exports = router;
