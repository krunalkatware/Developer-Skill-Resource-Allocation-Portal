const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const User = require('./models/User');
const seedAllData = require('./utils/seedData');

// Load environment variables
dotenv.config();

const app = express();

// Enable CORS
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://developer-skill-resource-allocation.vercel.app'
  ],
  credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'DevResource Backend API',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/developers', require('./routes/developerRoutes'));
app.use('/api/skills', require('./routes/skillRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/matching', require('./routes/matchingRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// 404 Handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Central Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start Server after connecting to MongoDB
const startServer = async () => {
  try {
    console.log('[DevResource Backend] Initializing database connection...');
    await connectDB();

    // Auto-seed if database is empty on initial run
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[DevResource Backend] Database is empty. Seeding initial demo data...');
      await seedAllData();
    }

    app.listen(PORT, () => {
      console.log(`================================================================`);
      console.log(`🚀 DevResource Server is running on port ${PORT}`);
      console.log(`🌐 API Endpoint: http://localhost:${PORT}/api`);
      console.log(`================================================================`);
    });
  } catch (error) {
    console.error('================================================================');
    console.error('❌ Server startup aborted: Database connection failed.');
    console.error('Please ensure MongoDB is running and MONGO_URI in .env is valid.');
    console.error('================================================================');
    process.exit(1);
  }
};

startServer();
