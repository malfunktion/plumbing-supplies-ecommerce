import mongoose from 'mongoose';

// Define the interface for the Product document
export interface IProduct extends mongoose.Document {
  name: string;
  description: string;
  sku: string;
  price: number;
  category: string;
  subcategory: string;
  manufacturer: string;
  images: string[];
  stockLevel: number;
  specifications: {
    [key: string]: string | number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Create the Product schema
const ProductSchema = new mongoose.Schema<IProduct>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Pipes & Fittings', 'Valves', 'Tools', 'Fixtures', 'Water Heaters']
  },
  subcategory: {
    type: String,
    required: true
  },
  manufacturer: {
    type: String,
    required: true
  },
  images: [{
    type: String,
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+/i.test(v);
      },
      message: 'Invalid image URL'
    }
  }],
  stockLevel: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  specifications: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes for faster querying
ProductSchema.index({ sku: 1 }, { unique: true });
ProductSchema.index({ category: 1 });
ProductSchema.index({ subcategory: 1 });
ProductSchema.index({ manufacturer: 1 });
ProductSchema.index({ price: 1 });

// Pre-save middleware to update timestamps
ProductSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Static methods
ProductSchema.statics.findByCategory = function(category: string) {
  return this.find({ category });
};

ProductSchema.statics.findBySubcategory = function(subcategory: string) {
  return this.find({ subcategory });
};

ProductSchema.statics.findByManufacturer = function(manufacturer: string) {
  return this.find({ manufacturer });
};

// Create and export the Product model
const Product = mongoose.model<IProduct>('Product', ProductSchema);
export default Product;
