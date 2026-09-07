import React from 'react';

const Card = ({ children, className = '', title, subtitle, hoverable = false }) => {
  return (
    <div className={`card-base ${className}`}>
      {title && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em', margin: 0 }}>{title}</h3>
          {subtitle && <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem', margin: 0 }}>{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
