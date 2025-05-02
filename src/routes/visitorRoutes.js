const express = require('express');
const router = express.Router();
const {
  createVisitor,
  getVisitorStats,
} = require('../controllers/visitorController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// POST /visitors -> record visitor
router.post('/', createVisitor);

// GET /visitors/stats -> ambil statistik visitor
router.get('/stats', authenticateToken, getVisitorStats);

module.exports = router;
