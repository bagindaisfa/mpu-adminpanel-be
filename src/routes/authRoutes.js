const express = require('express');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { login } = require('../controllers/authController');
const router = express.Router();

router.post('/login', login);
// router.get('/profile', authenticateToken, getProfile);

module.exports = router;
