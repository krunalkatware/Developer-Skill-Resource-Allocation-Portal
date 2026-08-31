import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Settings = ({ onShowToast }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <div className="d-flex flex-column gap-4" style={{ maxWidth: '850px' }}>
      {/* Header */}
      <div>
        <h2 className="fs-4 fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          Application Settings
        </h2>
        <p className="text-secondary mb-0" style={{ fontSize: '0.88rem' }}>
          Configure appearance themes, interface preferences, and system parameters.
        </p>
      </div>

      {/* Theme Appearance Setting Card */}
      <div className="saas-card p-4">
        <h5 className="saas-card-title mb-1">Theme & Visual Experience</h5>
        <p className="text-secondary mb-4" style={{ fontSize: '0.82rem' }}>
          Choose your preferred theme. Your selection is automatically synchronized with localStorage.
        </p>

        <div className="row g-3">
          {/* Light Theme Card */}
          <div className="col-12 col-sm-6">
            <div
              className={`p-3 rounded-3 border transition-all ${
                !isDark ? 'border-primary shadow-sm' : ''
              }`}
              style={{
                backgroundColor: '#F6F8FC',
                color: '#111827',
                cursor: 'pointer',
                borderColor: !isDark ? 'var(--primary)' : 'var(--border-color)',
              }}
              onClick={() => {
                if (isDark) toggleTheme();
                if (onShowToast) onShowToast('Switched to Light Theme', 'info');
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-sun-fill text-warning fs-5"></i>
                  <span className="fw-bold" style={{ fontSize: '0.92rem' }}>
                    Light Theme (Default)
                  </span>
                </div>
                {!isDark && <i className="bi bi-check-circle-fill text-primary fs-5"></i>}
              </div>
              <p className="text-secondary mb-0" style={{ fontSize: '0.78rem' }}>
                Clean, crisp corporate SaaS styling with soft gray backgrounds and indigo accents.
              </p>
            </div>
          </div>

          {/* Dark Theme Card */}
          <div className="col-12 col-sm-6">
            <div
              className={`p-3 rounded-3 border transition-all ${
                isDark ? 'border-primary shadow-sm' : ''
              }`}
              style={{
                backgroundColor: '#1E293B',
                color: '#F8FAFC',
                cursor: 'pointer',
                borderColor: isDark ? 'var(--primary)' : 'var(--border-color)',
              }}
              onClick={() => {
                if (!isDark) toggleTheme();
                if (onShowToast) onShowToast('Switched to Dark Theme', 'info');
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-moon-stars-fill text-primary fs-5"></i>
                  <span className="fw-bold" style={{ fontSize: '0.92rem' }}>
                    Dark Theme
                  </span>
                </div>
                {isDark && <i className="bi bi-check-circle-fill text-primary fs-5"></i>}
              </div>
              <p style={{ fontSize: '0.78rem', color: '#94A3B8' }} className="mb-0">
                Sleek dark blue-gray surfaces tailored for low-light developer workflows (not pure black).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* System & Architecture Specifications */}
      <div className="saas-card p-4">
        <h5 className="saas-card-title mb-1">System Architecture & Engineering Specs</h5>
        <p className="text-secondary mb-3" style={{ fontSize: '0.82rem' }}>
          Overview of backend connection, database models, and algorithm configuration.
        </p>

        <div className="row g-3">
          <div className="col-12 col-sm-6">
            <div className="p-3 rounded-3" style={{ backgroundColor: 'var(--bg-secondary-surface)' }}>
              <div className="text-secondary" style={{ fontSize: '0.74rem', textTransform: 'uppercase' }}>
                Matching Engine Formula
              </div>
              <div className="fw-bold text-primary mt-1" style={{ fontSize: '0.86rem' }}>
                (Matched Skills / Total Required Skills) × 100
              </div>
              <div className="text-secondary mt-1" style={{ fontSize: '0.74rem' }}>
                Deterministic rule-based compatibility ranking
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6">
            <div className="p-3 rounded-3" style={{ backgroundColor: 'var(--bg-secondary-surface)' }}>
              <div className="text-secondary" style={{ fontSize: '0.74rem', textTransform: 'uppercase' }}>
                Authentication Standard
              </div>
              <div className="fw-bold text-success mt-1" style={{ fontSize: '0.86rem' }}>
                JSON Web Tokens (JWT) + Bcrypt
              </div>
              <div className="text-secondary mt-1" style={{ fontSize: '0.74rem' }}>
                Role-based access (Admin vs Developer)
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6">
            <div className="p-3 rounded-3" style={{ backgroundColor: 'var(--bg-secondary-surface)' }}>
              <div className="text-secondary" style={{ fontSize: '0.74rem', textTransform: 'uppercase' }}>
                Database Layer
              </div>
              <div className="fw-bold mt-1" style={{ color: 'var(--text-primary)', fontSize: '0.86rem' }}>
                MongoDB + Mongoose ODM
              </div>
              <div className="text-secondary mt-1" style={{ fontSize: '0.74rem' }}>
                4 Core Relational Models: User, Skill, Project, Task
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6">
            <div className="p-3 rounded-3" style={{ backgroundColor: 'var(--bg-secondary-surface)' }}>
              <div className="text-secondary" style={{ fontSize: '0.74rem', textTransform: 'uppercase' }}>
                Frontend Framework
              </div>
              <div className="fw-bold mt-1" style={{ color: 'var(--text-primary)', fontSize: '0.86rem' }}>
                React.js (Vite) + Vanilla CSS Variables
              </div>
              <div className="text-secondary mt-1" style={{ fontSize: '0.74rem' }}>
                Bootstrap 5 Utilities & Bootstrap Icons
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
