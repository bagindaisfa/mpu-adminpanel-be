const express = require('express');
const router = express.Router();
const {
  createQuestion,
  getAllQuestions,
  updateQuestion,
  toggleVisibility,
  getAllQuestionsCompro,
} = require('../controllers/assessmentController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Create Question
router.post('/', authenticateToken, createQuestion);

// Get All Questions
router.get('/', authenticateToken, getAllQuestions);

router.get('/compro', getAllQuestionsCompro);

// Update Question
router.put('/:id', authenticateToken, updateQuestion);

// Toggle Visibility
router.patch('/:id/visibility', authenticateToken, toggleVisibility);

module.exports = router;
