import React from 'react';

const NewsWidget = () => {
  return (
    <div style={{ flex: 1, backgroundColor: 'white', borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <img 
        src="https://images.unsplash.com/photo-1495020689067-958852a7765e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
        alt="News"
        style={{ width: '100%', height: '50%', objectFit: 'cover' }}
      />
      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', color: 'black' }}>
        <h2 style={{ fontSize: '1.5rem', margin: '0 0 1rem 0' }}>
          Want to climb Mount Everest?
        </h2>
        <p style={{ margin: 0, opacity: 0.8, lineHeight: 1.5, fontSize: '0.9rem' }}>
          In the years since human beings first reached the summit of Mount Everest in 1953, climbing the world’s highest mountain has changed dramatically. Today, hundreds of mountaineers manage the feat each year thanks to improvements in knowledge, technology, and the significant infrastructure provided by commercially guided expeditions that provide a veritable highway up the mountain for those willing to accept both the risks and a substantial price tag.
        </p>
      </div>
    </div>
  );
};

export default NewsWidget;
