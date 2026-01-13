import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AuthProvider, AppProvider } from './context/AppContext';
import { theme } from './styles/theme';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ClientsPage from './pages/ClientsPage';
import CalendarPage from './pages/CalendarPage';
import InsightsPage from './pages/InsightsPage';
import SettingsPage from './pages/SettingsPage';
import Layout from './components/Layout';
import ClientDetailPage from './pages/ClientDetailPage';
import SessionDetailPage from './pages/SessionDetailPage';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AuthProvider>
          <AppProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                
                {/* Protected routes wrapped in Layout */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="clients" element={<ClientsPage />} />
                  <Route path="clients/:clientId" element={<ClientDetailPage />} />
                  <Route path="sessions/:sessionId" element={<SessionDetailPage />} />
                  {/* Implemented routes */}
                  <Route path="calendar" element={<CalendarPage />} />
                  <Route path="insights" element={<InsightsPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>
              </Routes>
            </Router>
          </AppProvider>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
