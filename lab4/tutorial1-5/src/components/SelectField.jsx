import React from 'react';

const SelectField = ({ label, name, value, options = [], error, onChange, onBlur }) => {
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

  const selectStyle = {
    padding: '0.625rem 0.875rem',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'var(--bg-tertiary)',
    border: error ? '1px solid var(--danger)' : '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'var(--transition)',
    cursor: 'pointer'
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
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        style={selectStyle}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span style={errorStyle}>⚠️ {error}</span>}
    </div>
  );
};

export default SelectField;
