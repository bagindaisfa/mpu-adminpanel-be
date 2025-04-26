const express = require('express');
const { check } = require('express-validator');
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Validate User input
const userValidation = [
  check('username')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

// Semua route ini wajib login dan validasi input
router.get('/', authenticateToken, getUsers);
router.get('/:id', authenticateToken, getUserById);
router.post('/', authenticateToken, userValidation, createUser);
router.put('/:id', authenticateToken, userValidation, updateUser);
router.delete('/:id', authenticateToken, deleteUser);

module.exports = router;
