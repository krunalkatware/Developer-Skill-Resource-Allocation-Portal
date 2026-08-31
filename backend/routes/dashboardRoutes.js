const express = require('express');
const router = express.Router();
const {
  getAdminDashboardStats,
  getDeveloperDashboardStats,
} = require('../controllers/dashboardController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);

router.get('/admin', adminOnly, getAdminDashboardStats);
router.get('/developer', getDeveloperDashboardStats);

module.exports = router;
