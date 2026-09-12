import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Package } from 'lucide-react';

const Orders = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:5000/api/orders', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setOrders(response.data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch orders.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, navigate]);

    if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading orders...</div>;
    if (error) return <div className="error-message" style={{ margin: '2rem auto', maxWidth: '600px', textAlign: 'center' }}>{error}</div>;

    if (orders.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <Package size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>No Orders Yet</h2>
                <p style={{ color: 'var(--text-muted)' }}>You haven't placed any orders.</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Your Orders</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {orders.reverse().map(order => (
                    <div key={order.id} className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                            <div>
                                <span style={{ fontWeight: 600, display: 'block' }}>Order #{order.id}</span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{new Date(order.date).toLocaleDateString()}</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.25rem' }}>${order.total.toFixed(2)}</span>
                            </div>
                        </div>
                        <div>
                            {order.items.map((item, index) => (
                                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', margin: '0.5rem 0', fontSize: '0.875rem' }}>
                                    <span>{item.quantity}x {item.name}</span>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;
