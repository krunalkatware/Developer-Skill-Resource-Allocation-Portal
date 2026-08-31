const mongoose = require('mongoose');
const dns = require('dns');

// Configure public DNS resolvers for reliable MongoDB Atlas SRV lookup on Windows
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Ignore if custom DNS server cannot be set
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/devresource', {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
    });
    console.log(`[MongoDB Connected]: Host -> ${conn.connection.host}, DB -> ${conn.connection.name}`);
    return true;
  } catch (error) {
    console.error('================================================================');
    console.error('[ERROR] Database connection failed.');
    console.error('Please check your MongoDB connection string in backend/.env');
    console.error(`Details: ${error.message}`);
    console.error('================================================================');
    // We throw error so the caller can decide to fail startup or log properly
    throw error;
  }
};

module.exports = connectDB;
