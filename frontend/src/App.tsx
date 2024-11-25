import React, { Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import theme from './theme';
import DashboardLayout from './layouts/DashboardLayout';
import StorePage from './components/store/StorePage';
const SetupWizard = React.lazy(() => import('./components/SetupWizard/SetupWizard'));
const AdminProducts = React.lazy(() => import('./components/admin/products/AdminProducts'));
const AdminOrders = React.lazy(() => import('./components/admin/orders/AdminOrders'));
const AdminCustomers = React.lazy(() => import('./components/admin/customers/AdminCustomers'));

const LoadingFallback = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
    <CircularProgress />
  </Box>
);

function App() {
  const isSetupEnabled = import.meta.env.VITE_SETUP_ENABLED === 'true';
  const baseUrl = import.meta.env.VITE_BASE_URL || '';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HashRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {isSetupEnabled && (
              <Route path="/setup" element={<SetupWizard />} />
            )}
            <Route path="/" element={
              isSetupEnabled ? <Navigate to="/setup" replace /> : 
              <DashboardLayout title="Store">
                <StorePage />
              </DashboardLayout>
            } />
            <Route path="/admin/products" element={<DashboardLayout title="Products">
              <AdminProducts />
            </DashboardLayout>} />
            <Route path="/admin/orders" element={<DashboardLayout title="Orders">
              <AdminOrders />
            </DashboardLayout>} />
            <Route path="/admin/customers" element={<DashboardLayout title="Customers">
              <AdminCustomers />
            </DashboardLayout>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;