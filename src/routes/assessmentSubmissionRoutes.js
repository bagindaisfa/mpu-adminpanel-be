const express = require('express');
const {
  submitAssessment,
} = require('../controllers/assessmentSubmissionController');

const router = express.Router();

// Submit assessment
router.post('/submit', submitAssessment);

module.exports = router;
