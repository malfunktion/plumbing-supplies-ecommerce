import inquirer from 'inquirer';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { config } from 'dotenv';

// Load existing env if available
config();

interface SetupAnswers {
  adminEmail: string;
  adminPassword: string;
  confirmPassword: string;
  mongodbUri: string;
  jwtSecret: string;
  stripeKey: string;
  googleMapsKey: string;
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPass: string;
}

async function validateMongoConnection(uri: string): Promise<boolean> {
  try {
    await mongoose.connect(uri);
    await mongoose.connection.close();
    return true;
  } catch (error) {
    return false;
  }
}

async function createAdminUser(email: string, password: string) {
  try {
    const User = (await import('./models/User')).default;
    return await User.createAdmin(email, password);
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
}

async function generateSecureKey(length: number = 32): Promise<string> {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let result = '';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }
  return result;
}

async function runSetup() {
  console.log('Welcome to the Plumbing Supplies E-commerce Setup!\n');
  
  const questions = [
    {
      type: 'input',
      name: 'adminEmail',
      message: 'Enter admin email address:',
      validate: (input: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(input) || 'Please enter a valid email address';
      }
    },
    {
      type: 'password',
      name: 'adminPassword',
      message: 'Enter admin password (min 8 characters):',
      validate: (input: string) => {
        return input.length >= 8 || 'Password must be at least 8 characters long';
      }
    },
    {
      type: 'password',
      name: 'confirmPassword',
      message: 'Confirm admin password:',
      validate: (input: string, answers: SetupAnswers) => {
        return input === answers.adminPassword || 'Passwords do not match';
      }
    },
    {
      type: 'input',
      name: 'mongodbUri',
      message: 'Enter MongoDB URI:',
      default: process.env.MONGODB_URI || 'mongodb://localhost:27017/plumbing-supplies',
      validate: async (input: string) => {
        const isValid = await validateMongoConnection(input);
        return isValid || 'Unable to connect to MongoDB. Please check the URI';
      }
    },
    {
      type: 'input',
      name: 'stripeKey',
      message: 'Enter Stripe Secret Key (optional):',
      default: process.env.STRIPE_SECRET_KEY || ''
    },
    {
      type: 'input',
      name: 'googleMapsKey',
      message: 'Enter Google Maps API Key (optional):',
      default: process.env.GOOGLE_MAPS_API_KEY || ''
    },
    {
      type: 'input',
      name: 'smtpHost',
      message: 'Enter SMTP Host (optional):',
      default: process.env.EMAIL_HOST || ''
    },
    {
      type: 'input',
      name: 'smtpPort',
      message: 'Enter SMTP Port (optional):',
      default: process.env.EMAIL_PORT || '587'
    },
    {
      type: 'input',
      name: 'smtpUser',
      message: 'Enter SMTP Username (optional):',
      default: process.env.EMAIL_USER || ''
    },
    {
      type: 'password',
      name: 'smtpPass',
      message: 'Enter SMTP Password (optional):',
      default: process.env.EMAIL_PASS || ''
    }
  ];

  try {
    const answers = await inquirer.prompt(questions);
    
    // Generate JWT secret if not exists
    const jwtSecret = await generateSecureKey();
    
    // Create .env file content
    const envContent = `
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration
MONGODB_URI=${answers.mongodbUri}

# Admin Configuration
ADMIN_EMAIL=${answers.adminEmail}

# JWT Configuration
JWT_SECRET=${jwtSecret}
JWT_EXPIRATION=24h

# Payment Gateway
STRIPE_SECRET_KEY=${answers.stripeKey}

# Maps Configuration
GOOGLE_MAPS_API_KEY=${answers.googleMapsKey}

# Email Configuration
EMAIL_HOST=${answers.smtpHost}
EMAIL_PORT=${answers.smtpPort}
EMAIL_USER=${answers.smtpUser}
EMAIL_PASS=${answers.smtpPass}
    `.trim();

    // Write .env file
    await fs.writeFile(path.join(__dirname, '..', '.env'), envContent);

    // Create admin user
    const hashedPassword = await createAdminUser(answers.adminEmail, answers.adminPassword);
    
    console.log('\nSetup completed successfully!');
    console.log('Configuration saved to .env file');
    console.log('Admin user created with provided email');
    console.log('\nPlease restart the application for changes to take effect.');
    
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  runSetup();
}

export { runSetup };
