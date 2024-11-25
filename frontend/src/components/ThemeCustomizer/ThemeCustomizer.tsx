import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { ThemeCustomizerProps } from '@/types/setup';
import { ThemeDocument } from '@/types/theme';
import { themeService } from '@/services/themeService';

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ onClose }) => {
  const [themes, setThemes] = useState<ThemeDocument[]>([]);
  const [currentTheme, setCurrentTheme] = useState<ThemeDocument | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTheme, setEditedTheme] = useState<Partial<ThemeDocument> | null>(null);

  useEffect(() => {
    loadThemes();
  }, []);

  const loadThemes = async () => {
    try {
      const userThemes = await themeService.getUserThemes();
      setThemes(userThemes);
      const defaultTheme = userThemes.find(theme => theme.isDefault);
      if (defaultTheme) {
        setCurrentTheme(defaultTheme);
        themeService.applyTheme(defaultTheme);
      }
    } catch (error) {
      console.error('Failed to load themes:', error);
    }
  };

  const handleThemeSelect = async (themeId: string) => {
    try {
      const theme = await themeService.getTheme(themeId);
      setCurrentTheme(theme);
      themeService.applyTheme(theme);
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  };

  const handleCreateTheme = async () => {
    try {
      const newTheme = await themeService.createTheme({
        name: 'New Theme',
        isDefault: false
      });
      setThemes([...themes, newTheme]);
      setCurrentTheme(newTheme);
      setIsEditing(true);
      setEditedTheme(newTheme);
    } catch (error) {
      console.error('Failed to create theme:', error);
    }
  };

  const handleSaveTheme = async () => {
    if (!editedTheme) return;

    try {
      const savedTheme = await themeService.updateTheme(editedTheme._id!, editedTheme);
      setThemes(themes.map(t => t._id === savedTheme._id ? savedTheme : t));
      setCurrentTheme(savedTheme);
      setIsEditing(false);
      setEditedTheme(null);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const handleDeleteTheme = async (themeId: string) => {
    try {
      await themeService.deleteTheme(themeId);
      setThemes(themes.filter(t => t._id !== themeId));
      if (currentTheme?._id === themeId) {
        const defaultTheme = themes.find(t => t.isDefault && t._id !== themeId);
        if (defaultTheme) {
          setCurrentTheme(defaultTheme);
          themeService.applyTheme(defaultTheme);
        }
      }
    } catch (error) {
      console.error('Failed to delete theme:', error);
    }
  };

  const handleColorChange = (category: string, key: string, value: string) => {
    if (!editedTheme) return;

    setEditedTheme({
      ...editedTheme,
      colors: {
        ...editedTheme.colors,
        [category]: {
          ...editedTheme.colors?.[category],
          [key]: value
        }
      }
    });
  };

  const handleLayoutChange = (key: string, value: string) => {
    if (!editedTheme) return;

    setEditedTheme({
      ...editedTheme,
      layout: {
        ...editedTheme.layout,
        [key]: value
      }
    });
  };

  const handleTypographyChange = (category: string, key: string, value: string | number) => {
    if (!editedTheme) return;

    setEditedTheme({
      ...editedTheme,
      typography: {
        ...editedTheme.typography,
        [category]: {
          ...editedTheme.typography?.[category],
          [key]: value
        }
      }
    });
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Theme Customizer</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>Available Themes</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {themes.map((theme) => (
              <Button
                key={theme._id}
                variant={currentTheme?._id === theme._id ? 'contained' : 'outlined'}
                onClick={() => handleThemeSelect(theme._id!)}
              >
                {theme.name}
              </Button>
            ))}
            <Button
              variant="outlined"
              color="primary"
              onClick={handleCreateTheme}
            >
              Create New Theme
            </Button>
          </Box>
        </Box>

        {isEditing && editedTheme && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>Edit Theme</Typography>
            {/* Colors */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>Colors</Typography>
              {/* Primary Colors */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {Object.entries(editedTheme.colors?.primary || {}).map(([key, value]) => (
                  <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => handleColorChange('primary', key, e.target.value)}
                      sx={{ width: 40, height: 40 }}
                    />
                    <Typography variant="body2">{key}</Typography>
                  </Box>
                ))}
              </Box>

              {/* Background Colors */}
              <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {Object.entries(editedTheme.colors?.background || {}).map(([key, value]) => (
                  <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => handleColorChange('background', key, e.target.value)}
                      sx={{ width: 40, height: 40 }}
                    />
                    <Typography variant="body2">{key}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Layout */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>Layout</Typography>
              {Object.entries(editedTheme.layout || {}).map(([key, value]) => (
                <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="body2">{key}</Typography>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleLayoutChange(key, e.target.value)}
                    sx={{ width: '100%' }}
                  />
                </Box>
              ))}
            </Box>

            {/* Typography */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>Typography</Typography>
              {/* Font Families */}
              <Box sx={{ mt: 2 }}>
                {Object.entries(editedTheme.typography?.fontFamily || {}).map(([key, value]) => (
                  <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="body2">{key}</Typography>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleTypographyChange('fontFamily', key, e.target.value)}
                      sx={{ width: '100%' }}
                    />
                  </Box>
                ))}
              </Box>

              {/* Font Sizes */}
              <Box sx={{ mt: 2 }}>
                {Object.entries(editedTheme.typography?.fontSize || {}).map(([key, value]) => (
                  <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="body2" sx={{ width: 100 }}>{key}</Typography>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleTypographyChange('fontSize', key, e.target.value)}
                      sx={{ width: '100%' }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        {isEditing && (
          <Button onClick={handleSaveTheme} variant="contained" color="primary">
            Save Theme
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
