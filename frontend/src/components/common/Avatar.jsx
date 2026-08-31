import React from 'react';

const COLORS = [
  { bg: '#EEF2FF', text: '#4F46E5' }, // Indigo
  { bg: '#ECFDF5', text: '#059669' }, // Emerald
  { bg: '#EFF6FF', text: '#2563EB' }, // Blue
  { bg: '#FAF5FF', text: '#9333EA' }, // Purple
  { bg: '#FFF7ED', text: '#EA580C' }, // Orange
  { bg: '#F0FDFA', text: '#0D9488' }, // Teal
  { bg: '#FDF2F8', text: '#DB2777' }, // Pink
];

const Avatar = ({ name = 'User', size = 'md', className = '' }) => {
  const getInitials = (str) => {
    if (!str) return 'U';
    const parts = str.trim().split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getHashColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % COLORS.length;
    return COLORS[index];
  };

  const colorPair = getHashColor(name);
  const sizeClass = size === 'lg' ? 'avatar-lg' : size === 'sm' ? 'avatar-sm' : '';

  return (
    <div
      className={`avatar-circle ${sizeClass} ${className}`}
      style={{
        backgroundColor: colorPair.bg,
        color: colorPair.text,
        border: `1px solid ${colorPair.text}33`,
      }}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
