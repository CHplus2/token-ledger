import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 32, className = '' }) => (
  <div
    className={`rounded-full flex items-center justify-center shrink-0 ${className}`}
    style={{ width: size, height: size, backgroundColor: '#132043' }}
  >
    <svg width="70%" height="70%" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="80" cy="80" r="58" fill="none" stroke="#C9A227" strokeWidth="4" />
      <rect x="48" y="66" width="64" height="7" rx="3.5" fill="#FFFFFF" />
      <rect x="48" y="79" width="48" height="7" rx="3.5" fill="#C9A227" />
      <rect x="48" y="92" width="28" height="7" rx="3.5" fill="#FFFFFF" />
    </svg>
  </div>
);
