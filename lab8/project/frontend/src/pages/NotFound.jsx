import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div style={{ textAlign: 'center', padding: '6rem 0' }}>
            <h1 style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '1rem' }}>404</h1>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Page Not Found</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>The page you are looking for doesn't exist or has been moved.</p>
            <Link to="/" className="btn">Back to Home</Link>
        </div>
    );
};

export default NotFound;
