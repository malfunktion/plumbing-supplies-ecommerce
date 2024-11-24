import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { sampleProducts } from '../data/sampleProducts';

const router = express.Router();

// Check if setup is needed
router.get('/status', async (req, res) => {
  try {
    // Check database connection
    const dbStatus = mongoose.connection.readyState === 1;
    
    // Check if admin user exists
    const adminExists = await User.exists({ role: 'admin' });
    
    // Check if any products exist
    const productsExist = await Product.exists({});

    res.json({
      needsSetup: !dbStatus || !adminExists,
      dbConnected: dbStatus,
      adminCreated: !!adminExists,
      hasProducts: !!productsExist
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to check setup status',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Test database connection
router.post('/test-database', async (req, res) => {
  const { uri } = req.body;

  if (!uri) {
    return res.status(400).json({ error: 'Database URI is required' });
  }

  try {
    // Close existing connection if any
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    // Test new connection
    await mongoose.connect(uri);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to connect to database',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Create admin user
router.post('/create-admin', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin user already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin user
    const admin = new User({
      email,
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to create admin user',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Install sample data
router.post('/install-sample-data', async (req, res) => {
  try {
    // Clear existing products
    await Product.deleteMany({});

    // Insert sample products
    await Product.insertMany(sampleProducts);

    res.json({ 
      success: true,
      productsCreated: sampleProducts.length
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to install sample data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
