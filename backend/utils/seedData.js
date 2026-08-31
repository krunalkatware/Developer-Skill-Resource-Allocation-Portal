const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Task = require('../models/Task');
const connectDB = require('../config/db');

dotenv.config();

const seedAllData = async () => {
  try {
    console.log('[DevResource Seeder] Connecting to database...');
    await connectDB();

    console.log('[DevResource Seeder] Clearing existing collections...');
    await Task.deleteMany({});
    await Project.deleteMany({});
    await User.deleteMany({});
    await Skill.deleteMany({});

    console.log('[DevResource Seeder] Seeding Skills...');
    const skillsData = [
      { name: 'JavaScript', category: 'Programming', description: 'Core ECMAScript language for frontend and backend web development' },
      { name: 'React', category: 'Frontend', description: 'Declarative component-based UI library for web applications' },
      { name: 'Node.js', category: 'Backend', description: 'Asynchronous event-driven JavaScript runtime for servers' },
      { name: 'MongoDB', category: 'Database', description: 'NoSQL document database for scalable JSON data storage' },
      { name: 'Python', category: 'Programming', description: 'High-level programming language for backend and automation' },
      { name: 'Java', category: 'Programming', description: 'Object-oriented language for robust enterprise backend systems' },
      { name: 'Spring Boot', category: 'Backend', description: 'Enterprise Java framework for microservices and REST APIs' },
      { name: 'MySQL', category: 'Database', description: 'Relational SQL database management system' },
      { name: 'HTML & CSS', category: 'Frontend', description: 'Semantic markup and responsive modern web styling' },
      { name: 'REST APIs', category: 'Architecture', description: 'Architectural pattern for standard HTTP API interfaces' },
    ];

    const insertedSkills = await Skill.insertMany(skillsData);
    const skillMap = {};
    insertedSkills.forEach((s) => {
      skillMap[s.name] = s._id;
    });

    console.log('[DevResource Seeder] Seeding Users & Developers...');
    // 1. Admin
    const admin = await User.create({
      name: 'Alex Carter (Admin)',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      department: 'Engineering Management',
      designation: 'VP of Engineering / Resource Manager',
      experience: 8,
      phone: '+1 (555) 019-2834',
      availability: 'Available',
      skills: [],
    });

    // 2. Rahul Sharma (Full Stack Dev: JavaScript, React, Node.js, MongoDB)
    const rahul = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      password: 'dev123',
      role: 'developer',
      department: 'Full Stack Engineering',
      designation: 'Senior Full Stack Developer',
      experience: 4,
      phone: '+91 98765 43210',
      availability: 'Available',
      skills: [
        { skill: skillMap['JavaScript'], proficiency: 'Advanced' },
        { skill: skillMap['React'], proficiency: 'Advanced' },
        { skill: skillMap['Node.js'], proficiency: 'Advanced' },
        { skill: skillMap['MongoDB'], proficiency: 'Intermediate' },
      ],
    });

    // 3. Amit Patil (Backend Dev: Java, Spring Boot, MySQL)
    const amit = await User.create({
      name: 'Amit Patil',
      email: 'amit@example.com',
      password: 'dev123',
      role: 'developer',
      department: 'Backend Engineering',
      designation: 'Backend Developer',
      experience: 3,
      phone: '+91 98765 43211',
      availability: 'Partially Allocated',
      skills: [
        { skill: skillMap['Java'], proficiency: 'Advanced' },
        { skill: skillMap['Spring Boot'], proficiency: 'Advanced' },
        { skill: skillMap['MySQL'], proficiency: 'Advanced' },
        { skill: skillMap['REST APIs'], proficiency: 'Intermediate' },
      ],
    });

    // 4. Priya Verma (Python & Data: Python, Django/SQL, REST APIs)
    const priya = await User.create({
      name: 'Priya Verma',
      email: 'priya@example.com',
      password: 'dev123',
      role: 'developer',
      department: 'Data & Backend Systems',
      designation: 'Python Developer',
      experience: 3,
      phone: '+91 98765 43212',
      availability: 'Available',
      skills: [
        { skill: skillMap['Python'], proficiency: 'Advanced' },
        { skill: skillMap['MySQL'], proficiency: 'Advanced' },
        { skill: skillMap['REST APIs'], proficiency: 'Advanced' },
      ],
    });

    // 5. Neha Singh (Frontend Dev: HTML & CSS, JavaScript, React)
    const neha = await User.create({
      name: 'Neha Singh',
      email: 'neha@example.com',
      password: 'dev123',
      role: 'developer',
      department: 'UI/UX Engineering',
      designation: 'Frontend Developer',
      experience: 2,
      phone: '+91 98765 43213',
      availability: 'Fully Allocated',
      skills: [
        { skill: skillMap['HTML & CSS'], proficiency: 'Advanced' },
        { skill: skillMap['JavaScript'], proficiency: 'Intermediate' },
        { skill: skillMap['React'], proficiency: 'Intermediate' },
      ],
    });

    console.log('[DevResource Seeder] Seeding Projects...');
    const now = new Date();
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const twoMonthsLater = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const threeMonthsLater = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
    const fourMonthsLater = new Date(now.getTime() + 120 * 24 * 60 * 60 * 1000);

    const project1 = await Project.create({
      name: 'E-Commerce Platform',
      client: 'ABC Technologies',
      description: 'Full-featured online commerce platform with digital cart, catalog search, checkout, and merchant inventory management.',
      startDate: twoWeeksAgo,
      endDate: twoMonthsLater,
      status: 'In Progress',
      priority: 'High',
      createdBy: admin._id,
    });

    const project2 = await Project.create({
      name: 'Employee Management System',
      client: 'TechCorp Solutions',
      description: 'Internal corporate HRM system for tracking employee onboarding, timesheets, payroll calculations, and department performance.',
      startDate: oneMonthAgo,
      endDate: threeMonthsLater,
      status: 'In Progress',
      priority: 'Medium',
      createdBy: admin._id,
    });

    const project3 = await Project.create({
      name: 'Customer Support Portal',
      client: 'Global Services Ltd.',
      description: 'Omnichannel customer ticket management portal with SLA automation, real-time agent allocation, and satisfaction surveys.',
      startDate: now,
      endDate: fourMonthsLater,
      status: 'Planning',
      priority: 'Urgent',
      createdBy: admin._id,
    });

    console.log('[DevResource Seeder] Seeding Tasks...');
    const deadline1 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const deadline2 = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    const deadline3 = new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000);

    await Task.create([
      // Task for Skill Matching Demo: Requires React, JavaScript, MongoDB -> Rahul 100%, Neha 67%, Amit 0%
      {
        project: project1._id,
        title: 'Create Product Dashboard',
        description: 'Build responsive admin dashboard with product inventory tables, price filters, and batch status updates using React and MongoDB backend.',
        priority: 'High',
        status: 'To Do',
        estimatedHours: 24,
        deadline: deadline1,
        requiredSkills: [skillMap['React'], skillMap['JavaScript'], skillMap['MongoDB']],
        assignedDeveloper: null, // Ready for matching demonstration!
      },
      {
        project: project1._id,
        title: 'Build Login API & JWT Authentication',
        description: 'Implement secure JWT login endpoints, bcrypt password hashing, and user role authorization middleware.',
        priority: 'Urgent',
        status: 'Completed',
        estimatedHours: 16,
        deadline: deadline1,
        requiredSkills: [skillMap['Node.js'], skillMap['JavaScript'], skillMap['MongoDB'], skillMap['REST APIs']],
        assignedDeveloper: rahul._id,
      },
      {
        project: project1._id,
        title: 'Implement Payment Gateway Webhooks',
        description: 'Integrate Stripe webhook event listeners and handle invoice settlement state updates.',
        priority: 'High',
        status: 'To Do',
        estimatedHours: 20,
        deadline: deadline2,
        requiredSkills: [skillMap['Node.js'], skillMap['JavaScript'], skillMap['REST APIs']],
        assignedDeveloper: null,
      },
      {
        project: project2._id,
        title: 'Design Database Schema & MySQL Indexes',
        description: 'Create relational tables for departments, job roles, salary bands, and add optimized composite indexes.',
        priority: 'High',
        status: 'Completed',
        estimatedHours: 18,
        deadline: deadline1,
        requiredSkills: [skillMap['MySQL'], skillMap['Java']],
        assignedDeveloper: amit._id,
      },
      {
        project: project2._id,
        title: 'Create Spring Boot REST API for Departments',
        description: 'Develop CRUD REST controllers, DTO mappers, and JPA repository queries for department operations.',
        priority: 'Medium',
        status: 'In Progress',
        estimatedHours: 32,
        deadline: deadline2,
        requiredSkills: [skillMap['Java'], skillMap['Spring Boot'], skillMap['REST APIs']],
        assignedDeveloper: amit._id,
      },
      {
        project: project2._id,
        title: 'Develop Employee Report Export Script',
        description: 'Write automated data aggregation script to generate monthly departmental payroll spreadsheets.',
        priority: 'Low',
        status: 'Completed',
        estimatedHours: 12,
        deadline: deadline1,
        requiredSkills: [skillMap['Python'], skillMap['MySQL']],
        assignedDeveloper: priya._id,
      },
      {
        project: project3._id,
        title: 'Design Customer Support UI Components',
        description: 'Create modern ticket cards, response timeline components, and priority badge design system.',
        priority: 'High',
        status: 'In Progress',
        estimatedHours: 28,
        deadline: deadline2,
        requiredSkills: [skillMap['HTML & CSS'], skillMap['React'], skillMap['JavaScript']],
        assignedDeveloper: neha._id,
      },
      {
        project: project3._id,
        title: 'Build Ticket SLA Escalation Engine',
        description: 'Implement automated SLA monitoring logic that raises ticket priority when response threshold is crossed.',
        priority: 'Urgent',
        status: 'To Do',
        estimatedHours: 30,
        deadline: deadline3,
        requiredSkills: [skillMap['Python'], skillMap['REST APIs']],
        assignedDeveloper: priya._id,
      },
    ]);

    console.log('[DevResource Seeder] Seeding completed successfully!');
    console.log('----------------------------------------------------');
    console.log('Admin Account: admin@example.com / admin123');
    console.log('Developers:');
    console.log(' - rahul@example.com / dev123 (Senior Full Stack)');
    console.log(' - amit@example.com / dev123 (Backend Developer)');
    console.log(' - priya@example.com / dev123 (Python Developer)');
    console.log(' - neha@example.com / dev123 (Frontend Developer)');
    console.log('----------------------------------------------------');

    return true;
  } catch (error) {
    console.error('[DevResource Seeder Error]:', error);
    throw error;
  }
};

// Check if running directly
if (require.main === module) {
  seedAllData()
    .then(() => {
      console.log('[DevResource Seeder] Finished.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[DevResource Seeder Failed]:', err);
      process.exit(1);
    });
}

module.exports = seedAllData;
