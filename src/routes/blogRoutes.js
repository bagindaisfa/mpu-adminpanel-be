const express = require('express');
const router = express.Router();
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  getBlogNav,
  updateBlog,
  deleteBlog,
  getRelatedBlogs,
  getAllBlogsCompro,
  toggleVisibility,
} = require('../controllers/blogController');
const { upload } = require('../middlewares/upload');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Semua endpoint pakai authMiddleware
router.post('/', authenticateToken, upload.single('image'), createBlog);
router.get('/', getAllBlogs);
router.get('/compro', getAllBlogsCompro);
router.get('/:id', getBlogById);
router.get('/nav/:id', getBlogNav);
router.get('/related/:id', getRelatedBlogs);
router.put('/:id', authenticateToken, upload.single('image'), updateBlog);
router.delete('/:id', authenticateToken, deleteBlog);
router.patch('/:id/visibility', authenticateToken, toggleVisibility);

module.exports = router;
