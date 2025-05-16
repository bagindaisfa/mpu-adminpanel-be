const express = require('express');
const router = express.Router();
const { scheduleConsultation } = require('../controllers/scheduleController');

router.post('/', scheduleConsultation);

module.exports = router;
