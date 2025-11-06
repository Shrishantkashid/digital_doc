import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

// Load environment variables
dotenv.config();

// Debug: Log environment variables
console.log('Environment variables:');
console.log('VITE_MONGODB_URI:', process.env.VITE_MONGODB_URI);
console.log('MONGODB_URI:', process.env.MONGODB_URI);

// Import models
import User from '../models/User.js';
import Prescription from '../models/Prescription.js';

// Import bcrypt for password hashing
import bcrypt from 'bcryptjs';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' })); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// MongoDB connection
const connectDB = async () => {
  try {
    // Use VITE_MONGODB_URI since that's what's defined in .env
    const mongoUri = process.env.VITE_MONGODB_URI;
    console.log('Attempting to connect with URI:', mongoUri);
    if (!mongoUri) {
      throw new Error('VITE_MONGODB_URI is not defined in environment variables');
    }
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`MongoDB Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Connect to MongoDB
connectDB();

// User registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      username,
      password: hashedPassword,
      email
    });

    await user.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'User registered successfully',
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Registration failed'
    });
  }
});

// User login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials'
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Login successful',
      user: { id: user._id, username: user.username }
    });
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Login failed'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access the app at http://localhost:${PORT}`);
});

export default app;