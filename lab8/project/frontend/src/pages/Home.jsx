import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Shield, Zap, Headphones } from 'lucide-react';

const Home = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div style={{ overflow: 'hidden' }}>
            {/* Hero Section */}
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                minHeight: '80vh',
                position: 'relative',
                textAlign: 'center',
                padding: '4rem 1rem'
            }}>
                {/* Background glow effects */}
                <div style={{
                    position: 'absolute',
                    top: '20%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '60vw',
                    height: '60vw',
                    background: 'radial-gradient(circle, rgba(203,166,247,0.15) 0%, rgba(17,17,27,0) 70%)',
                    zIndex: -1,
                    filter: 'blur(60px)'
                }}></div>

                <div style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                    transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
                    maxWidth: '800px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <div style={{ 
                        display: 'inline-block',
                        padding: '0.5rem 1rem', 
                        background: 'rgba(203,166,247,0.1)', 
                        color: 'var(--primary)', 
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        marginBottom: '2rem',
                        border: '1px solid rgba(203,166,247,0.2)'
                    }}>
                        ✨ Redefining Premium Tech
                    </div>
                    
                    <h1 style={{ 
                        fontSize: '4.5rem', 
                        fontWeight: 800, 
                        marginBottom: '1.5rem', 
                        color: 'var(--text-main)',
                        lineHeight: 1.1,
                        letterSpacing: '-0.03em'
                    }}>
                        Elevate Your <span style={{ color: 'var(--primary)' }}>Digital</span> Experience
                    </h1>
                    
                    <p style={{ 
                        fontSize: '1.25rem', 
                        color: 'var(--text-muted)', 
                        marginBottom: '3rem', 
                        maxWidth: '600px',
                        lineHeight: 1.6
                    }}>
                        Discover our curated collection of high-end electronics, accessories, and gear designed for the modern professional.
                    </p>
                    
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Link to="/products" className="btn" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
                            Explore Collection <ChevronRight size={20} />
                        </Link>
                        <Link to="/products" className="btn-secondary btn" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
                            View Offers
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                gap: '2rem',
                padding: '4rem 0',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'opacity 0.8s ease-out 0.3s, transform 0.8s ease-out 0.3s',
            }}>
                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2.5rem 1.5rem', background: 'var(--surface-hover)', border: 'none' }}>
                    <div style={{ padding: '1rem', background: 'rgba(203,166,247,0.1)', borderRadius: '50%', color: 'var(--primary)', marginBottom: '1.5rem' }}>
                        <Shield size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>Premium Warranty</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Every product comes with our comprehensive 2-year guarantee for complete peace of mind.</p>
                </div>

                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2.5rem 1.5rem', background: 'var(--surface-hover)', border: 'none' }}>
                    <div style={{ padding: '1rem', background: 'rgba(166,227,161,0.1)', borderRadius: '50%', color: 'var(--secondary)', marginBottom: '1.5rem' }}>
                        <Zap size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>Express Delivery</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Get your gear faster with our complimentary next-day shipping on all premium orders.</p>
                </div>

                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2.5rem 1.5rem', background: 'var(--surface-hover)', border: 'none' }}>
                    <div style={{ padding: '1rem', background: 'rgba(243,139,168,0.1)', borderRadius: '50%', color: 'var(--danger)', marginBottom: '1.5rem' }}>
                        <Headphones size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>Expert Support</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Our team of tech enthusiasts is available 24/7 to help you get the most out of your purchase.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
