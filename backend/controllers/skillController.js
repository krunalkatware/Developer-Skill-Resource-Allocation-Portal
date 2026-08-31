const Skill = require('../models/Skill');
const User = require('../models/User');
const Task = require('../models/Task');

// @desc    Get all skills
// @route   GET /api/skills
// @access  Private
const getSkills = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: searchRegex }, { description: searchRegex }, { category: searchRegex }];
    }

    const skills = await Skill.find(query).sort({ name: 1 });

    // Calculate usage count for each skill
    const skillsWithUsage = await Promise.all(
      skills.map(async (skill) => {
        const developerCount = await User.countDocuments({ 'skills.skill': skill._id });
        const taskCount = await Task.countDocuments({ requiredSkills: skill._id });
        return {
          ...skill.toObject(),
          developerCount,
          taskCount,
        };
      })
    );

    res.json({ success: true, count: skillsWithUsage.length, data: skillsWithUsage });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new skill
// @route   POST /api/skills
// @access  Private/Admin
const createSkill = async (req, res, next) => {
  try {
    const { name, description, category } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Skill name is required' });
    }

    const existingSkill = await Skill.findOne({ name: new RegExp(`^${name.trim()}$`, 'i') });
    if (existingSkill) {
      return res.status(400).json({ success: false, message: 'A skill with this name already exists' });
    }

    const skill = await Skill.create({
      name: name.trim(),
      description: description ? description.trim() : '',
      category: category ? category.trim() : 'General',
    });

    res.status(201).json({
      success: true,
      message: 'Skill created successfully',
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private/Admin
const updateSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    const { name, description, category } = req.body;

    if (name && name.trim().toLowerCase() !== skill.name.toLowerCase()) {
      const existing = await Skill.findOne({ name: new RegExp(`^${name.trim()}$`, 'i') });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Another skill with this name already exists' });
      }
      skill.name = name.trim();
    }

    if (description !== undefined) skill.description = description.trim();
    if (category !== undefined) skill.category = category.trim();

    await skill.save();

    res.json({
      success: true,
      message: 'Skill updated successfully',
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private/Admin
const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    // Clean up skill reference from users and tasks
    await User.updateMany({}, { $pull: { skills: { skill: skill._id } } });
    await Task.updateMany({}, { $pull: { requiredSkills: skill._id } });

    await Skill.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: `Skill ${skill.name} deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
};
