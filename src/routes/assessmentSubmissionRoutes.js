const express = require('express');
const {
  submitAssessment,
  getAllAssessmentAnswers,
} = require('../controllers/assessmentSubmissionController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authenticateToken, getAllAssessmentAnswers);
// Submit assessment
router.post('/submit', submitAssessment);

module.exports = router;
