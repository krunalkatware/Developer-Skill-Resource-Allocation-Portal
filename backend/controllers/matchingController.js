const Task = require('../models/Task');
const User = require('../models/User');
const Skill = require('../models/Skill');

// @desc    Get matching developer recommendations for a specific task
// @route   GET /api/matching/task/:taskId
// @access  Private
const getMatchingDevelopersForTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId)
      .populate('project', 'name client')
      .populate('requiredSkills', 'name category');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const requiredSkillIds = (task.requiredSkills || []).map((s) => s._id.toString());
    const requiredSkillsList = task.requiredSkills || [];
    const totalRequiredCount = requiredSkillIds.length;

    // Fetch all active developers with their populated skills
    const developers = await User.find({ role: 'developer' }).populate('skills.skill', 'name category');

    // Calculate match metrics for each developer
    const recommendations = developers.map((dev) => {
      // Map of developer's skill IDs and their proficiency
      const devSkillMap = new Map();
      (dev.skills || []).forEach((item) => {
        if (item.skill && item.skill._id) {
          devSkillMap.set(item.skill._id.toString(), {
            name: item.skill.name,
            proficiency: item.proficiency,
          });
        }
      });

      let matchedSkills = [];
      let missingSkills = [];

      if (totalRequiredCount === 0) {
        // If task has no required skills, all developers match 100%
        matchedSkills = [];
        missingSkills = [];
      } else {
        requiredSkillsList.forEach((reqSkill) => {
          const reqSkillId = reqSkill._id.toString();
          if (devSkillMap.has(reqSkillId)) {
            const devSkillInfo = devSkillMap.get(reqSkillId);
            matchedSkills.push({
              _id: reqSkill._id,
              name: reqSkill.name,
              proficiency: devSkillInfo.proficiency,
            });
          } else {
            missingSkills.push({
              _id: reqSkill._id,
              name: reqSkill.name,
            });
          }
        });
      }

      // Formula: Match Percentage = (Matched Required Skills / Total Required Skills) * 100
      let matchPercentage = 0;
      if (totalRequiredCount === 0) {
        matchPercentage = 100;
      } else {
        matchPercentage = Math.round((matchedSkills.length / totalRequiredCount) * 100);
      }

      // Categorize Match Tier
      let matchTier = 'Low Match';
      let tierColor = 'secondary';
      if (matchPercentage >= 90) {
        matchTier = 'Excellent Match';
        tierColor = 'success';
      } else if (matchPercentage >= 70) {
        matchTier = 'Good Match';
        tierColor = 'primary';
      } else if (matchPercentage >= 50) {
        matchTier = 'Partial Match';
        tierColor = 'warning';
      } else {
        matchTier = 'Low Match';
        tierColor = 'danger';
      }

      // Availability priority score for sorting
      let availabilityScore = 3; // Available
      if (dev.availability === 'Partially Allocated') availabilityScore = 2;
      if (dev.availability === 'Fully Allocated') availabilityScore = 1;

      return {
        developer: {
          _id: dev._id,
          name: dev.name,
          email: dev.email,
          department: dev.department,
          designation: dev.designation,
          experience: dev.experience,
          phone: dev.phone,
          availability: dev.availability,
          allSkills: dev.skills,
        },
        matchPercentage,
        matchTier,
        tierColor,
        matchedSkills,
        missingSkills,
        totalRequiredSkills: totalRequiredCount,
        matchedCount: matchedSkills.length,
        isCurrentlyAssigned: task.assignedDeveloper && task.assignedDeveloper.toString() === dev._id.toString(),
        availabilityScore,
      };
    });

    // Rank developers:
    // 1. matchPercentage descending
    // 2. availabilityScore descending (Available > Partially > Fully)
    // 3. experience descending
    recommendations.sort((a, b) => {
      if (b.matchPercentage !== a.matchPercentage) {
        return b.matchPercentage - a.matchPercentage;
      }
      if (b.availabilityScore !== a.availabilityScore) {
        return b.availabilityScore - a.availabilityScore;
      }
      return (b.developer.experience || 0) - (a.developer.experience || 0);
    });

    res.json({
      success: true,
      data: {
        task: {
          _id: task._id,
          title: task.title,
          project: task.project,
          priority: task.priority,
          status: task.status,
          deadline: task.deadline,
          estimatedHours: task.estimatedHours,
          requiredSkills: task.requiredSkills,
          assignedDeveloper: task.assignedDeveloper,
        },
        recommendations,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMatchingDevelopersForTask,
};
