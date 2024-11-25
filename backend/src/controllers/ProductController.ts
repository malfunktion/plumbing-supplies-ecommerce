import { Request, Response } from 'express';
import Product, { IProduct } from '../models/Product';
import { ValidationError } from 'mongoose';

class ProductController {
  // Create a new product
  async createProduct(req: Request, res: Response) {
    try {
      const productData: IProduct = req.body;
      const newProduct = new Product(productData);
      const savedProduct = await newProduct.save();
      
      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: savedProduct
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: Object.values(error.errors).map(err => ({
            field: err.path,
            message: err.message
          }))
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Error creating product',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get all products with filtering, pagination, and sorting
  async getAllProducts(req: Request, res: Response) {
    try {
      const { 
        category, 
        minPrice, 
        maxPrice, 
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1, 
        limit = 10 
      } = req.query;

      const filter: any = {};
      
      // Apply filters
      if (category) filter.category = category;
      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
      }
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      // Validate pagination params
      const pageNum = Math.max(1, Number(page));
      const limitNum = Math.min(50, Math.max(1, Number(limit))); // Max 50 items per page

      // Build sort object
      const sortOptions: any = {};
      sortOptions[String(sortBy)] = sortOrder === 'desc' ? -1 : 1;

      const [products, total] = await Promise.all([
        Product.find(filter)
          .skip((pageNum - 1) * limitNum)
          .limit(limitNum)
          .sort(sortOptions)
          .select('-__v'),
        Product.countDocuments(filter)
      ]);

      const totalPages = Math.ceil(total / limitNum);

      res.json({
        success: true,
        data: {
          products,
          pagination: {
            total,
            totalPages,
            currentPage: pageNum,
            limit: limitNum,
            hasNextPage: pageNum < totalPages,
            hasPrevPage: pageNum > 1
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching products',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get product by ID
  async getProductById(req: Request, res: Response) {
    try {
      const product = await Product.findById(req.params.id).select('-__v');
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching product',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Update product
  async updateProduct(req: Request, res: Response) {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true }
      ).select('-__v');

      if (!updatedProduct) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.json({
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: Object.values(error.errors).map(err => ({
            field: err.path,
            message: err.message
          }))
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error updating product',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Delete product
  async deleteProduct(req: Request, res: Response) {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      
      if (!deletedProduct) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.json({
        success: true,
        message: 'Product deleted successfully',
        data: deletedProduct
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting product',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Bulk operations
  async bulkUpdateProducts(req: Request, res: Response) {
    try {
      const { products } = req.body;
      
      if (!Array.isArray(products)) {
        return res.status(400).json({
          success: false,
          message: 'Products must be an array'
        });
      }

      const updates = products.map(product => ({
        updateOne: {
          filter: { _id: product._id },
          update: { $set: product },
          upsert: false
        }
      }));

      const result = await Product.bulkWrite(updates);

      res.json({
        success: true,
        message: 'Products updated successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating products',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export default new ProductController();
