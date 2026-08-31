import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Avatar from '../common/Avatar';
import { AvailabilityBadge, SkillBadge } from '../common/Badge';
import LoadingSkeleton from '../common/LoadingSkeleton';
import EmptyState from '../common/EmptyState';
import { taskService } from '../../services/taskService';

const MatchModal = ({ isOpen, onClose, task, onAssignmentSuccess, onShowToast }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState(null);
  const [confirmDev, setConfirmDev] = useState(null);

  useEffect(() => {
    if (isOpen && task?._id) {
      fetchRecommendations();
    } else {
      setRecommendations([]);
      setConfirmDev(null);
    }
  }, [isOpen, task]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const res = await taskService.getMatchingRecommendations(task._id);
      if (res.success && res.data) {
        setRecommendations(res.data.recommendations || []);
      }
    } catch (err) {
      if (onShowToast) onShowToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignClick = (dev) => {
    setConfirmDev(dev);
  };

  const handleConfirmAssignment = async () => {
    if (!confirmDev) return;
    try {
      setAssigningId(confirmDev.developer._id);
      await taskService.assignTask(task._id, confirmDev.developer._id);
      if (onShowToast) {
        onShowToast(`Developer ${confirmDev.developer.name} assigned successfully`, 'success');
      }
      if (onAssignmentSuccess) {
        onAssignmentSuccess();
      }
      setConfirmDev(null);
      onClose();
    } catch (err) {
      if (onShowToast) onShowToast(err.message, 'error');
    } finally {
      setAssigningId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Developer Skill Matching Engine"
      subtitle={`Find and allocate the best-suited developer for "${task?.title}"`}
      maxWidth="720px"
      footer={
        <button type="button" className="btn-saas-secondary" onClick={onClose}>
          Close
        </button>
      }
    >
      {/* Task Requirements Summary Banner */}
      <div
        className="p-3 mb-4 rounded-3"
        style={{
          backgroundColor: 'var(--bg-secondary-surface)',
          border: '1px solid var(--border-color)',
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="text-secondary" style={{ fontSize: '0.78rem', fontWeight: 600 }}>
            PROJECT: {task?.project?.name || 'Project'}
          </span>
          <span className="text-secondary" style={{ fontSize: '0.78rem' }}>
            Est. Hours: <strong className="text-primary">{task?.estimatedHours || 8}h</strong>
          </span>
        </div>

        <div className="d-flex flex-wrap align-items-center gap-1">
          <span className="me-2 fw-semibold" style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>
            Required Skills ({task?.requiredSkills?.length || 0}):
          </span>
          {task?.requiredSkills?.length > 0 ? (
            task.requiredSkills.map((sk) => (
              <span key={sk._id || sk} className="badge-skill">
                {sk.name || 'Skill'}
              </span>
            ))
          ) : (
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>
              No specific skills specified (Universal suitability)
            </span>
          )}
        </div>
      </div>

      {/* Confirmation Sub-Modal / Banner */}
      {confirmDev && (
        <div
          className="p-3 mb-4 rounded-3 border border-primary animate__animated animate__fadeIn"
          style={{ backgroundColor: 'var(--primary-subtle)' }}
        >
          <div className="d-flex align-items-start gap-3">
            <i className="bi bi-info-circle-fill fs-4 text-primary"></i>
            <div className="flex-grow-1">
              <h6 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                Confirm Resource Assignment
              </h6>
              <p className="mb-2 text-secondary" style={{ fontSize: '0.84rem' }}>
                Assign <strong>{confirmDev.developer.name}</strong> to task{' '}
                <strong>"{task.title}"</strong>? Skill Match:{' '}
                <strong className="text-primary">{confirmDev.matchPercentage}%</strong>.
              </p>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn-saas-primary btn-sm"
                  disabled={!!assigningId}
                  onClick={handleConfirmAssignment}
                >
                  {assigningId ? 'Assigning...' : 'Confirm Assignment'}
                </button>
                <button
                  type="button"
                  className="btn-saas-secondary btn-sm"
                  onClick={() => setConfirmDev(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations List */}
      <div>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h6 className="saas-card-title mb-0">Recommended Developers</h6>
          <span className="text-secondary" style={{ fontSize: '0.76rem' }}>
            Ranked by Skill Match % & Availability
          </span>
        </div>

        {loading ? (
          <LoadingSkeleton count={3} height="80px" />
        ) : recommendations.length === 0 ? (
          <EmptyState
            icon="bi-people"
            title="No Developers Available"
            description="There are currently no active developer profiles in the system."
          />
        ) : (
          recommendations.map((rec) => {
            const dev = rec.developer;
            const isAssigned = rec.isCurrentlyAssigned;

            return (
              <div key={dev._id} className="recommendation-card">
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
                  {/* Developer Info */}
                  <div className="d-flex align-items-center gap-3">
                    <Avatar name={dev.name} size="lg" />
                    <div>
                      <div className="d-flex align-items-center gap-2">
                        <h6 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>
                          {dev.name}
                        </h6>
                        {isAssigned && (
                          <span className="badge bg-primary text-white" style={{ fontSize: '0.7rem' }}>
                            Assigned
                          </span>
                        )}
                      </div>
                      <div className="text-secondary" style={{ fontSize: '0.8rem' }}>
                        {dev.designation} • {dev.department}
                      </div>
                      <div className="mt-1">
                        <AvailabilityBadge availability={dev.availability} />
                        <span className="text-muted ms-2" style={{ fontSize: '0.76rem' }}>
                          Exp: {dev.experience} yr{dev.experience > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Match Percentage & Action */}
                  <div className="text-sm-end w-100 w-sm-auto d-flex flex-sm-column justify-content-between align-items-end gap-2">
                    <div className="d-flex align-items-center gap-2">
                      <span
                        className={`match-percentage-badge ${
                          rec.matchPercentage >= 90
                            ? 'bg-success-subtle text-success'
                            : rec.matchPercentage >= 70
                            ? 'bg-primary-subtle text-primary'
                            : rec.matchPercentage >= 50
                            ? 'bg-warning-subtle text-warning'
                            : 'bg-danger-subtle text-danger'
                        }`}
                      >
                        {rec.matchPercentage}%
                      </span>
                    </div>
                    <span className="text-secondary d-none d-sm-block" style={{ fontSize: '0.72rem' }}>
                      {rec.matchTier}
                    </span>

                    {!isAssigned ? (
                      <button
                        type="button"
                        className="btn-saas-primary btn-sm mt-1"
                        onClick={() => handleAssignClick(rec)}
                      >
                        <i className="bi bi-person-check-fill"></i> Assign Developer
                      </button>
                    ) : (
                      <button type="button" className="btn-saas-secondary btn-sm mt-1" disabled>
                        <i className="bi bi-check2"></i> Currently Assigned
                      </button>
                    )}
                  </div>
                </div>

                {/* Skill Match Breakdown */}
                <div
                  className="mt-3 pt-3 border-top"
                  style={{ borderColor: 'var(--border-subtle)' }}
                >
                  <div className="d-flex flex-wrap gap-2 align-items-center">
                    {/* Matched Skills */}
                    {rec.matchedSkills.map((sk) => (
                      <SkillBadge
                        key={sk._id || sk.name}
                        name={sk.name}
                        proficiency={sk.proficiency}
                        isMatched={true}
                      />
                    ))}

                    {/* Missing Skills */}
                    {rec.missingSkills.map((sk) => (
                      <SkillBadge
                        key={sk._id || sk.name}
                        name={sk.name}
                        isMissing={true}
                      />
                    ))}

                    {rec.matchedSkills.length === 0 && rec.missingSkills.length === 0 && (
                      <span className="text-muted" style={{ fontSize: '0.76rem' }}>
                        All developers are eligible
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Modal>
  );
};

export default MatchModal;
