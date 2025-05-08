const express = require('express');
const {
  saveContactMessage,
  getAllContacts,
} = require('../controllers/contactController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/contact', saveContactMessage);
router.get('/contacts', authenticateToken, getAllContacts);

module.exports = router;
