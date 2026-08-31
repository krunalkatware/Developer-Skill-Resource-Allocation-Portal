import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import Avatar from './Avatar';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard Overview',
  '/developers': 'Developer Directory',
  '/skills': 'Technical Skills Library',
  '/projects': 'Projects & Portfolios',
  '/tasks': 'Task Management & Assignment',
  '/allocation': 'Resource Allocation Matrix',
  '/profile': 'My Account Profile',
  '/settings': 'Application Settings',
};

const Navbar = ({ onToggleMobileSidebar }) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { user } = useAuth();
  const location = useLocation();

  // Determine current page title
  const currentPath = location.pathname;
  let pageTitle = 'DevResource Portal';
  Object.keys(PAGE_TITLES).forEach((key) => {
    if (currentPath === key || currentPath.startsWith(`${key}/`)) {
      pageTitle = PAGE_TITLES[key];
    }
  });

  return (
    <header className="top-navbar">
      <div className="d-flex align-items-center gap-3">
        <button
          type="button"
          className="btn-icon d-lg-none"
          onClick={onToggleMobileSidebar}
          aria-label="Toggle Navigation Menu"
        >
          <i className="bi bi-list fs-5"></i>
        </button>

        <div>
          <h1 className="fs-6 fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>
            {pageTitle}
          </h1>
          <span className="text-secondary" style={{ fontSize: '0.74rem' }}>
            Enterprise Resource Allocation System
          </span>
        </div>
      </div>

      <div className="d-flex align-items-center gap-2 gap-sm-3">
        {/* Theme Toggle Button */}
        <button
          type="button"
          className="btn-saas-secondary py-1 px-2 px-sm-3"
          onClick={toggleTheme}
          title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
          style={{ fontSize: '0.82rem' }}
        >
          <i className={`bi ${isDark ? 'bi-sun-fill text-warning' : 'bi-moon-stars-fill text-primary'}`}></i>
          <span className="d-none d-sm-inline ms-1">{isDark ? 'Light' : 'Dark'}</span>
        </button>

        {/* Simple Notification Bell */}
        <div className="position-relative">
          <button
            type="button"
            className="btn-icon position-relative"
            title="System Notifications"
            aria-label="Notifications"
          >
            <i className="bi bi-bell"></i>
            <span
              className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
              style={{ width: '8px', height: '8px', marginTop: '6px', marginLeft: '-6px' }}
            >
              <span className="visually-hidden">New alerts</span>
            </span>
          </button>
        </div>

        {/* User Info & Avatar */}
        <div className="d-flex align-items-center gap-2 ps-2 border-start" style={{ borderColor: 'var(--border-color)' }}>
          <Avatar name={user?.name || 'User'} size="md" />
          <div className="d-none d-md-block text-start" style={{ lineHeight: '1.2' }}>
            <div className="fw-semibold" style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
              {user?.name || 'User'}
            </div>
            <div className="text-secondary" style={{ fontSize: '0.72rem', textTransform: 'capitalize' }}>
              {user?.role === 'admin' ? 'Resource Manager' : user?.designation || 'Developer'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
