import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { developerService } from '../services/developerService';
import Avatar from '../components/common/Avatar';
import { AvailabilityBadge, PriorityBadge, StatusBadge, SkillBadge } from '../components/common/Badge';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

const DeveloperDetails = ({ onShowToast }) => {
  const { id } = useParams();
  const [developer, setDeveloper] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeveloper();
  }, [id]);

  const fetchDeveloper = async () => {
    try {
      setLoading(true);
      const res = await developerService.getDeveloperById(id);
      if (res.success && res.data) {
        setDeveloper(res.data);
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

  if (!developer) {
    return (
      <div className="saas-card p-5 text-center">
        <h5 className="text-danger">Developer Not Found</h5>
        <p className="text-secondary">The requested developer profile does not exist.</p>
        <Link to="/developers" className="btn-saas-primary btn-sm mt-2">
          Back to Developers Directory
        </Link>
      </div>
    );
  }

  const assignedTasks = developer.assignedTasks || [];

  return (
    <div className="d-flex flex-column gap-4">
      {/* Breadcrumb & Navigation */}
      <div className="d-flex align-items-center gap-2">
        <Link to="/developers" className="text-secondary" style={{ fontSize: '0.85rem' }}>
          <i className="bi bi-arrow-left me-1"></i> Back to Developers
        </Link>
      </div>

      {/* Profile Header Card */}
      <div className="saas-card p-4">
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <Avatar name={developer.name} size="lg" />
            <div>
              <div className="d-flex align-items-center gap-2">
                <h3 className="fw-bold mb-0" style={{ color: 'var(--text-primary)', fontSize: '1.4rem' }}>
                  {developer.name}
                </h3>
                <AvailabilityBadge availability={developer.availability} />
              </div>
              <p className="text-secondary mb-0 mt-1" style={{ fontSize: '0.88rem' }}>
                {developer.designation} • {developer.department}
              </p>
            </div>
          </div>

          <div className="d-flex gap-2">
            <a
              href={`mailto:${developer.email}`}
              className="btn-saas-secondary btn-sm"
            >
              <i className="bi bi-envelope"></i> Email Developer
            </a>
          </div>
        </div>

        {/* Contact & Bio Specs */}
        <div
          className="row g-3 mt-3 pt-3 border-top"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <div className="col-12 col-sm-4">
            <div className="text-secondary" style={{ fontSize: '0.76rem', textTransform: 'uppercase' }}>
              Email Address
            </div>
            <div className="fw-semibold mt-1" style={{ color: 'var(--text-primary)', fontSize: '0.88rem' }}>
              {developer.email}
            </div>
          </div>

          <div className="col-12 col-sm-4">
            <div className="text-secondary" style={{ fontSize: '0.76rem', textTransform: 'uppercase' }}>
              Phone Number
            </div>
            <div className="fw-semibold mt-1" style={{ color: 'var(--text-primary)', fontSize: '0.88rem' }}>
              {developer.phone || 'Not specified'}
            </div>
          </div>

          <div className="col-12 col-sm-4">
            <div className="text-secondary" style={{ fontSize: '0.76rem', textTransform: 'uppercase' }}>
              Industry Experience
            </div>
            <div className="fw-semibold mt-1" style={{ color: 'var(--text-primary)', fontSize: '0.88rem' }}>
              {developer.experience} Year{developer.experience > 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Technical Skills Card */}
      <div className="saas-card">
        <div className="saas-card-header">
          <div>
            <h5 className="saas-card-title">Technical Skills & Proficiency</h5>
            <span className="text-secondary" style={{ fontSize: '0.78rem' }}>
              Verified skill credentials used by the resource matching algorithm
            </span>
          </div>
          <span className="badge bg-primary-subtle text-primary">
            {developer.skills?.length || 0} Registered Skills
          </span>
        </div>
        <div className="saas-card-body">
          {developer.skills?.length === 0 ? (
            <p className="text-secondary mb-0">No technical skills assigned yet.</p>
          ) : (
            <div className="row g-3">
              {developer.skills.map((item) => (
                <div key={item.skill?._id || item._id} className="col-12 col-sm-6 col-md-4">
                  <div
                    className="p-3 rounded-3 h-100 d-flex flex-column justify-content-between"
                    style={{
                      backgroundColor: 'var(--bg-secondary-surface)',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="fw-bold" style={{ color: 'var(--text-primary)', fontSize: '0.92rem' }}>
                        {item.skill?.name || 'Technical Skill'}
                      </span>
                      <span
                        className={`badge ${
                          item.proficiency === 'Expert'
                            ? 'bg-purple text-white'
                            : item.proficiency === 'Advanced'
                            ? 'bg-success text-white'
                            : item.proficiency === 'Intermediate'
                            ? 'bg-primary text-white'
                            : 'bg-secondary text-white'
                        }`}
                        style={{ fontSize: '0.72rem' }}
                      >
                        {item.proficiency}
                      </span>
                    </div>
                    <span className="text-secondary" style={{ fontSize: '0.76rem' }}>
                      Category: {item.skill?.category || 'General'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Assigned Tasks Table */}
      <div className="saas-card">
        <div className="saas-card-header">
          <div>
            <h5 className="saas-card-title">Assigned Project Tasks</h5>
            <span className="text-secondary" style={{ fontSize: '0.78rem' }}>
              Tasks currently allocated to {developer.name}
            </span>
          </div>
          <span className="badge bg-secondary-subtle text-secondary">
            {assignedTasks.length} Assigned Tasks
          </span>
        </div>
        <div className="saas-table-wrapper">
          <table className="saas-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Project</th>
                <th>Priority</th>
                <th>Deadline</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {assignedTasks.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    No active tasks currently assigned to this developer.
                  </td>
                </tr>
              ) : (
                assignedTasks.map((task) => (
                  <tr key={task._id}>
                    <td>
                      <span className="fw-semibold" style={{ color: 'var(--text-primary)' }}>
                        {task.title}
                      </span>
                    </td>
                    <td>
                      <span className="text-primary fw-medium">{task.project?.name || 'Project'}</span>
                    </td>
                    <td>
                      <PriorityBadge priority={task.priority} />
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem' }}>
                        {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={task.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeveloperDetails;
