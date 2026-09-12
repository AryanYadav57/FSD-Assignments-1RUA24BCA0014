import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, ArrowLeft } from 'lucide-react';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:5000/api/products/${id}`);
                setProduct(response.data);
                setError(null);
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    setError('Product does not exist.');
                } else {
                    setError('Failed to fetch product details.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading details...</div>;
    if (error) return <div className="error-message" style={{ margin: '2rem auto', maxWidth: '600px', textAlign: 'center' }}>{error}</div>;
    if (!product) return null;

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <button 
                onClick={() => navigate('/products')} 
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}
            >
                <ArrowLeft size={20} /> Back to Products
            </button>
            
            <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', padding: '2rem', border: 'none' }}>
                <div className="image-container" style={{ height: '400px', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                    <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.875rem' }}>{product.category}</p>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.2, color: 'var(--text-main)' }}>{product.name}</h2>
                    <p style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '1.5rem' }}>${product.price.toFixed(2)}</p>
                    
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem', flexGrow: 1 }}>{product.description}</p>
                    
                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <span style={{ fontWeight: 500 }}>Availability:</span>
                            <span style={{ color: product.stock > 0 ? 'var(--secondary)' : 'var(--danger)', fontWeight: 600, fontSize: '0.875rem', letterSpacing: '0.05em' }}>
                                {product.stock > 0 ? `${product.stock} IN STOCK` : 'OUT OF STOCK'}
                            </span>
                        </div>
                        
                        <button 
                            className="btn" 
                            style={{ width: '100%', padding: '1rem', fontSize: '1.125rem' }}
                            onClick={() => addToCart(product)}
                            disabled={product.stock === 0}
                        >
                            <ShoppingCart size={20} /> {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
