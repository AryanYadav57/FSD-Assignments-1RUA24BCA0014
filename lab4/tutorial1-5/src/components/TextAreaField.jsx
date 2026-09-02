import React from 'react';

const TextAreaField = ({ label, name, value, placeholder, error, onChange, onBlur, rows = 4 }) => {
  const containerStyle = {
    marginBottom: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.375rem',
    width: '100%'
  };

  const labelStyle = {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: 'var(--text-primary)'
  };

  const textareaStyle = {
    padding: '0.625rem 0.875rem',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'var(--bg-tertiary)',
    border: error ? '1px solid var(--danger)' : '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'var(--transition)',
    resize: 'vertical'
  };

  const errorStyle = {
    fontSize: '0.75rem',
    color: 'var(--danger)',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem'
  };

  return (
    <div style={containerStyle}>
      {label && <label htmlFor={name} style={labelStyle}>{label}</label>}
      <textarea
        id={name}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        rows={rows}
        style={textareaStyle}
      />
      {error && <span style={errorStyle}>⚠️ {error}</span>}
    </div>
  );
};

export default TextAreaField;
