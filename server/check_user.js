import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to DB');
    const users = await User.find({});
    console.log('All Users in DB:');
    users.forEach(u => console.log(`- ${u.email} (Role: ${u.role})`));
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
