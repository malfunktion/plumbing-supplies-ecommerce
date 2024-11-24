import mongoose from 'mongoose';
import { seedProducts } from './products';
import dotenv from 'dotenv';

dotenv.config();

async function seed() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing products
    await mongoose.connection.dropCollection('products').catch(() => {
      console.log('No existing products collection to drop');
    });

    // Seed products
    await seedProducts();

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
