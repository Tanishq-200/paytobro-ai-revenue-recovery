import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showDescriptor?: boolean;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showDescriptor = true, onClick }) => {
  const iconSizes = {
    sm: 24,
    md: 32,
    lg: 44,
  };

  const textSizes = {
    sm: '15px',
    md: '18px',
    lg: '24px',
  };

  const iconDim = iconSizes[size];

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: size === 'lg' ? '12px' : '10px',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          width: iconDim,
          height: iconDim,
          minWidth: iconDim,
          borderRadius: size === 'lg' ? '10px' : '8px',
          background: 'linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)',
          border: '1px solid #312E81',
          boxShadow: '0 0 14px rgba(79, 70, 229, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Custom Payment Recovery Mark: Payment curve + Forward Recovery Arrow */}
        <svg
          width={iconDim * 0.65}
          height={iconDim * 0.65}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Recovery Loop Segment */}
          <path
            d="M4 12C4 7.58172 7.58172 4 12 4C15.1944 4 17.9463 5.87354 19.2222 8.5"
            stroke="#6366F1"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Forward Action Chevron */}
          <path
            d="M20 12C20 16.4183 16.4183 20 12 20C8.80556 20 6.05373 18.1265 4.77778 15.5"
            stroke="#10B981"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Central Forward Momentum Arrow */}
          <path
            d="M10 8L15 12L10 16"
            stroke="#F8FAFC"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
        <div
          style={{
            fontSize: textSizes[size],
            fontWeight: 700,
            color: '#F8FAFC',
            letterSpacing: '-0.03em',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          Pay<span style={{ color: '#6366F1' }}>To</span>Bro
        </div>
        {showDescriptor && (
          <span
            style={{
              fontSize: size === 'lg' ? '11px' : '10px',
              color: '#818CF8',
              fontWeight: 500,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginTop: '2px',
            }}
          >
            AI Revenue Recovery
          </span>
        )}
      </div>
    </div>
  );
};
