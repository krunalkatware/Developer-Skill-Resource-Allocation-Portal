const express = require('express');
const router = express.Router();
const {
  getDevelopers,
  getDeveloperById,
  createDeveloper,
  updateDeveloper,
  deleteDeveloper,
} = require('../controllers/developerController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getDevelopers)
  .post(adminOnly, createDeveloper);

router.route('/:id')
  .get(getDeveloperById)
  .put(adminOnly, updateDeveloper)
  .delete(adminOnly, deleteDeveloper);

module.exports = router;
