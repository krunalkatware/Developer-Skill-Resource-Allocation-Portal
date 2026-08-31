import React from 'react';

const LoadingSkeleton = ({ count = 3, height = '48px', className = '' }) => {
  return (
    <div className={`d-flex flex-column gap-2 ${className}`}>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          style={{
            height,
            backgroundColor: 'var(--bg-secondary-surface)',
            borderRadius: 'var(--radius-md)',
            animation: 'pulse 1.5s infinite ease-in-out',
          }}
        ></div>
      ))}
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 0.3; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default LoadingSkeleton;
