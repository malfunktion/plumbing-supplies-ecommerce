import React, { useState, useEffect } from 'react';
import { ThemeDocument } from '../../../../backend/src/models/theme';
import { themeService } from '../../services/themeService';

interface ThemeCustomizerProps {
  onClose?: () => void;
}

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
    if (!currentTheme || !editedTheme) return;

    try {
      const updatedTheme = await themeService.updateTheme(currentTheme._id, editedTheme);
      setCurrentTheme(updatedTheme);
      themeService.applyTheme(updatedTheme);
      setIsEditing(false);
      setEditedTheme(null);
      await loadThemes();
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const handleDeleteTheme = async (themeId: string) => {
    try {
      await themeService.deleteTheme(themeId);
      await loadThemes();
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
    <div className="dora-card fixed right-0 top-0 h-screen w-80 overflow-y-auto bg-white shadow-lg">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="dora-heading text-xl">Theme Customizer</h2>
          {onClose && (
            <button onClick={onClose} className="dora-button dora-button-secondary">
              Close
            </button>
          )}
        </div>

        <div className="space-y-6">
          {/* Theme Selection */}
          <div>
            <label className="dora-label">Select Theme</label>
            <select
              className="dora-input"
              value={currentTheme?._id}
              onChange={(e) => handleThemeSelect(e.target.value)}
            >
              <option value="">Choose a theme</option>
              {themes.map(theme => (
                <option key={theme._id} value={theme._id}>
                  {theme.name} {theme.isDefault ? '(Default)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Theme Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleCreateTheme}
              className="dora-button dora-button-primary flex-1"
            >
              Create New
            </button>
            {currentTheme && (
              <button
                onClick={() => setIsEditing(true)}
                className="dora-button dora-button-secondary flex-1"
              >
                Edit
              </button>
            )}
          </div>

          {/* Theme Editor */}
          {isEditing && editedTheme && (
            <div className="space-y-6">
              {/* Colors */}
              <div>
                <h3 className="dora-heading text-lg mb-4">Colors</h3>
                
                {/* Primary Colors */}
                <div className="space-y-2">
                  <label className="dora-label">Primary Colors</label>
                  {Object.entries(editedTheme.colors?.primary || {}).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <input
                        type="color"
                        value={value}
                        onChange={(e) => handleColorChange('primary', key, e.target.value)}
                        className="w-8 h-8 rounded"
                      />
                      <span className="dora-text text-sm">{key}</span>
                    </div>
                  ))}
                </div>

                {/* Background Colors */}
                <div className="space-y-2 mt-4">
                  <label className="dora-label">Background Colors</label>
                  {Object.entries(editedTheme.colors?.background || {}).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <input
                        type="color"
                        value={value}
                        onChange={(e) => handleColorChange('background', key, e.target.value)}
                        className="w-8 h-8 rounded"
                      />
                      <span className="dora-text text-sm">{key}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Layout */}
              <div>
                <h3 className="dora-heading text-lg mb-4">Layout</h3>
                {Object.entries(editedTheme.layout || {}).map(([key, value]) => (
                  <div key={key} className="mb-4">
                    <label className="dora-label">{key}</label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleLayoutChange(key, e.target.value)}
                      className="dora-input"
                    />
                  </div>
                ))}
              </div>

              {/* Typography */}
              <div>
                <h3 className="dora-heading text-lg mb-4">Typography</h3>
                
                {/* Font Families */}
                <div className="mb-4">
                  <label className="dora-label">Font Families</label>
                  {Object.entries(editedTheme.typography?.fontFamily || {}).map(([key, value]) => (
                    <div key={key} className="mb-2">
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleTypographyChange('fontFamily', key, e.target.value)}
                        className="dora-input"
                      />
                    </div>
                  ))}
                </div>

                {/* Font Sizes */}
                <div className="mb-4">
                  <label className="dora-label">Font Sizes</label>
                  {Object.entries(editedTheme.typography?.fontSize || {}).map(([key, value]) => (
                    <div key={key} className="mb-2">
                      <div className="flex items-center gap-2">
                        <span className="dora-text text-sm w-12">{key}</span>
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => handleTypographyChange('fontSize', key, e.target.value)}
                          className="dora-input"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div className="flex gap-2">
                <button
                  onClick={handleSaveTheme}
                  className="dora-button dora-button-primary flex-1"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedTheme(null);
                  }}
                  className="dora-button dora-button-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
