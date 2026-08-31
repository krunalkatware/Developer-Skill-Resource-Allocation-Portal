import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';
import { taskService } from '../services/taskService';
import { PriorityBadge, StatusBadge, SkillBadge } from '../components/common/Badge';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';

const DeveloperDashboard = ({ onShowToast }) => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  useEffect(() => {
    fetchDeveloperStats();
  }, []);

  const fetchDeveloperStats = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getDeveloperStats();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      if (onShowToast) onShowToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      setUpdatingTaskId(taskId);
      await taskService.updateTaskStatus(taskId, newStatus);
      if (onShowToast) {
        onShowToast(`Task status updated to ${newStatus}`, 'success');
      }
      // Refresh developer metrics and task list
      await fetchDeveloperStats();
    } catch (err) {
      if (onShowToast) onShowToast(err.message, 'error');
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const stats = data?.stats || {};
  const myTasks = data?.myTasks || [];
  const myProjects = data?.myProjects || [];

  return (
    <div className="d-flex flex-column gap-4">
      {/* Greeting Banner */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
        <div>
          <h2 className="fs-4 fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            Welcome back, {user?.name} 💻
          </h2>
          <p className="text-secondary mb-0" style={{ fontSize: '0.88rem' }}>
            {user?.designation} • {user?.department} • Availability:{' '}
            <strong className="text-primary">{user?.availability}</strong>
          </p>
        </div>
        <div className="saas-badge py-2 px-3 badge-available">
          <i className="bi bi-person-check-fill me-1"></i> Developer Workspace
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton count={4} height="90px" />
      ) : (
        <>
          {/* Metric Cards */}
          <div className="row g-3">
            {/* My Projects */}
            <div className="col-12 col-sm-6 col-xl-3">
              <div className="stat-card">
                <div>
                  <div className="stat-label">My Projects</div>
                  <div className="stat-value">{stats.totalProjects ?? 0}</div>
                  <div className="stat-subtext">Active team engagements</div>
                </div>
                <div className="stat-icon-wrapper stat-icon-sky">
                  <i className="bi bi-kanban"></i>
                </div>
              </div>
            </div>

            {/* My Tasks */}
            <div className="col-12 col-sm-6 col-xl-3">
              <div className="stat-card">
                <div>
                  <div className="stat-label">Total Assigned Tasks</div>
                  <div className="stat-value">{stats.totalTasks ?? 0}</div>
                  <div className="stat-subtext">Assigned across projects</div>
                </div>
                <div className="stat-icon-wrapper stat-icon-indigo">
                  <i className="bi bi-list-check"></i>
                </div>
              </div>
            </div>

            {/* Pending Tasks */}
            <div className="col-12 col-sm-6 col-xl-3">
              <div className="stat-card">
                <div>
                  <div className="stat-label">Pending Tasks</div>
                  <div className="stat-value text-warning">{stats.pendingTasks ?? 0}</div>
                  <div className="stat-subtext">
                    {stats.inProgressTasks ?? 0} In Progress • {stats.todoTasks ?? 0} To Do
                  </div>
                </div>
                <div className="stat-icon-wrapper stat-icon-amber">
                  <i className="bi bi-hourglass-split"></i>
                </div>
              </div>
            </div>

            {/* Completed Tasks */}
            <div className="col-12 col-sm-6 col-xl-3">
              <div className="stat-card">
                <div>
                  <div className="stat-label">Completed Tasks</div>
                  <div className="stat-value text-success">{stats.completedTasks ?? 0}</div>
                  <div className="stat-subtext">Successfully delivered</div>
                </div>
                <div className="stat-icon-wrapper stat-icon-emerald">
                  <i className="bi bi-check2-circle"></i>
                </div>
              </div>
            </div>
          </div>

          {/* My Tasks Interactive Table */}
          <div className="saas-card">
            <div className="saas-card-header">
              <div>
                <h5 className="saas-card-title">My Assigned Work Tasks</h5>
                <span className="text-secondary" style={{ fontSize: '0.78rem' }}>
                  Update your task progress status directly from this table
                </span>
              </div>
            </div>
            <div className="saas-table-wrapper">
              <table className="saas-table">
                <thead>
                  <tr>
                    <th>Task Details</th>
                    <th>Project</th>
                    <th>Required Skills</th>
                    <th>Priority</th>
                    <th>Deadline</th>
                    <th>Status</th>
                    <th>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myTasks.length === 0 ? (
                    <tr>
                      <td colSpan="7">
                        <EmptyState
                          icon="bi-check-all"
                          title="No Tasks Assigned"
                          description="You currently have no tasks assigned to you. Enjoy your bandwidth or consult your resource manager!"
                        />
                      </td>
                    </tr>
                  ) : (
                    myTasks.map((t) => (
                      <tr key={t._id}>
                        <td>
                          <div className="fw-semibold" style={{ color: 'var(--text-primary)' }}>
                            {t.title}
                          </div>
                          {t.description && (
                            <div className="text-secondary mt-1" style={{ fontSize: '0.78rem', maxWidth: '300px' }}>
                              {t.description}
                            </div>
                          )}
                        </td>
                        <td>
                          <span className="fw-medium text-primary">{t.project?.name || 'Project'}</span>
                          <div className="text-secondary" style={{ fontSize: '0.74rem' }}>
                            Client: {t.project?.client || 'Internal'}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex flex-wrap gap-1" style={{ maxWidth: '200px' }}>
                            {t.requiredSkills?.map((s) => (
                              <span key={s._id || s} className="badge-skill" style={{ fontSize: '0.72rem' }}>
                                {s.name || 'Skill'}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <PriorityBadge priority={t.priority} />
                        </td>
                        <td>
                          <span style={{ fontSize: '0.82rem' }}>
                            {t.deadline ? new Date(t.deadline).toLocaleDateString() : 'No deadline'}
                          </span>
                        </td>
                        <td>
                          <StatusBadge status={t.status} />
                        </td>
                        <td>
                          {/* Live Status Dropdown for Developer */}
                          <select
                            className="saas-form-select form-select-sm"
                            value={t.status}
                            disabled={updatingTaskId === t._id}
                            onChange={(e) => handleStatusChange(t._id, e.target.value)}
                            style={{ minWidth: '130px', fontSize: '0.8rem' }}
                          >
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* My Projects Summary List */}
          <div className="saas-card">
            <div className="saas-card-header">
              <h5 className="saas-card-title">My Associated Projects</h5>
            </div>
            <div className="saas-card-body">
              {myProjects.length === 0 ? (
                <p className="text-secondary mb-0">No active project associations found.</p>
              ) : (
                <div className="row g-3">
                  {myProjects.map((p) => (
                    <div key={p._id} className="col-12 col-md-4">
                      <div
                        className="p-3 rounded-3 h-100"
                        style={{
                          backgroundColor: 'var(--bg-secondary-surface)',
                          border: '1px solid var(--border-color)',
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="fw-bold mb-0 text-primary">{p.name}</h6>
                          <StatusBadge status={p.status} />
                        </div>
                        <p className="text-secondary mb-2" style={{ fontSize: '0.78rem', lineHeight: '1.4' }}>
                          {p.description || 'Enterprise project engagement'}
                        </p>
                        <div className="text-muted" style={{ fontSize: '0.74rem' }}>
                          Client: <strong>{p.client}</strong> • Priority: <strong>{p.priority}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DeveloperDashboard;
