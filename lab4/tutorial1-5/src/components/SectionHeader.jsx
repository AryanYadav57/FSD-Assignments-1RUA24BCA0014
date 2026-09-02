import React from 'react';

const SectionHeader = ({ title, subtitle, badge }) => {
  const containerStyle = {
    marginBottom: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '1.25rem'
  };

  const topRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flexWrap: 'wrap'
  };

  const badgeStyle = {
    backgroundColor: 'var(--primary-glow)',
    color: 'var(--primary)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    borderRadius: '4px',
    padding: '0.2rem 0.6rem',
    fontSize: '0.75rem',
    fontWeight: '700',
    letterSpacing: '0.05em',
    textTransform: 'uppercase'
  };

  const titleStyle = {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    margin: 0,
    lineHeight: '1.2'
  };

  const subtitleStyle = {
    fontSize: '0.95rem',
    color: 'var(--text-secondary)',
    margin: 0
  };

  return (
    <div style={containerStyle}>
      <div style={topRowStyle}>
        {badge && <span style={badgeStyle}>{badge}</span>}
        <h2 style={titleStyle}>{title}</h2>
      </div>
      {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
    </div>
  );
};

export default SectionHeader;
