import mongoose from 'mongoose';

export interface IProduct extends mongoose.Document {
  name: string;
  description: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  subcategory?: string;
  brand: string;
  manufacturer?: string;
  images: {
    url: string;
    alt: string;
    isPrimary?: boolean;
  }[];
  specifications: {
    [key: string]: string | number;
  };
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'mm' | 'cm' | 'in';
  };
  weight?: {
    value: number;
    unit: 'g' | 'kg' | 'lb' | 'oz';
  };
  stock: {
    quantity: number;
    lowStockThreshold?: number;
    status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';
    warehouseLocation?: string;
  };
  ratings?: {
    average: number;
    count: number;
  };
  tags: string[];
  features: string[];
  installation?: {
    difficulty: 'easy' | 'moderate' | 'complex' | 'professional';
    instructions?: string;
    videoUrl?: string;
  };
  warranty?: {
    duration: number;
    unit: 'days' | 'months' | 'years';
    coverage: string;
  };
  certifications?: string[];
  relatedProducts?: string[];
  metadata?: {
    [key: string]: any;
  };
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  status: 'active' | 'draft' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new mongoose.Schema<IProduct>({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    index: true
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    index: true
  },
  compareAtPrice: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  subcategory: {
    type: String,
    index: true
  },
  brand: {
    type: String,
    required: true,
    index: true
  },
  manufacturer: {
    type: String,
    index: true
  },
  images: [{
    url: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => /^https?:\/\/.+/.test(v),
        message: 'Invalid image URL'
      }
    },
    alt: {
      type: String,
      required: true
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  specifications: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      enum: ['mm', 'cm', 'in']
    }
  },
  weight: {
    value: Number,
    unit: {
      type: String,
      enum: ['g', 'kg', 'lb', 'oz']
    }
  },
  stock: {
    quantity: {
      type: Number,
      required: true,
      min: 0,
      index: true
    },
    lowStockThreshold: {
      type: Number,
      min: 0
    },
    status: {
      type: String,
      required: true,
      enum: ['in_stock', 'low_stock', 'out_of_stock', 'discontinued'],
      index: true
    },
    warehouseLocation: String
  },
  ratings: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      min: 0,
      default: 0
    }
  },
  tags: [{
    type: String,
    index: true
  }],
  features: [String],
  installation: {
    difficulty: {
      type: String,
      enum: ['easy', 'moderate', 'complex', 'professional']
    },
    instructions: String,
    videoUrl: {
      type: String,
      validate: {
        validator: (v: string) => !v || /^https?:\/\/.+/.test(v),
        message: 'Invalid video URL'
      }
    }
  },
  warranty: {
    duration: Number,
    unit: {
      type: String,
      enum: ['days', 'months', 'years']
    },
    coverage: String
  },
  certifications: [String],
  relatedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'draft', 'archived'],
    default: 'draft',
    index: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ 'stock.quantity': 1, 'stock.status': 1 });
ProductSchema.index({ price: 1, category: 1, brand: 1 });

// Pre-save middleware
ProductSchema.pre('save', function(next) {
  // Update stock status based on quantity
  if (this.isModified('stock.quantity')) {
    const quantity = this.stock.quantity;
    const threshold = this.stock.lowStockThreshold || 10;

    if (quantity === 0) {
      this.stock.status = 'out_of_stock';
    } else if (quantity <= threshold) {
      this.stock.status = 'low_stock';
    } else {
      this.stock.status = 'in_stock';
    }
  }
  next();
});

// Static methods
ProductSchema.statics = {
  async findByCategory(category: string) {
    return this.find({ category });
  },

  async findBySubcategory(subcategory: string) {
    return this.find({ subcategory });
  },

  async findByBrand(brand: string) {
    return this.find({ brand });
  },

  async findByPriceRange(min: number, max: number) {
    return this.find({ price: { $gte: min, $lte: max } });
  },

  async findInStock() {
    return this.find({ 'stock.status': 'in_stock' });
  },

  async findLowStock() {
    return this.find({ 'stock.status': 'low_stock' });
  },

  async getProductStats() {
    const stats = await this.aggregate([
      {
        $facet: {
          totalProducts: [{ $count: 'count' }],
          stockStatus: [
            { $group: {
              _id: '$stock.status',
              count: { $sum: 1 }
            }}
          ],
          categories: [
            { $group: {
              _id: '$category',
              count: { $sum: 1 }
            }}
          ],
          brands: [
            { $group: {
              _id: '$brand',
              count: { $sum: 1 }
            }}
          ],
          priceStats: [
            { $group: {
              _id: null,
              avgPrice: { $avg: '$price' },
              totalValue: { $sum: { $multiply: ['$price', '$stock.quantity'] } }
            }}
          ]
        }
      }
    ]);

    return stats[0];
  }
};

const Product = mongoose.model<IProduct>('Product', ProductSchema);
export default Product;
