require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Project = require('../models/Project');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmanager', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});

    // Create users
    const users = await User.create([
      { username: 'admin', password: 'admin', role: 'admin' },
      { username: 'user1', password: 'user1', role: 'user' },
      { username: 'user2', password: 'user2', role: 'user' }
    ]);

    console.log('✅ Users created:', users.length);

    // Create projects
    const adminUser = users.find(u => u.username === 'admin');
    const projects = await Project.create([
      { name: 'Proyecto Demo', description: 'Proyecto de ejemplo', createdBy: adminUser._id },
      { name: 'Proyecto Alpha', description: 'Proyecto importante', createdBy: adminUser._id },
      { name: 'Proyecto Beta', description: 'Proyecto secundario', createdBy: adminUser._id }
    ]);

    console.log('✅ Projects created:', projects.length);
    console.log('✅ Seed data completed successfully');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();
