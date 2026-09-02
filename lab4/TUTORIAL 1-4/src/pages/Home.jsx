import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WeatherWidget from '../components/WeatherWidget';
import NewsWidget from '../components/NewsWidget';
import NotesWidget from '../components/NotesWidget';
import TimerWidget from '../components/TimerWidget';

const Home = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('superAppUser');
    const storedCategories = localStorage.getItem('superAppCategories');
    
    if (!storedUser || !storedCategories) {
      navigate('/register');
      return;
    }
    
    setUserData(JSON.parse(storedUser));
    setCategories(JSON.parse(storedCategories));
  }, [navigate]);

  if (!userData) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', padding: '2rem', boxSizing: 'border-box' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Left Column (Profile, Weather, Timer) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ display: 'flex', gap: '2rem' }}>
            {/* User Profile Card */}
            <div style={{ 
              backgroundColor: '#5746EA', 
              borderRadius: '24px', 
              padding: '2rem',
              color: 'white',
              flex: 1,
              display: 'flex',
              gap: '2rem',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
            }}>
              <div style={{
                width: '120px',
                height: '180px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '4rem'
              }}>
                👤
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '1.2rem', opacity: 0.8 }}>{userData.name}</p>
                <p style={{ margin: '0.25rem 0', fontSize: '1.2rem', opacity: 0.8 }}>{userData.email}</p>
                <h2 style={{ margin: '0.5rem 0 1rem 0', fontSize: '2rem' }}>{userData.username}</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {categories.map(cat => (
                    <span key={cat} style={{ 
                      backgroundColor: '#9F94FF', 
                      color: 'white', 
                      padding: '0.25rem 1rem', 
                      borderRadius: '16px',
                      fontSize: '0.9rem'
                    }}>
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <WeatherWidget />
          </div>
          
          {/* Notes and Timer Row Placeholder */}
          <div style={{ display: 'flex', gap: '2rem', flex: 1 }}>
             <NotesWidget />
             <TimerWidget />
          </div>
          
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <NewsWidget />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              onClick={() => navigate('/superapp/browse')}
              style={{ backgroundColor: '#14C38E', color: 'white', borderRadius: '24px', padding: '1rem 2rem', border: 'none', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}
            >
              Browse
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
