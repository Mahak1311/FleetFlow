import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { VehiclesPage } from '@/pages/VehiclesPage';
import { TripsPage } from '@/pages/TripsPage';
import { MaintenancePage } from '@/pages/MaintenancePage';
import { FuelPage } from '@/pages/FuelPage';
import { DriversPage } from '@/pages/DriversPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { AppLayout } from '@/components/AppLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route
            path="vehicles"
            element={
              <ProtectedRoute roles={['Fleet Manager', 'Dispatcher', 'Safety Officer']}>
                <VehiclesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="trips"
            element={
              <ProtectedRoute roles={['Fleet Manager', 'Dispatcher']}>
                <TripsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="maintenance"
            element={
              <ProtectedRoute roles={['Fleet Manager', 'Safety Officer']}>
                <MaintenancePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="fuel"
            element={
              <ProtectedRoute roles={['Fleet Manager', 'Financial Analyst']}>
                <FuelPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="drivers"
            element={
              <ProtectedRoute roles={['Fleet Manager', 'Safety Officer', 'Dispatcher']}>
                <DriversPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="analytics"
            element={
              <ProtectedRoute roles={['Fleet Manager', 'Financial Analyst']}>
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
