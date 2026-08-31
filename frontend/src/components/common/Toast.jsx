import React from 'react';

const Toast = ({ toasts = [], removeToast }) => {
  if (!toasts.length) return null;

  return (
    <div className="saas-toast-container">
      {toasts.map((toast) => {
        let icon = 'bi-check-circle-fill text-success';
        if (toast.type === 'error') icon = 'bi-exclamation-octagon-fill text-danger';
        if (toast.type === 'warning') icon = 'bi-exclamation-triangle-fill text-warning';
        if (toast.type === 'info') icon = 'bi-info-circle-fill text-primary';

        return (
          <div key={toast.id} className="saas-toast" role="alert">
            <i className={`bi ${icon} fs-5`}></i>
            <div className="flex-grow-1" style={{ fontSize: '0.86rem' }}>
              {toast.message}
            </div>
            <button
              type="button"
              className="btn-icon"
              style={{ width: '24px', height: '24px', border: 'none', background: 'transparent' }}
              onClick={() => removeToast(toast.id)}
            >
              <i className="bi bi-x"></i>
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
