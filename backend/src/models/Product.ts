import mongoose from 'mongoose';

// Define the interface for the Product document
export interface IProduct extends mongoose.Document {
  name: string;
  description: string;
  sku: string;
  price: number;
  category: string;
  images: string[];
  inStock: number;
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
    enum: ['Pipes', 'Fittings', 'Tools', 'Valves', 'Fixtures']
  },
  images: [{
    type: String,
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i.test(v);
      },
      message: 'Invalid image URL'
    }
  }],
  inStock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
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
ProductSchema.index({ price: 1 });

// Pre-save middleware to update timestamps
ProductSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Static method to find products by category
ProductSchema.statics.findByCategory = function(category: string) {
  return this.find({ category: category });
};

// Create and export the Product model
const Product = mongoose.model<IProduct>('Product', ProductSchema);
export default Product;
