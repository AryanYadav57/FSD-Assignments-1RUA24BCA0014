import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { ShoppingCart } from 'lucide-react';

const ProductCard = ({ product }) => {
    const { addToCart } = useContext(CartContext);

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart(product);
    };

    return (
        <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                <div className="image-container" style={{ height: '220px', borderBottom: '1px solid var(--border)', borderRadius: '1rem 1rem 0 0' }}>
                    <img src={product.imageUrl} alt={product.name} />
                </div>
                <div style={{ padding: '1.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>{product.category}</p>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem', lineHeight: 1.3 }}>{product.name}</h3>
                    <p style={{ fontSize: '1.25rem', fontWeight: 500, color: 'var(--text-main)', marginTop: 'auto' }}>${product.price.toFixed(2)}</p>
                    
                    <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 500, color: product.stock > 0 ? 'var(--secondary)' : 'var(--danger)' }}>
                            {product.stock > 0 ? `${product.stock} IN STOCK` : 'OUT OF STOCK'}
                        </span>
                        <button 
                            className="btn" 
                            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                        >
                            <ShoppingCart size={16} /> Add
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
