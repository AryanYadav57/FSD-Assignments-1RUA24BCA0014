import React from 'react';

const PracticalSummary = () => {
  const containerStyle = {
    marginTop: '3rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  };

  const sectionTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '0.75rem'
  };

  const techContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginTop: '0.5rem'
  };

  const tutorials = [
    { code: '01', title: 'HTTP Request–Response', desc: 'Flow visualizer & live fetch queries', status: '✓ Demonstrated' },
    { code: '02', title: 'HTML/CSS Layout', desc: 'Before/After layout mode playground', status: '✓ Demonstrated' },
    { code: '03', title: 'JavaScript', desc: 'Form validation, DOM triggers & previews', status: '✓ Demonstrated' },
    { code: '04', title: 'React Components', desc: 'Architecture decomposition tree details', status: '✓ Demonstrated' },
  ];

  const technologies = [
    'React', 'JavaScript', 'HTML', 'CSS', 'Flexbox', 'CSS Grid', 'Fetch API', 'Responsive Design'
  ];

  return (
    <div style={containerStyle}>
      <h3 style={sectionTitleStyle}>Tutorial Coverage</h3>
      
      <div className="table-container">
        <table className="summary-table">
          <thead>
            <tr>
              <th style={{ width: '10%' }}>Ref</th>
              <th style={{ width: '35%' }}>Requirement Topic</th>
              <th style={{ width: '35%' }}>Implementation Scope</th>
              <th style={{ width: '20%', textAlign: 'right' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {tutorials.map((item) => (
              <tr key={item.code}>
                <td><strong style={{ color: 'var(--primary)' }}>{item.code}</strong></td>
                <td style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{item.title}</td>
                <td>{item.desc}</td>
                <td style={{ textAlign: 'right' }}>
                  <span className="badge badge-success">{item.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: '600', marginBottom: '0.75rem' }}>
          Technologies Covered
        </h4>
        <div style={techContainerStyle}>
          {technologies.map((tech) => (
            <span 
              key={tech} 
              className="badge badge-primary"
              style={{
                fontSize: '0.8rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '50px'
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PracticalSummary;
