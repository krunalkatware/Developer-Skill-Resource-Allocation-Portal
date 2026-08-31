import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Toast from './components/common/Toast';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Developers from './pages/Developers';
import DeveloperDetails from './pages/DeveloperDetails';
import Skills from './pages/Skills';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Tasks from './pages/Tasks';
import ResourceAllocation from './pages/ResourceAllocation';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

const App = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <>
      <Routes>
        {/* Public Login Route */}
        <Route path="/login" element={<Login onShowToast={showToast} />} />

        {/* Protected Application Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard onShowToast={showToast} />} />
            <Route path="/projects" element={<Projects onShowToast={showToast} />} />
            <Route path="/projects/:id" element={<ProjectDetails onShowToast={showToast} />} />
            <Route path="/tasks" element={<Tasks onShowToast={showToast} />} />
            <Route path="/developers/:id" element={<DeveloperDetails onShowToast={showToast} />} />
            <Route path="/profile" element={<Profile onShowToast={showToast} />} />
            <Route path="/settings" element={<Settings onShowToast={showToast} />} />

            {/* Admin-only Routes */}
            <Route element={<ProtectedRoute adminOnly={true} />}>
              <Route path="/developers" element={<Developers onShowToast={showToast} />} />
              <Route path="/skills" element={<Skills onShowToast={showToast} />} />
              <Route path="/allocation" element={<ResourceAllocation onShowToast={showToast} />} />
            </Route>
          </Route>
        </Route>

        {/* Fallback Catch-all Route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

      {/* Global Toast Alerts */}
      <Toast toasts={toasts} removeToast={removeToast} />
    </>
  );
};

export default App;
