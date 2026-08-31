const express = require('express');
const router = express.Router();
const { getMatchingDevelopersForTask } = require('../controllers/matchingController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/task/:taskId', getMatchingDevelopersForTask);

module.exports = router;
