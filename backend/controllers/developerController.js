const User = require('../models/User');
const Task = require('../models/Task');

// @desc    Get all developers
// @route   GET /api/developers
// @access  Private
const getDevelopers = async (req, res, next) => {
  try {
    const { search, availability, skill } = req.query;
    let query = { role: 'developer' };

    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { department: searchRegex },
        { designation: searchRegex },
      ];
    }

    if (availability && availability !== 'All') {
      query.availability = availability;
    }

    if (skill) {
      query['skills.skill'] = skill;
    }

    const developers = await User.find(query)
      .populate('skills.skill', 'name category description')
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: developers.length, data: developers });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single developer by ID with assigned tasks
// @route   GET /api/developers/:id
// @access  Private
const getDeveloperById = async (req, res, next) => {
  try {
    const developer = await User.findById(req.params.id)
      .populate('skills.skill', 'name category description')
      .select('-password');

    if (!developer || developer.role !== 'developer') {
      return res.status(404).json({ success: false, message: 'Developer not found' });
    }

    // Fetch tasks assigned to this developer
    const assignedTasks = await Task.find({ assignedDeveloper: developer._id })
      .populate('project', 'name client status')
      .populate('requiredSkills', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        ...developer.toObject(),
        assignedTasks,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new developer
// @route   POST /api/developers
// @access  Private/Admin
const createDeveloper = async (req, res, next) => {
  try {
    const { name, email, password, department, designation, experience, phone, availability, skills } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'A user with this email already exists' });
    }

    const developer = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password || 'dev123',
      role: 'developer',
      department: department || 'Engineering',
      designation: designation || 'Software Engineer',
      experience: Number(experience) || 1,
      phone: phone || '',
      availability: availability || 'Available',
      skills: skills || [],
    });

    const populated = await User.findById(developer._id)
      .populate('skills.skill', 'name category description')
      .select('-password');

    res.status(201).json({
      success: true,
      message: 'Developer created successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update developer
// @route   PUT /api/developers/:id
// @access  Private/Admin
const updateDeveloper = async (req, res, next) => {
  try {
    const developer = await User.findById(req.params.id);

    if (!developer || developer.role !== 'developer') {
      return res.status(404).json({ success: false, message: 'Developer not found' });
    }

    const { name, email, department, designation, experience, phone, availability, skills } = req.body;

    if (email && email.toLowerCase().trim() !== developer.email) {
      const emailExists = await User.findOne({ email: email.toLowerCase().trim() });
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'Email is already in use by another user' });
      }
      developer.email = email.toLowerCase().trim();
    }

    if (name) developer.name = name.trim();
    if (department) developer.department = department.trim();
    if (designation) developer.designation = designation.trim();
    if (experience !== undefined) developer.experience = Number(experience);
    if (phone !== undefined) developer.phone = phone.trim();
    if (availability) developer.availability = availability;
    if (skills !== undefined) developer.skills = skills;

    if (req.body.password && req.body.password.length >= 6) {
      developer.password = req.body.password;
    }

    await developer.save();

    const populated = await User.findById(developer._id)
      .populate('skills.skill', 'name category description')
      .select('-password');

    res.json({
      success: true,
      message: 'Developer updated successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete developer
// @route   DELETE /api/developers/:id
// @access  Private/Admin
const deleteDeveloper = async (req, res, next) => {
  try {
    const developer = await User.findById(req.params.id);

    if (!developer || developer.role !== 'developer') {
      return res.status(404).json({ success: false, message: 'Developer not found' });
    }

    // Unassign tasks assigned to this developer
    await Task.updateMany({ assignedDeveloper: developer._id }, { assignedDeveloper: null });

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: `Developer ${developer.name} removed successfully`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDevelopers,
  getDeveloperById,
  createDeveloper,
  updateDeveloper,
  deleteDeveloper,
};
