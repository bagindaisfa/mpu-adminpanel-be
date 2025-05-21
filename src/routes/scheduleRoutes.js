const express = require('express');
const router = express.Router();
const {
  scheduleConsultation,
  getAllSchedules,
} = require('../controllers/scheduleController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.post('/', scheduleConsultation);
router.get('/get-schedules', authenticateToken, getAllSchedules);

module.exports = router;
