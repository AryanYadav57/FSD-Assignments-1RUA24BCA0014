import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, User, LogOut } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cartCount } = useContext(CartContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <Link to="/" style={{ textDecoration: 'none' }}>
                <h1>TechStore</h1>
            </Link>
            <div className="nav-links">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/products" className="nav-link">Products</Link>
                
                <Link to="/cart" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <ShoppingCart size={20} />
                    {cartCount > 0 && <span style={{ background: 'var(--primary)', color: 'white', borderRadius: '50%', padding: '0.1rem 0.4rem', fontSize: '0.75rem' }}>{cartCount}</span>}
                </Link>

                {user ? (
                    <>
                        <Link to="/orders" className="nav-link">Orders</Link>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem', paddingLeft: '1rem', borderLeft: '1px solid var(--border)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                                <User size={18} />
                                {user.username}
                            </span>
                            <button onClick={handleLogout} className="logout-btn" title="Logout">
                                <LogOut size={18} />
                            </button>
                        </div>
                    </>
                ) : (
                    <Link to="/login" className="btn" style={{ marginLeft: '1rem' }}>Login</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
