import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/fitnessai',
  jwtSecret: process.env.JWT_SECRET || 'fitnessai_super_secret_key_2025',
  hfToken: process.env.HF_TOKEN || '',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || ''
};
