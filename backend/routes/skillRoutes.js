const express = require('express');
const router = express.Router();
const {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} = require('../controllers/skillController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getSkills)
  .post(adminOnly, createSkill);

router.route('/:id')
  .put(adminOnly, updateSkill)
  .delete(adminOnly, deleteSkill);

module.exports = router;
