import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItemClick = () => {
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isMobileOpen && (
        <div
          className="d-lg-none position-fixed top-0 start-0 w-100 h-100"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', zIndex: 999 }}
          onClick={onCloseMobile}
        />
      )}

      <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-header">
          <div className="brand-icon">
            <i className="bi bi-cpu-fill"></i>
          </div>
          <div>
            <div className="brand-title">DevResource</div>
            <div className="brand-subtitle">Resource Management</div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="sidebar-nav">
          <div className="nav-section-title">Overview</div>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
            onClick={navItemClick}
          >
            <i className="bi bi-grid-1x2"></i>
            <span>{isAdmin ? 'Dashboard' : 'My Dashboard'}</span>
          </NavLink>

          {isAdmin ? (
            <>
              <div className="nav-section-title mt-2">Management</div>
              <NavLink
                to="/developers"
                className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
                onClick={navItemClick}
              >
                <i className="bi bi-people"></i>
                <span>Developers</span>
              </NavLink>

              <NavLink
                to="/skills"
                className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
                onClick={navItemClick}
              >
                <i className="bi bi-code-slash"></i>
                <span>Skills</span>
              </NavLink>

              <NavLink
                to="/projects"
                className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
                onClick={navItemClick}
              >
                <i className="bi bi-kanban"></i>
                <span>Projects</span>
              </NavLink>

              <NavLink
                to="/tasks"
                className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
                onClick={navItemClick}
              >
                <i className="bi bi-list-check"></i>
                <span>Tasks</span>
              </NavLink>

              <div className="nav-section-title mt-2">Resources</div>
              <NavLink
                to="/allocation"
                className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
                onClick={navItemClick}
              >
                <i className="bi bi-diagram-3"></i>
                <span>Resource Allocation</span>
              </NavLink>
            </>
          ) : (
            <>
              <div className="nav-section-title mt-2">Workspace</div>
              <NavLink
                to="/tasks"
                className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
                onClick={navItemClick}
              >
                <i className="bi bi-list-check"></i>
                <span>My Assigned Tasks</span>
              </NavLink>

              <NavLink
                to="/projects"
                className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
                onClick={navItemClick}
              >
                <i className="bi bi-kanban"></i>
                <span>Projects</span>
              </NavLink>
            </>
          )}

          <div className="nav-section-title mt-2">Account</div>
          <NavLink
            to="/profile"
            className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
            onClick={navItemClick}
          >
            <i className="bi bi-person"></i>
            <span>Profile</span>
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
            onClick={navItemClick}
          >
            <i className="bi bi-gear"></i>
            <span>Settings</span>
          </NavLink>
        </div>

        {/* Footer with Logout */}
        <div className="sidebar-footer">
          <button
            type="button"
            className="nav-link-custom w-100 text-danger border-0 bg-transparent"
            onClick={handleLogout}
            style={{ cursor: 'pointer' }}
          >
            <i className="bi bi-box-arrow-right text-danger"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
