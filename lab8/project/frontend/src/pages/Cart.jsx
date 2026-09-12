import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import CartItem from '../components/CartItem';
import { CreditCard } from 'lucide-react';

const Cart = () => {
    const { cart, cartTotal, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleCheckout = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (cart.length === 0) {
            setError('Your cart is empty.');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await axios.post(
                'http://localhost:5000/api/orders',
                { items: cart, total: cartTotal },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            
            setSuccess(response.data.message);
            clearCart();
            setTimeout(() => navigate('/orders'), 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Checkout failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0 && !success) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Your Cart is Empty</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Looks like you haven't added anything to your cart yet.</p>
                <button className="btn" onClick={() => navigate('/products')}>Start Shopping</button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Shopping Cart</h2>
            
            {error && <div className="error-message">{error}</div>}
            {success && <div style={{ color: 'var(--secondary)', backgroundColor: '#D1FAE5', padding: '1rem', borderRadius: '0.375rem', marginBottom: '1rem', fontWeight: 500 }}>{success} Redirecting to orders...</div>}

            {!success && (
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div>
                        {cart.map(item => (
                            <CartItem key={item.id} item={item} />
                        ))}
                    </div>
                    
                    <div style={{ padding: '2rem', background: 'var(--surface-hover)', borderTop: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: 500 }}>Total</span>
                            <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>${cartTotal.toFixed(2)}</span>
                        </div>
                        
                        <button 
                            className="btn" 
                            style={{ width: '100%', padding: '1rem', fontSize: '1.125rem', justifyContent: 'center' }}
                            onClick={handleCheckout}
                            disabled={loading || cart.length === 0}
                        >
                            <CreditCard size={20} />
                            {loading ? 'Processing...' : (user ? 'Proceed to Checkout' : 'Login to Checkout')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
