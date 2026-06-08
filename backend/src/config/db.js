const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
  try {
    // Check if any admin exists in the database
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      await User.create({
        name: 'System Admin',
        email: 'admin@taskflow.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('👑 Default Admin created -> Email: admin@taskflow.com | Password: admin123');
    }
  } catch (error) {
    console.error('Failed to seed admin:', error);
  }
};

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskflow_db';
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected');
    
    // Run the seeder after successful connection
    await seedAdmin();
    
  } catch (err) {
    console.error('MongoDB Error:', err.message);
    process.exit(1); 
  }
};

module.exports = connectDB;