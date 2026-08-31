import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectService } from '../services/projectService';
import Avatar from '../components/common/Avatar';
import { StatusBadge, PriorityBadge, AvailabilityBadge } from '../components/common/Badge';
import MatchModal from '../components/matching/MatchModal';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import { useAuth } from '../context/AuthContext';

const ProjectDetails = ({ onShowToast }) => {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTaskForMatch, setSelectedTaskForMatch] = useState(null);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const res = await projectService.getProjectById(id);
      if (res.success && res.data) {
        setProject(res.data);
      }
    } catch (err) {
      if (onShowToast) onShowToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex flex-column gap-3">
        <LoadingSkeleton count={3} height="120px" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="saas-card p-5 text-center">
        <h5 className="text-danger">Project Not Found</h5>
        <p className="text-secondary">The requested project does not exist.</p>
        <Link to="/projects" className="btn-saas-primary btn-sm mt-2">
          Back to Projects
        </Link>
      </div>
    );
  }

  const tasks = project.tasks || [];
  const assignedDevs = project.assignedDevelopers || [];

  return (
    <div className="d-flex flex-column gap-4">
      {/* Breadcrumb Navigation */}
      <div className="d-flex align-items-center gap-2">
        <Link to="/projects" className="text-secondary" style={{ fontSize: '0.85rem' }}>
          <i className="bi bi-arrow-left me-1"></i> Back to Projects
        </Link>
      </div>

      {/* Project Overview Card */}
      <div className="saas-card p-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-3">
          <div>
            <div className="text-secondary" style={{ fontSize: '0.78rem', fontWeight: 600 }}>
              CLIENT: {project.client}
            </div>
            <h3 className="fw-bold mb-1 text-primary" style={{ fontSize: '1.4rem' }}>
              {project.name}
            </h3>
            <p className="text-secondary mb-0" style={{ fontSize: '0.88rem' }}>
              {project.description || 'Enterprise project engagement'}
            </p>
          </div>

          <div className="d-flex gap-2">
            <PriorityBadge priority={project.priority} />
            <StatusBadge status={project.status} />
          </div>
        </div>

        {/* Progress Bar & Key Metrics */}
        <div
          className="row g-3 mt-2 pt-3 border-top"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <div className="col-12 col-md-4">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="text-secondary" style={{ fontSize: '0.78rem' }}>
                Delivery Completion
              </span>
              <span className="fw-bold text-primary" style={{ fontSize: '0.84rem' }}>
                {project.progress}%
              </span>
            </div>
            <div className="saas-progress">
              <div
                className="saas-progress-bar bg-primary"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>

          <div className="col-6 col-md-4">
            <div className="text-secondary" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
              Timeline Milestone
            </div>
            <div className="fw-semibold mt-1" style={{ color: 'var(--text-primary)', fontSize: '0.84rem' }}>
              {new Date(project.startDate).toLocaleDateString()} —{' '}
              {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Ongoing'}
            </div>
          </div>

          <div className="col-6 col-md-4">
            <div className="text-secondary" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
              Resource Allocation
            </div>
            <div className="fw-semibold mt-1" style={{ color: 'var(--text-primary)', fontSize: '0.84rem' }}>
              {project.totalTasks} Tasks • {project.developerCount} Developers Assigned
            </div>
          </div>
        </div>
      </div>

      {/* Project Tasks Table */}
      <div className="saas-card">
        <div className="saas-card-header">
          <div>
            <h5 className="saas-card-title">Project Deliverables & Work Tasks</h5>
            <span className="text-secondary" style={{ fontSize: '0.78rem' }}>
              Specific work items and assigned technical resources
            </span>
          </div>
          <span className="badge bg-primary-subtle text-primary">{tasks.length} Tasks</span>
        </div>
        <div className="saas-table-wrapper">
          <table className="saas-table">
            <thead>
              <tr>
                <th>Task Title</th>
                <th>Required Skills</th>
                <th>Priority</th>
                <th>Assigned Developer</th>
                <th>Status</th>
                {isAdmin && <th className="text-end">Matching & Assignment</th>}
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    No tasks created for this project yet.
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task._id}>
                    <td>
                      <div className="fw-semibold" style={{ color: 'var(--text-primary)' }}>
                        {task.title}
                      </div>
                      {task.description && (
                        <div className="text-secondary" style={{ fontSize: '0.75rem', maxWidth: '280px' }}>
                          {task.description}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-1" style={{ maxWidth: '220px' }}>
                        {task.requiredSkills?.map((s) => (
                          <span key={s._id || s} className="badge-skill">
                            {s.name || 'Skill'}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <PriorityBadge priority={task.priority} />
                    </td>
                    <td>
                      {task.assignedDeveloper ? (
                        <div className="d-flex align-items-center gap-2">
                          <Avatar name={task.assignedDeveloper.name} size="sm" />
                          <div>
                            <div className="fw-medium" style={{ fontSize: '0.82rem' }}>
                              {task.assignedDeveloper.name}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="badge bg-warning-subtle text-warning" style={{ fontSize: '0.75rem' }}>
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td>
                      <StatusBadge status={task.status} />
                    </td>
                    {isAdmin && (
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn-saas-primary btn-sm"
                          style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                          onClick={() => setSelectedTaskForMatch(task)}
                        >
                          <i className="bi bi-cpu me-1"></i> Match Developer
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assigned Developers Card */}
      <div className="saas-card">
        <div className="saas-card-header">
          <h5 className="saas-card-title">Assigned Developer Resources</h5>
          <span className="badge bg-success-subtle text-success">
            {assignedDevs.length} Team Members
          </span>
        </div>
        <div className="saas-card-body">
          {assignedDevs.length === 0 ? (
            <p className="text-secondary mb-0">No developers assigned to this project's tasks yet.</p>
          ) : (
            <div className="row g-3">
              {assignedDevs.map((dev) => (
                <div key={dev._id} className="col-12 col-md-4">
                  <div
                    className="p-3 rounded-3 d-flex align-items-center gap-3"
                    style={{
                      backgroundColor: 'var(--bg-secondary-surface)',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    <Avatar name={dev.name} size="md" />
                    <div>
                      <Link to={`/developers/${dev._id}`} className="fw-bold text-primary" style={{ fontSize: '0.88rem' }}>
                        {dev.name}
                      </Link>
                      <div className="text-secondary" style={{ fontSize: '0.76rem' }}>
                        {dev.designation || 'Developer'}
                      </div>
                      <div className="mt-1">
                        <AvailabilityBadge availability={dev.availability} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Matching Modal */}
      {selectedTaskForMatch && (
        <MatchModal
          isOpen={!!selectedTaskForMatch}
          onClose={() => setSelectedTaskForMatch(null)}
          task={selectedTaskForMatch}
          onAssignmentSuccess={fetchProject}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
};

export default ProjectDetails;
