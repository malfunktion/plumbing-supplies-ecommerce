import axios from 'axios';
import { ThemeDocument } from '../../../backend/src/models/theme';

const API_URL = process.env.VITE_API_URL || 'http://localhost:3000';

export const themeService = {
  // Get all themes for current user
  getUserThemes: async () => {
    const response = await axios.get(`${API_URL}/api/themes`);
    return response.data;
  },

  // Get specific theme
  getTheme: async (id: string) => {
    const response = await axios.get(`${API_URL}/api/themes/${id}`);
    return response.data;
  },

  // Create new theme
  createTheme: async (themeData: Partial<ThemeDocument>) => {
    const response = await axios.post(`${API_URL}/api/themes`, themeData);
    return response.data;
  },

  // Update theme
  updateTheme: async (id: string, themeData: Partial<ThemeDocument>) => {
    const response = await axios.put(`${API_URL}/api/themes/${id}`, themeData);
    return response.data;
  },

  // Delete theme
  deleteTheme: async (id: string) => {
    const response = await axios.delete(`${API_URL}/api/themes/${id}`);
    return response.data;
  },

  // Set theme as default
  setDefaultTheme: async (id: string) => {
    const response = await axios.post(`${API_URL}/api/themes/${id}/default`);
    return response.data;
  },

  // Clone existing theme
  cloneTheme: async (id: string) => {
    const response = await axios.post(`${API_URL}/api/themes/${id}/clone`);
    return response.data;
  },

  // Export theme
  exportTheme: async (id: string) => {
    const response = await axios.get(`${API_URL}/api/themes/${id}/export`);
    return response.data;
  },

  // Import theme
  importTheme: async (themeData: Partial<ThemeDocument>) => {
    const response = await axios.post(`${API_URL}/api/themes/import`, themeData);
    return response.data;
  },

  // Apply theme to DOM
  applyTheme: (theme: ThemeDocument) => {
    const root = document.documentElement;

    // Apply colors
    Object.entries(theme.colors.primary).forEach(([key, value]) => {
      root.style.setProperty(`--primary-${key}`, value);
    });

    Object.entries(theme.colors.background).forEach(([key, value]) => {
      root.style.setProperty(`--bg-${key}`, value);
    });

    Object.entries(theme.colors.text).forEach(([key, value]) => {
      root.style.setProperty(`--text-${key}`, value);
    });

    Object.entries(theme.colors.border).forEach(([key, value]) => {
      root.style.setProperty(`--border-${key}`, value);
    });

    // Apply layout
    root.style.setProperty('--container-padding', theme.layout.containerPadding);
    root.style.setProperty('--header-height', theme.layout.headerHeight);
    root.style.setProperty('--sidebar-width', theme.layout.sidebarWidth);

    Object.entries(theme.layout.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value);
    });

    Object.entries(theme.layout.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });

    // Apply typography
    root.style.setProperty('--font-sans', theme.typography.fontFamily.sans);
    root.style.setProperty('--font-mono', theme.typography.fontFamily.mono);

    Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
      root.style.setProperty(`--font-size-${key}`, value);
    });

    Object.entries(theme.typography.fontWeight).forEach(([key, value]) => {
      root.style.setProperty(`--font-weight-${key}`, value.toString());
    });
  }
};
