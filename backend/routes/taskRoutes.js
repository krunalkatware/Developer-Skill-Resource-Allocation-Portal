const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  assignTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getTasks)
  .post(adminOnly, createTask);

router.route('/:id')
  .get(getTaskById)
  .put(adminOnly, updateTask)
  .delete(adminOnly, deleteTask);

router.put('/:id/status', updateTaskStatus);
router.put('/:id/assign', adminOnly, assignTask);

module.exports = router;
