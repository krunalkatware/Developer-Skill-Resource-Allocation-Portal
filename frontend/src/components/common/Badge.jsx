import React from 'react';

export const AvailabilityBadge = ({ availability = 'Available' }) => {
  let badgeClass = 'badge-available';
  let icon = 'bi-check-circle-fill';

  if (availability === 'Partially Allocated') {
    badgeClass = 'badge-partially';
    icon = 'bi-dash-circle-fill';
  } else if (availability === 'Fully Allocated') {
    badgeClass = 'badge-fully';
    icon = 'bi-x-circle-fill';
  }

  return (
    <span className={`saas-badge ${badgeClass}`}>
      <i className={`bi ${icon}`} style={{ fontSize: '0.75rem' }}></i>
      {availability}
    </span>
  );
};

export const PriorityBadge = ({ priority = 'Medium' }) => {
  let badgeClass = 'badge-priority-medium';

  if (priority === 'Urgent') badgeClass = 'badge-priority-urgent';
  else if (priority === 'High') badgeClass = 'badge-priority-high';
  else if (priority === 'Low') badgeClass = 'badge-priority-low';

  return <span className={`saas-badge ${badgeClass}`}>{priority}</span>;
};

export const StatusBadge = ({ status = 'To Do' }) => {
  let badgeClass = 'badge-status-todo';
  let dotColor = '#6B7280';

  if (status === 'Completed') {
    badgeClass = 'badge-status-completed';
    dotColor = '#10B981';
  } else if (status === 'In Progress') {
    badgeClass = 'badge-status-inprogress';
    dotColor = '#4F46E5';
  } else if (status === 'Planning') {
    badgeClass = 'badge-status-planning';
    dotColor = '#0EA5E9';
  } else if (status === 'On Hold') {
    badgeClass = 'badge-status-onhold';
    dotColor = '#F59E0B';
  }

  return (
    <span className={`saas-badge ${badgeClass}`}>
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: dotColor,
          display: 'inline-block',
        }}
      ></span>
      {status}
    </span>
  );
};

export const SkillBadge = ({ name, proficiency, isMatched, isMissing }) => {
  let extraClass = '';
  if (isMatched) extraClass = 'badge-skill-matched';
  if (isMissing) extraClass = 'badge-skill-missing';

  return (
    <span className={`badge-skill ${extraClass}`}>
      {isMatched && <i className="bi bi-check2 me-1 text-success fw-bold"></i>}
      {isMissing && <i className="bi bi-x me-1 text-danger fw-bold"></i>}
      {name}
      {proficiency && <span className="text-muted ms-1" style={{ fontSize: '0.7rem' }}>({proficiency})</span>}
    </span>
  );
};
