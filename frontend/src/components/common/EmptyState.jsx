import React from 'react';

const EmptyState = ({
  icon = 'bi-inbox',
  title = 'No items found',
  description = 'There are no records to display at this time.',
  actionText,
  onAction,
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <i className={`bi ${icon}`}></i>
      </div>
      <h6 className="fw-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h6>
      <p className="text-secondary mb-3" style={{ fontSize: '0.85rem', maxWidth: '400px', margin: '0 auto' }}>
        {description}
      </p>
      {actionText && onAction && (
        <button type="button" className="btn-saas-primary btn-sm" onClick={onAction}>
          <i className="bi bi-plus-lg"></i> {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
