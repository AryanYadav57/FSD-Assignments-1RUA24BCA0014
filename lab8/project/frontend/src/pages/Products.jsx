import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:5000/api/products');
                setProducts(response.data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch products. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading products...</div>;
    
    if (error) return <div className="error-message" style={{ margin: '2rem auto', maxWidth: '600px', textAlign: 'center' }}>{error}</div>;

    return (
        <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Our Products</h2>
            <div className="products-grid">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default Products;
