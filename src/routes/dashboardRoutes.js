const express = require('express');
const router = express.Router();
const {
  getStats,
  getLatestBlogs,
  getLatestComments,
  getLatestAssessments,
} = require('../controllers/dashboardController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.get('/stats', authenticateToken, getStats);
router.get('/latest-blogs', authenticateToken, getLatestBlogs);
router.get('/latest-comments', authenticateToken, getLatestComments);
router.get('/latest-assessments', authenticateToken, getLatestAssessments);

module.exports = router;
