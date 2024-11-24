import mongoose from 'mongoose';
import { Product } from '../models/Product';

const plumbingCategories = [
  'Pipes and Fittings',
  'Valves',
  'Faucets and Taps',
  'Sinks',
  'Toilets',
  'Water Heaters',
  'Drainage Systems',
  'Tools',
  'Bathroom Accessories',
  'Plumbing Safety Equipment'
];

const brands = [
  'PlumbMaster',
  'AquaPro',
  'FlowTech',
  'PipePerfect',
  'HydroElite',
  'DrainPro',
  'ValveTech',
  'WaterWorks',
  'PlumbingPro',
  'QualityFit'
];

const materials = [
  'PVC',
  'Copper',
  'Brass',
  'Stainless Steel',
  'Cast Iron',
  'PEX',
  'ABS',
  'Galvanized Steel',
  'Chrome-plated',
  'Bronze'
];

function generateRandomPrice() {
  return Number((Math.random() * (999 - 5) + 5).toFixed(2));
}

function generateRandomStock() {
  return Math.floor(Math.random() * 100) + 1;
}

function generateRandomDescription(category: string) {
  const qualities = ['High-quality', 'Durable', 'Professional-grade', 'Premium', 'Heavy-duty'];
  const features = ['corrosion-resistant', 'easy to install', 'leak-proof', 'long-lasting', 'maintenance-free'];
  const uses = ['residential', 'commercial', 'industrial'];
  
  return `${qualities[Math.floor(Math.random() * qualities.length)]} ${category.toLowerCase()} ${features[Math.floor(Math.random() * features.length)]}. Perfect for ${uses[Math.floor(Math.random() * uses.length)]} applications.`;
}

export async function seedProducts() {
  const products = [];

  for (let i = 0; i < 200; i++) {
    const category = plumbingCategories[Math.floor(Math.random() * plumbingCategories.length)];
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const material = materials[Math.floor(Math.random() * materials.length)];

    products.push({
      name: `${brand} ${material} ${category} Model ${Math.floor(Math.random() * 1000) + 1}`,
      description: generateRandomDescription(category),
      price: generateRandomPrice(),
      category,
      brand,
      material,
      stockQuantity: generateRandomStock(),
      imageUrl: `https://placehold.co/400x300?text=${encodeURIComponent(category)}`,
      specifications: {
        material,
        dimensions: `${Math.floor(Math.random() * 50) + 10}x${Math.floor(Math.random() * 50) + 10}x${Math.floor(Math.random() * 50) + 10} cm`,
        weight: `${(Math.random() * 10).toFixed(1)} kg`,
        warranty: `${Math.floor(Math.random() * 5) + 1} years`
      }
    });
  }

  try {
    await Product.insertMany(products);
    console.log('Successfully seeded 200 products');
  } catch (error) {
    console.error('Error seeding products:', error);
    throw error;
  }
}
