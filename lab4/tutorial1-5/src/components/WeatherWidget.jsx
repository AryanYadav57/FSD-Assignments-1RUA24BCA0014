import React, { useState, useEffect } from 'react';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => setTime(new Date()), 60000);
    
    // Fetch Weather (New Delhi coordinates)
    fetch('https://api.open-meteo.com/v1/forecast?latitude=28.6139&longitude=77.2090&current_weather=true')
      .then(res => res.json())
      .then(data => {
        setWeather(data.current_weather);
      })
      .catch(console.error);
      
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <div style={{ flex: 1, backgroundColor: '#101744', borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        backgroundColor: '#FF4ADE', 
        padding: '1rem', 
        display: 'flex', 
        justifyContent: 'space-around',
        color: 'white',
        fontSize: '1.5rem',
        fontWeight: 'bold'
      }}>
        <span>{formatDate(time)}</span>
        <span>{formatTime(time)}</span>
      </div>
      <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', flex: 1, color: 'white' }}>
        {weather ? (
          <>
            <div style={{ fontSize: '3rem' }}>
              {weather.weathercode <= 3 ? '☀️' : weather.weathercode <= 67 ? '🌧️' : '❄️'}
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{weather.temperature}°C</div>
              <div style={{ fontSize: '1.2rem', opacity: 0.8 }}>Wind: {weather.windspeed} km/h</div>
            </div>
          </>
        ) : (
          <p>Loading weather...</p>
        )}
      </div>
    </div>
  );
};

export default WeatherWidget;
