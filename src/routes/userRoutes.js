const express = require('express');
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Semua route ini wajib login
router.get('/', authenticateToken, getUsers);
router.post('/', authenticateToken, createUser);
router.put('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateToken, deleteUser);

module.exports = router;
