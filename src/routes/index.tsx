import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import LoginForm from '../components/auth/LoginForm';
import FileExplorer from '../components/drive/FileExplorer';
import RepositoryViewer from '../components/github/RepositoryViewer';
import FinancialDashboard from '../components/dashboard/FinancialDashboard';
import ReportsPage from '../pages/ReportsPage';
import AnalyticsDashboard from '../components/dashboard/AnalyticsDashboard';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/drive"
          element={
            <ProtectedRoute>
              <FileExplorer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/github"
          element={
            <ProtectedRoute>
              <RepositoryViewer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/financials"
          element={
            <ProtectedRoute>
              <FinancialDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <ReportsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;