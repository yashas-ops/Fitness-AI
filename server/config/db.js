import mongoose from 'mongoose';
import config from './env.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️  MongoDB not available: ${error.message}`);
    console.warn(`⚠️  Server will start but database features won't work.`);
    console.warn(`⚠️  Install MongoDB or provide MONGO_URI in .env`);
    return false;
  }
};

export default connectDB;
