const express = require('express');
const {
  createComment,
  getCommentsByBlog,
} = require('../controllers/blogCommentsController');

const router = express.Router();

// Create comment
router.post('/:id', createComment);

// Get all comments for a blog
router.get('/:id', getCommentsByBlog);

module.exports = router;
