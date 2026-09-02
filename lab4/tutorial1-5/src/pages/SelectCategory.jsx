import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const genres = [
  { id: 'Action', color: '#FF5209' },
  { id: 'Drama', color: '#D7A4FF' },
  { id: 'Romance', color: '#148A08' },
  { id: 'Thriller', color: '#84C2FF' },
  { id: 'Western', color: '#902500' },
  { id: 'Horror', color: '#7358FF' },
  { id: 'Fantasy', color: '#FF4ADE' },
  { id: 'Music', color: '#E61E32' },
  { id: 'Fiction', color: '#6BD9E4' }
];

const SelectCategory = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('superAppCategories');
    if (saved) {
      setSelected(JSON.parse(saved));
    }
  }, []);

  const toggleGenre = (genreId) => {
    let newSelected;
    if (selected.includes(genreId)) {
      newSelected = selected.filter(g => g !== genreId);
    } else {
      newSelected = [...selected, genreId];
    }
    setSelected(newSelected);
    if (newSelected.length >= 3) {
      setError(false);
    }
  };

  const handleNext = () => {
    if (selected.length < 3) {
      setError(true);
      return;
    }
    localStorage.setItem('superAppCategories', JSON.stringify(selected));
    navigate('/superapp/home');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', padding: '3rem', boxSizing: 'border-box' }}>
      {/* Left Pane */}
      <div style={{ flex: 1, paddingRight: '2rem', display: 'flex', flexDirection: 'column' }}>
        <h1 style={{ fontFamily: 'var(--font-styled)', fontSize: '3rem', color: '#14C38E', marginBottom: '1.5rem', marginTop: '3rem' }}>
          Super App
        </h1>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '2rem', lineHeight: 1.2 }}>
          Choose your<br/>entertainment<br/>category
        </h2>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2rem' }}>
          {selected.map(genre => (
            <div key={genre} style={{
              backgroundColor: '#14C38E',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem'
            }}>
              {genre}
              <button 
                onClick={() => toggleGenre(genre)}
                style={{
                  background: 'transparent', border: 'none', color: '#093B29', 
                  cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center'
                }}
              >
                X
              </button>
            </div>
          ))}
        </div>
        
        {error && (
          <div style={{ color: '#FF4B4B', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 'auto' }}>
            <span style={{ fontSize: '1.2rem' }}>⚠️</span> Minimum 3 category required
          </div>
        )}
      </div>

      {/* Right Pane */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          flex: 1
        }}>
          {genres.map(genre => {
            const isSelected = selected.includes(genre.id);
            return (
              <div 
                key={genre.id}
                onClick={() => toggleGenre(genre.id)}
                style={{
                  backgroundColor: genre.color,
                  borderRadius: '12px',
                  padding: '1rem',
                  cursor: 'pointer',
                  position: 'relative',
                  border: isSelected ? '4px solid #14C38E' : '4px solid transparent',
                  boxSizing: 'border-box',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <h3 style={{ margin: 0, color: 'white', fontSize: '1.2rem', marginBottom: 'auto' }}>{genre.id}</h3>
              </div>
            );
          })}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
          <Button 
            onClick={handleNext} 
            style={{ backgroundColor: '#14C38E', color: 'white', borderRadius: '24px', padding: '0.75rem 2rem' }}
          >
            Next Page
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectCategory;
