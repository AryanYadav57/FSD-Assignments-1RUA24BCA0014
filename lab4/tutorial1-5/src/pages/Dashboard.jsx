import React, { useState, useEffect } from 'react';

import Button from '../components/Button';
import PracticalSummary from '../sections/PracticalSummary';

const Dashboard = ({ onNavigate }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate streaming/skeleton loading state (Vercel style)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const cards = [
    {
      id: 'http-explorer',
      num: '01',
      title: 'HTTP Request–Response',
      desc: 'Trace HTTP requests and responses and inspect network information.',
      concepts: ['HTTP', 'Fetch API', 'Status Codes', 'Headers'],
      spanClass: 'span-2-col span-2-row' // Big featured card
    },
    {
      id: 'layout-lab',
      num: '02',
      title: 'HTML/CSS Layout',
      desc: 'Fix alignment, spacing, and responsiveness.',
      concepts: ['Flexbox', 'Grid', 'Responsive'],
      spanClass: 'span-2-col'
    },
    {
      id: 'javascript-lab',
      num: '03',
      title: 'JS Interactive Lab',
      desc: 'DOM manipulation, events, and dynamic updates.',
      concepts: ['DOM', 'Events', 'Validation'],
      spanClass: 'span-2-col'
    },
    {
      id: 'react-components',
      num: '04',
      title: 'React Components Lab',
      desc: 'Analyze a UI and break it into reusable components with props and state.',
      concepts: ['React', 'Props', 'State', 'Reusability'],
      spanClass: 'span-2-col' 
    },
    {
      id: 'react-state-lab',
      num: '05',
      title: 'React State Interactions',
      desc: 'Implement and trace React state updates and component interactions in an E-Commerce cart scenario.',
      concepts: ['State', 'Props', 'Data Flow'],
      spanClass: 'span-2-col' 
    },
    {
      id: 'superapp',
      num: '06',
      title: 'Capstone: Super App',
      desc: 'An integrated multi-page React application using react-router-dom, localStorage persistence, and external APIs.',
      concepts: ['React Router', 'Local Storage', 'APIs'],
      spanClass: 'span-full' 
    },
  ];

  if (isLoading) {
    return (
      <div className="fade-in">
        <div className="skeleton skeleton-box" style={{ height: '200px', marginBottom: '2rem' }}></div>
        <div className="skeleton skeleton-title" style={{ width: '200px', height: '24px' }}></div>
        <div className="bento-grid">
          <div className="bento-card span-2-col span-2-row">
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-box" style={{ height: '60px', marginTop: 'auto' }}></div>
          </div>
          <div className="bento-card span-2-col">
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-text"></div>
          </div>
          <div className="bento-card span-2-col">
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-text"></div>
          </div>
          <div className="bento-card span-full">
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-text"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ animation: 'slideDown 0.4s ease-out' }}>
      <div style={{
        padding: '3rem 2.5rem',
        background: 'linear-gradient(135deg, rgba(0, 112, 243, 0.05) 0%, rgba(121, 40, 202, 0.05) 100%)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '3rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        boxShadow: 'var(--ambient-shadow)'
      }}>
        <div className="badge" style={{ alignSelf: 'flex-start' }}>BCA Practical Lab</div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: 0 }}>Web Development Lab</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: 0 }}>
          Interactive academic demonstration platform covering core client-server communications, design alignment, and modern React component decomposition.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Syllabus Modules</h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>5 Modules Available</span>
      </div>

      <div className="bento-grid">
        {cards.map((card) => (
          <div key={card.id} className={`bento-card ${card.spanClass}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{card.num}. {card.title}</h3>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', flex: 1 }}>
              {card.desc}
            </p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
              {card.concepts.map(c => (
                <span key={c} className="badge">{c}</span>
              ))}
            </div>
            
            <div style={{ marginTop: 'auto' }}>
              <Button 
                variant="primary" 
                onClick={() => onNavigate(card.id)}
                style={{ width: '100%' }}
              >
                Open Tutorial →
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '4rem' }}>
        <PracticalSummary />
      </div>
    </div>
  );
};

export default Dashboard;
