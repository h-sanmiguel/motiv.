import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = 'w-8 h-8' }) => {
  return (
    <svg
      viewBox="0 0 200 120"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <text
        x="20"
        y="90"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="80"
        fontWeight="700"
        fill="currentColor"
        letterSpacing="-2"
      >
        m
      </text>
      <circle cx="100" cy="85" r="6" fill="currentColor" />
    </svg>
  );
};
