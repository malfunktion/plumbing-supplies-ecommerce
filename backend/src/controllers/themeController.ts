import { Request, Response } from 'express';
import { Theme, ThemeDocument } from '../models/theme';

export const themeController = {
  // Get user's themes
  getUserThemes: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const themes = await Theme.find({ userId });
      res.json(themes);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch themes' });
    }
  },

  // Get specific theme
  getTheme: async (req: Request, res: Response) => {
    try {
      const theme = await Theme.findById(req.params.id);
      if (!theme) {
        return res.status(404).json({ error: 'Theme not found' });
      }
      res.json(theme);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch theme' });
    }
  },

  // Create new theme
  createTheme: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const themeData = {
        ...req.body,
        userId,
      };

      const theme = new Theme(themeData);
      await theme.save();

      res.status(201).json(theme);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create theme' });
    }
  },

  // Update theme
  updateTheme: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const theme = await Theme.findOne({ _id: req.params.id, userId });

      if (!theme) {
        return res.status(404).json({ error: 'Theme not found' });
      }

      // Update theme properties
      Object.assign(theme, req.body);
      await theme.save();

      res.json(theme);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update theme' });
    }
  },

  // Delete theme
  deleteTheme: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const theme = await Theme.findOneAndDelete({ _id: req.params.id, userId });

      if (!theme) {
        return res.status(404).json({ error: 'Theme not found' });
      }

      res.json({ message: 'Theme deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete theme' });
    }
  },

  // Set default theme
  setDefaultTheme: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      
      // Remove default from other themes
      await Theme.updateMany({ userId }, { isDefault: false });

      // Set new default theme
      const theme = await Theme.findOneAndUpdate(
        { _id: req.params.id, userId },
        { isDefault: true },
        { new: true }
      );

      if (!theme) {
        return res.status(404).json({ error: 'Theme not found' });
      }

      res.json(theme);
    } catch (error) {
      res.status(500).json({ error: 'Failed to set default theme' });
    }
  },

  // Clone theme
  cloneTheme: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const sourceTheme = await Theme.findOne({ _id: req.params.id, userId });

      if (!sourceTheme) {
        return res.status(404).json({ error: 'Theme not found' });
      }

      const themeData = sourceTheme.toObject();
      delete themeData._id;
      themeData.name = `${themeData.name} (Copy)`;
      themeData.isDefault = false;

      const newTheme = new Theme(themeData);
      await newTheme.save();

      res.status(201).json(newTheme);
    } catch (error) {
      res.status(500).json({ error: 'Failed to clone theme' });
    }
  },

  // Export theme
  exportTheme: async (req: Request, res: Response) => {
    try {
      const theme = await Theme.findById(req.params.id);
      if (!theme) {
        return res.status(404).json({ error: 'Theme not found' });
      }

      const themeData = theme.toObject();
      delete themeData._id;
      delete themeData.userId;
      delete themeData.createdAt;
      delete themeData.updatedAt;
      delete themeData.__v;

      res.json(themeData);
    } catch (error) {
      res.status(500).json({ error: 'Failed to export theme' });
    }
  },

  // Import theme
  importTheme: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const themeData = {
        ...req.body,
        userId,
        isDefault: false
      };

      const theme = new Theme(themeData);
      await theme.save();

      res.status(201).json(theme);
    } catch (error) {
      res.status(500).json({ error: 'Failed to import theme' });
    }
  }
};
