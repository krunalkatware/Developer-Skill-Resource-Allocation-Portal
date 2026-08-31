const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Skill = require('../models/Skill');

// @desc    Get Admin Dashboard metrics & overview
// @route   GET /api/dashboard/admin
// @access  Private/Admin
const getAdminDashboardStats = async (req, res, next) => {
  try {
    const totalDevelopers = await User.countDocuments({ role: 'developer' });
    const totalSkills = await Skill.countDocuments();
    const totalProjects = await Project.countDocuments();
    const activeProjects = await Project.countDocuments({ status: { $in: ['In Progress', 'Planning'] } });
    const openTasks = await Task.countDocuments({ status: { $in: ['To Do', 'In Progress'] } });
    const completedTasks = await Task.countDocuments({ status: 'Completed' });
    const totalTasks = await Task.countDocuments();

    // Availability breakdown
    const availableCount = await User.countDocuments({ role: 'developer', availability: 'Available' });
    const partiallyCount = await User.countDocuments({ role: 'developer', availability: 'Partially Allocated' });
    const fullyCount = await User.countDocuments({ role: 'developer', availability: 'Fully Allocated' });

    const availablePercent = totalDevelopers > 0 ? Math.round((availableCount / totalDevelopers) * 100) : 0;
    const partiallyPercent = totalDevelopers > 0 ? Math.round((partiallyCount / totalDevelopers) * 100) : 0;
    const fullyPercent = totalDevelopers > 0 ? Math.round((fullyCount / totalDevelopers) * 100) : 0;

    // Recent Projects with calculated task progress
    const recentProjectsRaw = await Project.find().sort({ createdAt: -1 }).limit(5);
    const recentProjects = await Promise.all(
      recentProjectsRaw.map(async (p) => {
        const tasks = await Task.find({ project: p._id });
        const pTotal = tasks.length;
        const pCompleted = tasks.filter((t) => t.status === 'Completed').length;
        const devIds = new Set(tasks.filter((t) => t.assignedDeveloper).map((t) => t.assignedDeveloper.toString()));
        return {
          _id: p._id,
          name: p.name,
          client: p.client,
          status: p.status,
          priority: p.priority,
          startDate: p.startDate,
          endDate: p.endDate,
          totalTasks: pTotal,
          completedTasks: pCompleted,
          progress: pTotal > 0 ? Math.round((pCompleted / pTotal) * 100) : 0,
          developerCount: devIds.size,
        };
      })
    );

    // Recent Tasks
    const recentTasks = await Task.find()
      .populate('project', 'name client')
      .populate('assignedDeveloper', 'name email designation')
      .populate('requiredSkills', 'name')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      data: {
        stats: {
          totalDevelopers,
          activeProjects,
          openTasks,
          availableResources: availableCount,
          totalProjects,
          totalTasks,
          completedTasks,
          totalSkills,
        },
        availability: {
          available: { count: availableCount, percent: availablePercent },
          partiallyAllocated: { count: partiallyCount, percent: partiallyPercent },
          fullyAllocated: { count: fullyCount, percent: fullyPercent },
        },
        recentProjects,
        recentTasks,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Developer Dashboard metrics
// @route   GET /api/dashboard/developer
// @access  Private
const getDeveloperDashboardStats = async (req, res, next) => {
  try {
    const devId = req.user._id;

    // Get all tasks assigned to this developer
    const myTasks = await Task.find({ assignedDeveloper: devId })
      .populate('project', 'name client status priority')
      .populate('requiredSkills', 'name category')
      .sort({ createdAt: -1 });

    const totalAssignedTasks = myTasks.length;
    const completedTasksCount = myTasks.filter((t) => t.status === 'Completed').length;
    const inProgressTasksCount = myTasks.filter((t) => t.status === 'In Progress').length;
    const todoTasksCount = myTasks.filter((t) => t.status === 'To Do').length;
    const pendingTasksCount = todoTasksCount + inProgressTasksCount;

    // Get unique projects for this developer
    const projectIds = [...new Set(myTasks.map((t) => t.project?._id?.toString()).filter(Boolean))];
    const myProjects = await Project.find({ _id: { $in: projectIds } });

    res.json({
      success: true,
      data: {
        stats: {
          totalProjects: myProjects.length,
          totalTasks: totalAssignedTasks,
          completedTasks: completedTasksCount,
          pendingTasks: pendingTasksCount,
          inProgressTasks: inProgressTasksCount,
          todoTasks: todoTasksCount,
        },
        myProjects,
        myTasks,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboardStats,
  getDeveloperDashboardStats,
};
