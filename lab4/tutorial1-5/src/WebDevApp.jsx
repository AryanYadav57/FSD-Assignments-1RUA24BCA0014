import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import HTTPExplorer from './pages/HTTPExplorer';
import LayoutLab from './pages/LayoutLab';
import JavaScriptLab from './pages/JavaScriptLab';
import ReactComponentLab from './pages/ReactComponentLab';
import ReactStateLab from './pages/ReactStateLab';

function WebDevApp() {
  const [activeSection, setActiveSection] = useState('home');
  const [isCmdKOpen, setIsCmdKOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Cmd+K Event Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCmdKOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsCmdKOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const menuItems = [
    { id: 'home', title: 'Home Dashboard' },
    { id: 'http-explorer', title: 'HTTP Request Explorer' },
    { id: 'layout-lab', title: 'Layout Lab (HTML/CSS)' },
    { id: 'javascript-lab', title: 'JavaScript Interactive Lab' },
    { id: 'react-components', title: 'React Component Lab' },
    { id: 'react-state-lab', title: 'React State Interactions' },
    { id: 'superapp', title: 'Capstone: Super App' },
  ];

  const filteredItems = menuItems.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNavigate = (id) => {
    if (id === 'superapp') {
      navigate('/superapp');
      return;
    }
    setActiveSection(id);
    setIsCmdKOpen(false);
    setSearchQuery('');
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'http-explorer':
        return <HTTPExplorer />;
      case 'layout-lab':
        return <LayoutLab />;
      case 'javascript-lab':
        return <JavaScriptLab />;
      case 'react-components':
        return <ReactComponentLab />;
      case 'react-state-lab':
        return <ReactStateLab />;
      case 'home':
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  const renderNavLink = (id, label) => {
    const isActive = activeSection === id;
    return (
      <button
        onClick={() => handleNavigate(id)}
        style={{
          background: 'none',
          border: 'none',
          color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
          fontSize: '0.9rem',
          fontWeight: isActive ? '600' : '500',
          cursor: 'pointer',
          padding: '0.5rem 0.75rem',
          backgroundColor: isActive ? 'rgba(0,0,0,0.03)' : 'transparent',
          borderRadius: 'var(--radius-sm)',
          transition: 'var(--transition)'
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <>
      <div className="aurora-bg"></div>
      
      {/* COMMAND PALETTE MODAL */}
      {isCmdKOpen && (
        <div className="cmdk-overlay" onClick={() => setIsCmdKOpen(false)}>
          <div className="cmdk-modal" onClick={e => e.stopPropagation()}>
            <div className="cmdk-input-wrapper">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                className="cmdk-input" 
                placeholder="Search labs and commands..." 
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', border: '1px solid var(--border-color)', padding: '2px 6px', borderRadius: '4px' }}>ESC</div>
            </div>
            <div className="cmdk-list">
              {filteredItems.length > 0 ? (
                filteredItems.map(item => (
                  <div 
                    key={item.id} 
                    className="cmdk-item"
                    onClick={() => handleNavigate(item.id)}
                  >
                    <span>{item.title}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </div>
                ))
              ) : (
                <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  No results found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="app-container">
        {/* HEADER / NAVIGATION */}
        <header style={{
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border-color)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '1rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            {/* Logo / Brand Name */}
            <div 
              onClick={() => handleNavigate('home')}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                cursor: 'pointer' 
              }}
            >
              <div style={{ 
                width: '32px', height: '32px', 
                background: 'linear-gradient(135deg, #0070F3, #F81CE5)', 
                borderRadius: '8px', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 'bold'
              }}>
                W
              </div>
              <div>
                <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '1.05rem', letterSpacing: '-0.02em' }}>
                  Web Dev Lab
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                  Press <kbd style={{ background: '#f0f0f0', border: '1px solid #ddd', padding: '1px 4px', borderRadius: '4px', fontSize: '10px' }}>⌘K</kbd> to search
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <nav style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              flexWrap: 'wrap'
            }}>
              {renderNavLink('home', 'Overview')}
              {renderNavLink('http-explorer', 'HTTP')}
              {renderNavLink('layout-lab', 'Layout')}
              {renderNavLink('javascript-lab', 'JavaScript')}
              {renderNavLink('react-components', 'React')}
              {renderNavLink('react-state-lab', 'State')}
            </nav>
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="main-content">
          {renderActiveSection()}
        </main>

        {/* FOOTER */}
        <footer style={{
          borderTop: '1px solid var(--border-color)',
          padding: '2rem 1.5rem',
          marginTop: 'auto',
          fontSize: '0.85rem',
          textAlign: 'center',
          color: 'var(--text-secondary)'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <strong>Web Development Lab</strong>
            </div>
            <div style={{ color: 'var(--text-muted)' }}>
              Built with React • HTML • CSS
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default WebDevApp;
