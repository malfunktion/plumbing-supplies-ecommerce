import express from 'express';
import ProductController from '../controllers/ProductController';

const router = express.Router();

// Product CRUD routes
router.post('/', ProductController.createProduct);
router.get('/', ProductController.getAllProducts);
router.get('/:sku', ProductController.getProductBySku);
router.put('/:sku', ProductController.updateProduct);
router.delete('/:sku', ProductController.deleteProduct);

export default router;
