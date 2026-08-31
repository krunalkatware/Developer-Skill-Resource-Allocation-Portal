import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';
import DeveloperDashboard from './DeveloperDashboard';
import Avatar from '../components/common/Avatar';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

const Dashboard = ({ onShowToast }) => {
  const { user, isAdmin } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // If user is a developer, show the specialized developer dashboard
  if (!isAdmin) {
    return <DeveloperDashboard onShowToast={onShowToast} />;
  }

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getAdminStats();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      if (onShowToast) onShowToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const stats = data?.stats || {};
  const availability = data?.availability || {};
  const recentProjects = data?.recentProjects || [];
  const recentTasks = data?.recentTasks || [];

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header Greeting Banner */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
        <div>
          <h2 className="fs-4 fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            Good morning, {user?.name?.split(' ')[0] || 'Admin'} 👋
          </h2>
          <p className="text-secondary mb-0" style={{ fontSize: '0.88rem' }}>
            Here's an overview of your organization's development resources and active workloads.
          </p>
        </div>
        <div
          className="saas-badge py-2 px-3"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
        >
          <i className="bi bi-calendar3 me-2 text-primary"></i>
          {todayFormatted}
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton count={4} height="100px" />
      ) : (
        <>
          {/* 4 Main Stat Cards */}
          <div className="row g-3">
            {/* Total Developers */}
            <div className="col-12 col-sm-6 col-xl-3">
              <div className="stat-card">
                <div>
                  <div className="stat-label">Total Developers</div>
                  <div className="stat-value">{stats.totalDevelopers ?? 0}</div>
                  <div className="stat-subtext">
                    <span className="text-success fw-medium">+3 this month</span>
                  </div>
                </div>
                <div className="stat-icon-wrapper stat-icon-indigo">
                  <i className="bi bi-people-fill"></i>
                </div>
              </div>
            </div>

            {/* Active Projects */}
            <div className="col-12 col-sm-6 col-xl-3">
              <div className="stat-card">
                <div>
                  <div className="stat-label">Active Projects</div>
                  <div className="stat-value">{stats.activeProjects ?? 0}</div>
                  <div className="stat-subtext">
                    <span>{stats.totalProjects ?? 0} total registered</span>
                  </div>
                </div>
                <div className="stat-icon-wrapper stat-icon-sky">
                  <i className="bi bi-kanban-fill"></i>
                </div>
              </div>
            </div>

            {/* Open Tasks */}
            <div className="col-12 col-sm-6 col-xl-3">
              <div className="stat-card">
                <div>
                  <div className="stat-label">Open Tasks</div>
                  <div className="stat-value">{stats.openTasks ?? 0}</div>
                  <div className="stat-subtext">
                    <span className="text-success fw-medium">{stats.completedTasks ?? 0} completed</span>
                  </div>
                </div>
                <div className="stat-icon-wrapper stat-icon-amber">
                  <i className="bi bi-list-task"></i>
                </div>
              </div>
            </div>

            {/* Available Resources */}
            <div className="col-12 col-sm-6 col-xl-3">
              <div className="stat-card">
                <div>
                  <div className="stat-label">Available Resources</div>
                  <div className="stat-value">{stats.availableResources ?? 0}</div>
                  <div className="stat-subtext">
                    <span className="text-success fw-medium">
                      {availability.available?.percent ?? 0}% team bandwidth
                    </span>
                  </div>
                </div>
                <div className="stat-icon-wrapper stat-icon-emerald">
                  <i className="bi bi-check-circle-fill"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Resource Availability Section */}
          <div className="saas-card">
            <div className="saas-card-header">
              <div>
                <h5 className="saas-card-title">Resource Availability Breakdown</h5>
                <span className="text-secondary" style={{ fontSize: '0.78rem' }}>
                  Live developer allocation capacity
                </span>
              </div>
              <Link to="/allocation" className="btn-saas-secondary btn-sm" style={{ fontSize: '0.8rem' }}>
                <i className="bi bi-diagram-3"></i> View Allocation Matrix
              </Link>
            </div>
            <div className="saas-card-body">
              <div className="row g-4">
                {/* Available Progress */}
                <div className="col-md-4">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-semibold" style={{ fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                      Available
                    </span>
                    <span className="text-success fw-bold" style={{ fontSize: '0.84rem' }}>
                      {availability.available?.percent ?? 0}% ({availability.available?.count ?? 0} devs)
                    </span>
                  </div>
                  <div className="saas-progress">
                    <div
                      className="saas-progress-bar bg-success"
                      style={{ width: `${availability.available?.percent ?? 0}%` }}
                    ></div>
                  </div>
                  <span className="text-secondary mt-1 d-block" style={{ fontSize: '0.75rem' }}>
                    Ready for immediate task assignment
                  </span>
                </div>

                {/* Partially Allocated Progress */}
                <div className="col-md-4">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-semibold" style={{ fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                      Partially Allocated
                    </span>
                    <span className="text-warning fw-bold" style={{ fontSize: '0.84rem' }}>
                      {availability.partiallyAllocated?.percent ?? 0}% ({availability.partiallyAllocated?.count ?? 0} devs)
                    </span>
                  </div>
                  <div className="saas-progress">
                    <div
                      className="saas-progress-bar bg-warning"
                      style={{ width: `${availability.partiallyAllocated?.percent ?? 0}%` }}
                    ></div>
                  </div>
                  <span className="text-secondary mt-1 d-block" style={{ fontSize: '0.75rem' }}>
                    Can absorb minor supplementary tasks
                  </span>
                </div>

                {/* Fully Allocated Progress */}
                <div className="col-md-4">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-semibold" style={{ fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                      Fully Allocated
                    </span>
                    <span className="text-danger fw-bold" style={{ fontSize: '0.84rem' }}>
                      {availability.fullyAllocated?.percent ?? 0}% ({availability.fullyAllocated?.count ?? 0} devs)
                    </span>
                  </div>
                  <div className="saas-progress">
                    <div
                      className="saas-progress-bar bg-danger"
                      style={{ width: `${availability.fullyAllocated?.percent ?? 0}%` }}
                    ></div>
                  </div>
                  <span className="text-secondary mt-1 d-block" style={{ fontSize: '0.75rem' }}>
                    Operating at maximum project capacity
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Two-Column Grid: Recent Projects & Recent Tasks */}
          <div className="row g-4">
            {/* Recent Projects Table */}
            <div className="col-12 col-xl-6">
              <div className="saas-card h-100">
                <div className="saas-card-header">
                  <h5 className="saas-card-title">Recent Projects</h5>
                  <Link to="/projects" className="text-primary fw-medium" style={{ fontSize: '0.82rem' }}>
                    View All <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
                <div className="saas-table-wrapper">
                  <table className="saas-table">
                    <thead>
                      <tr>
                        <th>Project</th>
                        <th>Status</th>
                        <th>Progress</th>
                        <th>Devs</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentProjects.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center text-muted py-4">
                            No projects recorded yet.
                          </td>
                        </tr>
                      ) : (
                        recentProjects.map((p) => (
                          <tr key={p._id}>
                            <td>
                              <Link to={`/projects/${p._id}`} className="fw-semibold text-primary">
                                {p.name}
                              </Link>
                              <div className="text-secondary" style={{ fontSize: '0.75rem' }}>
                                Client: {p.client}
                              </div>
                            </td>
                            <td>
                              <StatusBadge status={p.status} />
                            </td>
                            <td style={{ minWidth: '110px' }}>
                              <div className="d-flex align-items-center gap-2">
                                <div className="saas-progress flex-grow-1" style={{ height: '6px' }}>
                                  <div
                                    className="saas-progress-bar bg-primary"
                                    style={{ width: `${p.progress}%` }}
                                  ></div>
                                </div>
                                <span className="text-secondary" style={{ fontSize: '0.74rem' }}>
                                  {p.progress}%
                                </span>
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-secondary-subtle text-secondary">
                                <i className="bi bi-people me-1"></i>
                                {p.developerCount}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Recent Tasks Table */}
            <div className="col-12 col-xl-6">
              <div className="saas-card h-100">
                <div className="saas-card-header">
                  <h5 className="saas-card-title">Recent Work Tasks</h5>
                  <Link to="/tasks" className="text-primary fw-medium" style={{ fontSize: '0.82rem' }}>
                    View All <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
                <div className="saas-table-wrapper">
                  <table className="saas-table">
                    <thead>
                      <tr>
                        <th>Task</th>
                        <th>Assigned To</th>
                        <th>Priority</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTasks.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center text-muted py-4">
                            No tasks recorded yet.
                          </td>
                        </tr>
                      ) : (
                        recentTasks.map((t) => (
                          <tr key={t._id}>
                            <td>
                              <div className="fw-semibold" style={{ color: 'var(--text-primary)' }}>
                                {t.title}
                              </div>
                              <div className="text-secondary" style={{ fontSize: '0.75rem' }}>
                                {t.project?.name || 'Project'}
                              </div>
                            </td>
                            <td>
                              {t.assignedDeveloper ? (
                                <div className="d-flex align-items-center gap-2">
                                  <Avatar name={t.assignedDeveloper.name} size="sm" />
                                  <span style={{ fontSize: '0.82rem' }}>{t.assignedDeveloper.name}</span>
                                </div>
                              ) : (
                                <span className="badge bg-warning-subtle text-warning" style={{ fontSize: '0.72rem' }}>
                                  Unassigned
                                </span>
                              )}
                            </td>
                            <td>
                              <PriorityBadge priority={t.priority} />
                            </td>
                            <td>
                              <StatusBadge status={t.status} />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
