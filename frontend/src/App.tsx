import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { DashboardLayout } from './components/shared/DashboardLayout';
import { AdminDashboard } from './components/dashboard/admin/AdminDashboard';  // Add this import

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

export const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Redirect root to admin dashboard */}
          <Route
            path="/"
            element={<Navigate to="/admin/dashboard" replace />}
          />

          {/* Admin routes */}
          <Route
            path="/admin/*"
            element={
              <DashboardLayout title="Admin Dashboard">
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  {/* Add more admin routes here */}
                </Routes>
              </DashboardLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;