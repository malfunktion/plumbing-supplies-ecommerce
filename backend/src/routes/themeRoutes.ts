import express from 'express';
import { themeController } from '../controllers/themeController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Apply auth middleware to all theme routes
router.use(authMiddleware);

// Theme CRUD operations
router.get('/', themeController.getUserThemes);
router.get('/:id', themeController.getTheme);
router.post('/', themeController.createTheme);
router.put('/:id', themeController.updateTheme);
router.delete('/:id', themeController.deleteTheme);

// Theme management
router.post('/:id/default', themeController.setDefaultTheme);
router.post('/:id/clone', themeController.cloneTheme);
router.get('/:id/export', themeController.exportTheme);
router.post('/import', themeController.importTheme);

export default router;
