import React, { useState, useEffect } from 'react';

const NotesWidget = () => {
  const [note, setNote] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('superAppNotes');
    if (saved) {
      setNote(saved);
    }
  }, []);

  const handleChange = (e) => {
    setNote(e.target.value);
    localStorage.setItem('superAppNotes', e.target.value);
  };

  return (
    <div style={{ flex: 1, backgroundColor: '#F1C75B', borderRadius: '24px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem', color: 'black' }}>All notes</h2>
      <textarea
        value={note}
        onChange={handleChange}
        style={{
          flex: 1,
          backgroundColor: 'transparent',
          border: 'none',
          outline: 'none',
          resize: 'none',
          color: 'black',
          fontSize: '1rem',
          fontFamily: 'inherit',
          width: '100%'
        }}
        placeholder="Type your notes here..."
      />
    </div>
  );
};

export default NotesWidget;
