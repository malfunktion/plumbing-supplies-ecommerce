import axios from 'axios';
import { ThemeDocument } from '@/types/theme';

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

  // Apply theme to current session
  applyTheme: async (theme: ThemeDocument) => {
    const response = await axios.post(`${API_URL}/api/themes/apply`, theme);
    return response.data;
  },

  // Import theme
  importTheme: async (themeData: Partial<ThemeDocument>) => {
    const response = await axios.post(`${API_URL}/api/themes/import`, themeData);
    return response.data;
  },

  // Export theme
  exportTheme: async (id: string) => {
    const response = await axios.get(`${API_URL}/api/themes/${id}/export`);
    return response.data;
  }
};
