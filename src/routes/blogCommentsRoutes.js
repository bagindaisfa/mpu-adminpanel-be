const express = require('express');
const {
  createComment,
  getCommentsByBlog,
  getAllComments,
  updateCommentApproval,
  deleteComment,
} = require('../controllers/blogCommentsController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public: Create comment
router.post('/:id', createComment);

// Public: Get comments per blog
router.get('/:id', getCommentsByBlog);

// Admin: Get all comments
router.get('/', authenticateToken, getAllComments);

// Admin: Approve/unapprove comment
router.put('/:commentId', authenticateToken, updateCommentApproval);

// Admin: Delete comment
router.delete('/:commentId', authenticateToken, deleteComment);

module.exports = router;
