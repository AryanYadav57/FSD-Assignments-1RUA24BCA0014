import React from 'react';

const EvidencePanel = ({ title = 'How to demonstrate this tutorial', steps = [] }) => {
  const panelStyle = {
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    border: '1px solid rgba(99, 102, 241, 0.25)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.25rem 1.5rem',
    marginTop: '2rem',
    boxShadow: 'var(--shadow-sm)'
  };

  const titleStyle = {
    color: '#a5b4fc',
    fontSize: '1rem',
    fontWeight: '600',
    marginBottom: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const listStyle = {
    paddingLeft: '1.25rem',
    color: 'var(--text-secondary)',
    fontSize: '0.875rem',
    lineHeight: '1.6'
  };

  return (
    <div style={panelStyle} className="evidence-panel">
      <div style={titleStyle}>
        <span>📘</span> {title}
      </div>
      <ol style={listStyle}>
        {steps.map((step, idx) => (
          <li key={idx} style={{ marginBottom: '0.5rem' }}>{step}</li>
        ))}
      </ol>
    </div>
  );
};

export default EvidencePanel;
