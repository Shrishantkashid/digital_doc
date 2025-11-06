import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

// Load environment variables
dotenv.config();

// Import models
import User from '../models/User';
import Prescription from '../models/Prescription';

// Import services
import authService from '../services/authService';
import prescriptionService from '../services/prescriptionService';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Serve static files from the React app build directory
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../dist')));
  
  // Serve the React app for any non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
  });
}

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`MongoDB Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

// Connect to MongoDB
connectDB();

// API Routes

// User registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const user = await authService.register(username, password, email);
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
    const user = await authService.login(username, password);
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

// Save prescription
app.post('/api/prescriptions', async (req, res) => {
  try {
    const { userId, image, medications, allergies, age, conditions, isPregnant, isBreastfeeding, analysisResult } = req.body;
    const prescription = await prescriptionService.savePrescription(
      userId,
      image,
      medications,
      allergies,
      age,
      conditions,
      isPregnant,
      isBreastfeeding,
      analysisResult
    );
    res.status(201).json({ 
      success: true, 
      message: 'Prescription saved successfully',
      prescription
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to save prescription'
    });
  }
});

// Get prescriptions by user ID
app.get('/api/prescriptions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const prescriptions = await prescriptionService.getPrescriptionsByUser(userId);
    res.status(200).json({ 
      success: true, 
      prescriptions
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to retrieve prescriptions'
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