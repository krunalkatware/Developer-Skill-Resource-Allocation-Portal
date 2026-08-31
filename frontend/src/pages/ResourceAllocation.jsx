import React, { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import { developerService } from '../services/developerService';
import Avatar from '../components/common/Avatar';
import { StatusBadge, PriorityBadge, AvailabilityBadge } from '../components/common/Badge';
import MatchModal from '../components/matching/MatchModal';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';

const ResourceAllocation = ({ onShowToast }) => {
  const [tasks, setTasks] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTaskForMatch, setSelectedTaskForMatch] = useState(null);
  const [unassigningId, setUnassigningId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [taskRes, devRes] = await Promise.all([
        taskService.getTasks(),
        developerService.getDevelopers(),
      ]);
      if (taskRes.data) setTasks(taskRes.data);
      if (devRes.data) setDevelopers(devRes.data);
    } catch (err) {
      if (onShowToast) onShowToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUnassign = async (taskId) => {
    try {
      setUnassigningId(taskId);
      await taskService.assignTask(taskId, null);
      if (onShowToast) onShowToast('Developer unassigned from task', 'info');
      await loadData();
    } catch (err) {
      if (onShowToast) onShowToast(err.message, 'error');
    } finally {
      setUnassigningId(null);
    }
  };

  // Metrics
  const assignedDevIds = new Set(tasks.filter((t) => t.assignedDeveloper).map((t) => t.assignedDeveloper._id?.toString() || t.assignedDeveloper.toString()));
  const assignedCount = assignedDevIds.size;
  const availableCount = developers.filter((d) => d.availability === 'Available').length;
  const unassignedTasksCount = tasks.filter((t) => !t.assignedDeveloper).length;

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header */}
      <div>
        <h2 className="fs-4 fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          Resource Allocation
        </h2>
        <p className="text-secondary mb-0" style={{ fontSize: '0.88rem' }}>
          View and manage developer assignments, project workload distribution, and unassigned backlog.
        </p>
      </div>

      {loading ? (
        <LoadingSkeleton count={3} height="90px" />
      ) : (
        <>
          {/* Summary Metric Cards */}
          <div className="row g-3">
            {/* Assigned Developers */}
            <div className="col-12 col-md-4">
              <div className="stat-card">
                <div>
                  <div className="stat-label">Assigned Developers</div>
                  <div className="stat-value text-primary">{assignedCount}</div>
                  <div className="stat-subtext">Active on project deliverables</div>
                </div>
                <div className="stat-icon-wrapper stat-icon-indigo">
                  <i className="bi bi-person-check-fill"></i>
                </div>
              </div>
            </div>

            {/* Available Developers */}
            <div className="col-12 col-md-4">
              <div className="stat-card">
                <div>
                  <div className="stat-label">Available Developers</div>
                  <div className="stat-value text-success">{availableCount}</div>
                  <div className="stat-subtext">Ready for new task allocations</div>
                </div>
                <div className="stat-icon-wrapper stat-icon-emerald">
                  <i className="bi bi-person-plus-fill"></i>
                </div>
              </div>
            </div>

            {/* Unassigned Tasks */}
            <div className="col-12 col-md-4">
              <div className="stat-card">
                <div>
                  <div className="stat-label">Unassigned Tasks</div>
                  <div className="stat-value text-warning">{unassignedTasksCount}</div>
                  <div className="stat-subtext">Require developer allocation</div>
                </div>
                <div className="stat-icon-wrapper stat-icon-amber">
                  <i className="bi bi-exclamation-circle-fill"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Allocation Matrix Table */}
          <div className="saas-card">
            <div className="saas-card-header">
              <div>
                <h5 className="saas-card-title">Developer Resource Allocation Matrix</h5>
                <span className="text-secondary" style={{ fontSize: '0.78rem' }}>
                  Real-time mapping of team members to active task deliverables
                </span>
              </div>
            </div>
            <div className="saas-table-wrapper">
              <table className="saas-table">
                <thead>
                  <tr>
                    <th>Developer</th>
                    <th>Project</th>
                    <th>Task Deliverable</th>
                    <th>Required Skills</th>
                    <th>Deadline</th>
                    <th>Status</th>
                    <th className="text-end">Allocation Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.length === 0 ? (
                    <tr>
                      <td colSpan="7">
                        <EmptyState
                          icon="bi-diagram-3"
                          title="No allocation data"
                          description="Create tasks to allocate engineering bandwidth."
                        />
                      </td>
                    </tr>
                  ) : (
                    tasks.map((task) => {
                      const dev = task.assignedDeveloper;
                      return (
                        <tr key={task._id}>
                          <td>
                            {dev ? (
                              <div className="d-flex align-items-center gap-2">
                                <Avatar name={dev.name} size="sm" />
                                <div>
                                  <div className="fw-semibold" style={{ color: 'var(--text-primary)', fontSize: '0.86rem' }}>
                                    {dev.name}
                                  </div>
                                  <div className="text-secondary" style={{ fontSize: '0.72rem' }}>
                                    {dev.designation || 'Developer'}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <span className="badge bg-warning-subtle text-warning">
                                <i className="bi bi-clock-history me-1"></i> Unassigned
                              </span>
                            )}
                          </td>
                          <td>
                            <span className="fw-medium text-primary">{task.project?.name || 'Project'}</span>
                          </td>
                          <td>
                            <div className="fw-medium" style={{ color: 'var(--text-primary)', fontSize: '0.86rem' }}>
                              {task.title}
                            </div>
                            <div className="text-secondary" style={{ fontSize: '0.74rem' }}>
                              Priority: <PriorityBadge priority={task.priority} />
                            </div>
                          </td>
                          <td>
                            <div className="d-flex flex-wrap gap-1" style={{ maxWidth: '180px' }}>
                              {task.requiredSkills?.map((s) => (
                                <span key={s._id || s} className="badge-skill" style={{ fontSize: '0.72rem' }}>
                                  {s.name || 'Skill'}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td>
                            <span style={{ fontSize: '0.82rem' }}>
                              {task.deadline ? new Date(task.deadline).toLocaleDateString() : '—'}
                            </span>
                          </td>
                          <td>
                            <StatusBadge status={task.status} />
                          </td>
                          <td className="text-end">
                            <div className="d-flex justify-content-end gap-1">
                              {dev ? (
                                <>
                                  <button
                                    type="button"
                                    className="btn-saas-secondary btn-sm py-1 px-2"
                                    style={{ fontSize: '0.76rem' }}
                                    title="Reassign to another developer via matcher"
                                    onClick={() => setSelectedTaskForMatch(task)}
                                  >
                                    <i className="bi bi-arrow-repeat me-1"></i> Reassign
                                  </button>
                                  <button
                                    type="button"
                                    className="btn-icon text-danger"
                                    title="Unassign Developer"
                                    disabled={unassigningId === task._id}
                                    onClick={() => handleUnassign(task._id)}
                                  >
                                    <i className="bi bi-x-circle"></i>
                                  </button>
                                </>
                              ) : (
                                <button
                                  type="button"
                                  className="btn-saas-primary btn-sm py-1 px-2"
                                  style={{ fontSize: '0.76rem' }}
                                  onClick={() => setSelectedTaskForMatch(task)}
                                >
                                  <i className="bi bi-person-check me-1"></i> Assign Developer
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Matching Modal */}
      {selectedTaskForMatch && (
        <MatchModal
          isOpen={!!selectedTaskForMatch}
          onClose={() => setSelectedTaskForMatch(null)}
          task={selectedTaskForMatch}
          onAssignmentSuccess={loadData}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
};

export default ResourceAllocation;
