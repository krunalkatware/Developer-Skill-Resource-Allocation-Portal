const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Get all projects with task/dev statistics
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res, next) => {
  try {
    const { search, status, priority } = req.query;
    let query = {};

    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: searchRegex }, { client: searchRegex }, { description: searchRegex }];
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    const projects = await Project.find(query).sort({ createdAt: -1 });

    const projectsWithStats = await Promise.all(
      projects.map(async (project) => {
        const tasks = await Task.find({ project: project._id });
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
        const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;
        const todoTasks = tasks.filter((t) => t.status === 'To Do').length;
        const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        // Unique assigned developers
        const developerIds = [
          ...new Set(
            tasks
              .filter((t) => t.assignedDeveloper)
              .map((t) => t.assignedDeveloper.toString())
          ),
        ];

        return {
          ...project.toObject(),
          totalTasks,
          completedTasks,
          inProgressTasks,
          todoTasks,
          progress,
          developerCount: developerIds.length,
        };
      })
    );

    res.json({ success: true, count: projectsWithStats.length, data: projectsWithStats });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project details with tasks and assigned developers
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate('createdBy', 'name email');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const tasks = await Task.find({ project: project._id })
      .populate('requiredSkills', 'name category')
      .populate('assignedDeveloper', 'name email department designation availability skills')
      .sort({ createdAt: -1 });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
    const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;
    const todoTasks = tasks.filter((t) => t.status === 'To Do').length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Collect distinct assigned developers
    const devMap = new Map();
    tasks.forEach((t) => {
      if (t.assignedDeveloper && t.assignedDeveloper._id) {
        devMap.set(t.assignedDeveloper._id.toString(), t.assignedDeveloper);
      }
    });

    const assignedDevelopers = Array.from(devMap.values());

    res.json({
      success: true,
      data: {
        ...project.toObject(),
        tasks,
        totalTasks,
        completedTasks,
        inProgressTasks,
        todoTasks,
        progress,
        assignedDevelopers,
        developerCount: assignedDevelopers.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = async (req, res, next) => {
  try {
    const { name, description, client, startDate, endDate, status, priority } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Project name is required' });
    }

    const project = await Project.create({
      name: name.trim(),
      description: description ? description.trim() : '',
      client: client ? client.trim() : 'Internal',
      startDate: startDate || Date.now(),
      endDate: endDate || null,
      status: status || 'Planning',
      priority: priority || 'Medium',
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const { name, description, client, startDate, endDate, status, priority } = req.body;

    if (name) project.name = name.trim();
    if (description !== undefined) project.description = description.trim();
    if (client) project.client = client.trim();
    if (startDate) project.startDate = startDate;
    if (endDate !== undefined) project.endDate = endDate;
    if (status) project.status = status;
    if (priority) project.priority = priority;

    await project.save();

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Delete associated tasks
    await Task.deleteMany({ project: project._id });
    await Project.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: `Project ${project.name} and its associated tasks deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
