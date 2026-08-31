import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, subtitle, children, footer, maxWidth = '620px' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="saas-modal-backdrop" onClick={onClose}>
      <div
        className="saas-modal-content"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="saas-modal-header">
          <div>
            <h5 className="saas-card-title mb-0">{title}</h5>
            {subtitle && <p className="text-secondary mb-0 mt-1" style={{ fontSize: '0.8rem' }}>{subtitle}</p>}
          </div>
          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            aria-label="Close modal"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="saas-modal-body">{children}</div>

        {footer && <div className="saas-modal-footer">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
