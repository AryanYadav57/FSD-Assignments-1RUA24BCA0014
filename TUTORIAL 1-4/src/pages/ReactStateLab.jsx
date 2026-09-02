import React, { useState } from 'react';

// --- CHILD COMPONENT ---
const ProductCard = ({ name, price, onAddToCart }) => {
  return (
    <div style={{
      border: '1px solid var(--border-color)',
      borderRadius: '8px',
      padding: '1.5rem',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <h3 style={{ margin: '0 0 0.5rem 0' }}>{name}</h3>
        <span style={{ color: 'var(--text-muted)' }}>${price}</span>
      </div>
      <button 
        onClick={() => onAddToCart(name, price)}
        style={{
          backgroundColor: '#0070F3',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Add to Cart
      </button>
    </div>
  );
};

// --- PARENT COMPONENT ---
const ReactStateLab = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  const handleAddToCart = (productName, productPrice) => {
    setCart((prevCart) => [...prevCart, productName]);
    setTotal((prevTotal) => prevTotal + productPrice);
    console.log(`State Update: Added ${productName}. New Total: $${total + productPrice}`);
  };

  const clearCart = () => {
    setCart([]);
    setTotal(0);
    console.log('State Update: Cart cleared.');
  };

  return (
    <div className="fade-in" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '3rem' }}>
        <div className="badge" style={{ marginBottom: '1rem' }}>Module 05</div>
        <h1 style={{ fontSize: '2.5rem', margin: '0 0 1rem 0' }}>React State & Component Interactions</h1>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
          <strong>Scenario:</strong> E-commerce Cart. This interactive lab demonstrates how a Parent component manages state (`cart` array, `total` price) and passes callback functions as props down to Child components (`ProductCard`). Clicking a Child button triggers a state update in the Parent.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Products (Children)</h2>
          <ProductCard name="Wireless Headphones" price={120} onAddToCart={handleAddToCart} />
          <ProductCard name="Mechanical Keyboard" price={85} onAddToCart={handleAddToCart} />
          <ProductCard name="USB-C Hub" price={45} onAddToCart={handleAddToCart} />
        </div>

        <div style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.2)', 
          borderRadius: '12px', 
          padding: '2rem',
          border: '1px solid var(--border-color)'
        }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#0070F3' }}>Your Cart (Parent State)</h2>
          
          <div style={{ margin: '1.5rem 0', fontSize: '1.1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Items in Cart:</span>
              <strong>{cart.length}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total Price:</span>
              <strong style={{ color: '#0070F3', fontSize: '1.2rem' }}>${total}</strong>
            </div>
          </div>

          <div style={{ minHeight: '150px', marginBottom: '2rem', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
            {cart.length > 0 ? (
              <ul style={{ paddingLeft: '1.5rem', margin: 0, color: 'var(--text-primary)' }}>
                {cart.map((item, index) => (
                  <li key={index} style={{ paddingBottom: '0.5rem' }}>{item}</li>
                ))}
              </ul>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', margin: 0, textAlign: 'center', paddingTop: '2rem' }}>
                Cart is currently empty.
              </p>
            )}
          </div>

          <button 
            onClick={clearCart}
            disabled={cart.length === 0}
            style={{
              width: '100%',
              padding: '0.85rem',
              backgroundColor: cart.length === 0 ? 'rgba(255,255,255,0.1)' : '#FF4B4B',
              color: cart.length === 0 ? 'var(--text-muted)' : 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
          >
            Clear Cart State
          </button>
        </div>

      </div>
    </div>
  );
};

export default ReactStateLab;
