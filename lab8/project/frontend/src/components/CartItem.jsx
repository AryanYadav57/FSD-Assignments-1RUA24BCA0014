import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Minus, Plus, Trash2 } from 'lucide-react';

const CartItem = ({ item }) => {
    const { updateQuantity, removeFromCart } = useContext(CartContext);

    return (
        <div style={{ display: 'flex', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid var(--border)', gap: '1.5rem', transition: 'background-color 0.2s' }}>
            <div className="image-container" style={{ width: '80px', height: '80px', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
                <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            
            <div style={{ flexGrow: 1 }}>
                <h4 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{item.name}</h4>
                <p style={{ color: 'var(--text-muted)' }}>${item.price.toFixed(2)}</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '0.375rem', overflow: 'hidden' }}>
                    <button 
                        style={{ padding: '0.5rem', background: 'var(--surface)', border: 'none', borderRight: '1px solid var(--border)', cursor: 'pointer' }}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                    >
                        <Minus size={16} />
                    </button>
                    <span style={{ padding: '0 1rem', fontWeight: 500 }}>{item.quantity}</span>
                    <button 
                        style={{ padding: '0.5rem', background: 'var(--surface)', border: 'none', borderLeft: '1px solid var(--border)', cursor: 'pointer' }}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                    >
                        <Plus size={16} />
                    </button>
                </div>
                <div style={{ fontWeight: 700, width: '80px', textAlign: 'right' }}>
                    ${(item.price * item.quantity).toFixed(2)}
                </div>
                <button 
                    style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.5rem' }}
                    onClick={() => removeFromCart(item.id)}
                    title="Remove item"
                >
                    <Trash2 size={20} />
                </button>
            </div>
        </div>
    );
};

export default CartItem;
