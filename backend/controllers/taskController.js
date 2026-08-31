const Task = require('../models/Task');
const User = require('../models/User');
const Project = require('../models/Project');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { project, status, priority, assignedDeveloper, search } = req.query;
    let query = {};

    if (project && project !== 'All') {
      query.project = project;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    if (assignedDeveloper) {
      if (assignedDeveloper === 'unassigned') {
        query.assignedDeveloper = null;
      } else if (assignedDeveloper !== 'All') {
        query.assignedDeveloper = assignedDeveloper;
      }
    }

    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    const tasks = await Task.find(query)
      .populate('project', 'name client status priority')
      .populate('requiredSkills', 'name category')
      .populate('assignedDeveloper', 'name email designation availability')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name client status priority')
      .populate('requiredSkills', 'name category description')
      .populate('assignedDeveloper', 'name email designation department availability skills');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private/Admin
const createTask = async (req, res, next) => {
  try {
    const { project, title, description, priority, status, estimatedHours, deadline, requiredSkills, assignedDeveloper } = req.body;

    if (!title || !project) {
      return res.status(400).json({ success: false, message: 'Task title and project are required' });
    }

    const task = await Task.create({
      project,
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: priority || 'Medium',
      status: status || 'To Do',
      estimatedHours: Number(estimatedHours) || 8,
      deadline: deadline || null,
      requiredSkills: requiredSkills || [],
      assignedDeveloper: assignedDeveloper || null,
    });

    const populated = await Task.findById(task._id)
      .populate('project', 'name client status')
      .populate('requiredSkills', 'name')
      .populate('assignedDeveloper', 'name email designation availability');

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task details
// @route   PUT /api/tasks/:id
// @access  Private/Admin
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const { project, title, description, priority, status, estimatedHours, deadline, requiredSkills, assignedDeveloper } = req.body;

    if (project) task.project = project;
    if (title) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (priority) task.priority = priority;
    if (status) task.status = status;
    if (estimatedHours !== undefined) task.estimatedHours = Number(estimatedHours);
    if (deadline !== undefined) task.deadline = deadline;
    if (requiredSkills !== undefined) task.requiredSkills = requiredSkills;
    if (assignedDeveloper !== undefined) task.assignedDeveloper = assignedDeveloper || null;

    await task.save();

    const populated = await Task.findById(task._id)
      .populate('project', 'name client status')
      .populate('requiredSkills', 'name')
      .populate('assignedDeveloper', 'name email designation availability');

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task status (Accessible by assigned developer or Admin)
// @route   PUT /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['To Do', 'In Progress', 'Completed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Role check: If developer, must be assigned to this task
    if (req.user.role === 'developer' && (!task.assignedDeveloper || task.assignedDeveloper.toString() !== req.user._id.toString())) {
      return res.status(403).json({ success: false, message: 'You are only authorized to update tasks assigned to you' });
    }

    task.status = status;
    await task.save();

    const populated = await Task.findById(task._id)
      .populate('project', 'name client status')
      .populate('requiredSkills', 'name')
      .populate('assignedDeveloper', 'name email designation availability');

    res.json({
      success: true,
      message: `Task status updated to ${status}`,
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign developer to task
// @route   PUT /api/tasks/:id/assign
// @access  Private/Admin
const assignTask = async (req, res, next) => {
  try {
    const { developerId } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (developerId) {
      const developer = await User.findById(developerId);
      if (!developer || developer.role !== 'developer') {
        return res.status(404).json({ success: false, message: 'Developer not found' });
      }
      task.assignedDeveloper = developer._id;
    } else {
      task.assignedDeveloper = null;
    }

    await task.save();

    const populated = await Task.findById(task._id)
      .populate('project', 'name client status priority')
      .populate('requiredSkills', 'name category')
      .populate('assignedDeveloper', 'name email designation department availability');

    res.json({
      success: true,
      message: developerId ? `Developer assigned successfully` : `Task unassigned successfully`,
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  assignTask,
  deleteTask,
};
