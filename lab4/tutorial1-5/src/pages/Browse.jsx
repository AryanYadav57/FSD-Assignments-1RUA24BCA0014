import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

// Mock data since no API key was provided
const MOCK_MOVIES = [
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1542204165-65bf26472b9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
];

const Browse = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('superAppCategories');
    if (saved) {
      setCategories(JSON.parse(saved));
    } else {
      navigate('/superapp/select-category');
    }
  }, [navigate]);

  return (
    <div style={{ minHeight: '100vh', width: '100vw', padding: '2rem', boxSizing: 'border-box' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '0 2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-styled)', fontSize: '2.5rem', color: '#14C38E', margin: 0 }}>
          Super App
        </h1>
        <Button 
          onClick={() => navigate('/superapp/home')}
          style={{ backgroundColor: '#5746EA', color: 'white', borderRadius: '24px', padding: '0.75rem 2rem' }}
        >
          Homepage
        </Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', padding: '0 2rem' }}>
        <p style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Entertainment according to your choices</p>
        
        {categories.map(category => (
          <div key={category}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#84C2FF' }}>{category}</h2>
            <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
              {/* Mock Movie Cards */}
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i} style={{ 
                  flexShrink: 0, 
                  width: '250px', 
                  height: '150px', 
                  borderRadius: '12px', 
                  overflow: 'hidden',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }}>
                  <img 
                    src={MOCK_MOVIES[i % MOCK_MOVIES.length]} 
                    alt="Movie cover" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default Browse;
