import { Request, Response } from 'express';
import Product, { IProduct } from '../models/Product';

class ProductController {
  // Create a new product
  async createProduct(req: Request, res: Response) {
    try {
      const productData: IProduct = req.body;
      const newProduct = new Product(productData);
      const savedProduct = await newProduct.save();
      
      res.status(201).json({
        message: 'Product created successfully',
        product: savedProduct
      });
    } catch (error) {
      res.status(400).json({
        message: 'Error creating product',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get all products
  async getAllProducts(req: Request, res: Response) {
    try {
      const { 
        category, 
        minPrice, 
        maxPrice, 
        page = 1, 
        limit = 10 
      } = req.query;

      const filter: any = {};
      
      if (category) filter.category = category;
      if (minPrice) filter.price = { $gte: Number(minPrice) };
      if (maxPrice) filter.price = { 
        ...filter.price, 
        $lte: Number(maxPrice) 
      };

      const products = await Product.find(filter)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .sort({ createdAt: -1 });

      const total = await Product.countDocuments(filter);

      res.json({
        products,
        totalPages: Math.ceil(total / Number(limit)),
        currentPage: Number(page)
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching products',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get a single product by SKU
  async getProductBySku(req: Request, res: Response) {
    try {
      const { sku } = req.params;
      const product = await Product.findOne({ sku });

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching product',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Update a product
  async updateProduct(req: Request, res: Response) {
    try {
      const { sku } = req.params;
      const updateData = req.body;

      const updatedProduct = await Product.findOneAndUpdate(
        { sku }, 
        updateData, 
        { new: true, runValidators: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }

      res.json({
        message: 'Product updated successfully',
        product: updatedProduct
      });
    } catch (error) {
      res.status(400).json({
        message: 'Error updating product',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Delete a product
  async deleteProduct(req: Request, res: Response) {
    try {
      const { sku } = req.params;
      const deletedProduct = await Product.findOneAndDelete({ sku });

      if (!deletedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }

      res.json({
        message: 'Product deleted successfully',
        product: deletedProduct
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error deleting product',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export default new ProductController();
