import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Container, Form, InputGroup, Modal, Navbar, Row, Spinner } from 'react-bootstrap';

const categories = ['All', 'Home', 'Stationery', 'Accessories'];

function App() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadProducts = () => {
    setLoading(true);
    setError('');
    fetch('http://localhost:5000/api/products')
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load the collection.');
        return response.json();
      })
      .then(setProducts)
      .catch(() => {
        setProducts([]);
        setError('The collection could not be loaded. Check that the Express server is running on port 5000, then try again.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (!notice) return undefined;
    const timeout = window.setTimeout(() => setNotice(''), 3200);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const filteredProducts = useMemo(() => products.filter((product) => {
    const categoryMatches = activeCategory === 'All' || product.category === activeCategory;
    const searchMatches = product.name.toLowerCase().includes(query.toLowerCase());
    return categoryMatches && searchMatches;
  }), [products, activeCategory, query]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const addToCart = (product) => {
    setCart((items) => {
    const current = items.find((item) => item.id === product.id);
    return current ? items.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...items, { ...product, quantity: 1 }];
    });
    setNotice(`${product.name} was added to your bag.`);
  };
  const changeQuantity = (id, adjustment) => setCart((items) => items.flatMap((item) => {
    if (item.id !== id) return [item];
    const quantity = item.quantity + adjustment;
    return quantity > 0 ? [{ ...item, quantity }] : [];
  }));

  return <>
    <a className="skip-link" href="#shop">Skip to products</a>
    <div className="announcement">Complimentary shipping on orders over $50 <span>•</span> Made for unhurried days</div>
    <Navbar expand="lg" className="site-nav" sticky="top">
      <Container>
        <Navbar.Brand href="#top" className="brand">PAPER <i>&</i> CO.</Navbar.Brand>
        <Navbar.Toggle aria-controls="store-navigation" />
        <Navbar.Collapse id="store-navigation">
          <div className="nav-links mx-auto">
            <a href="#shop">Shop</a><a href="#story">Our story</a><a href="#journal">Journal</a>
          </div>
          <Button variant="link" className="cart-button" onClick={() => setShowCart(true)} aria-label={`Open cart with ${cartCount} items`}>
            Bag <span>{cartCount}</span>
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    <main id="top">
      <section className="hero">
        <Container><Row className="align-items-end g-5">
          <Col lg={6}><p className="eyebrow">Objects for everyday rituals</p><h1>Make room for <em>the good things.</em></h1><p className="hero-copy">Thoughtful pieces for the desk, the table, and every quiet moment in between.</p><div className="hero-details" aria-label="Store values"><span>Small-batch finds</span><span>Made to last</span><span>Considered materials</span></div><Button href="#shop" className="primary-cta">Shop the collection <span aria-hidden="true">→</span></Button></Col>
          <Col lg={6}><div className="hero-image"><img src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=85" alt="A calm and beautifully arranged living space" /><div className="image-note">Made to be used<br />and loved daily.</div></div></Col>
        </Row></Container>
      </section>

      <section id="shop" className="shop-section"><Container>
        <div className="section-heading"><div><p className="eyebrow">The collection</p><h2>Small things, <em>well chosen.</em></h2></div><p>Useful, beautiful pieces that make the everyday feel a little more considered.</p></div>
        <div className="toolbar"><div className="category-buttons" aria-label="Product categories">{categories.map((category) => <Button key={category} onClick={() => setActiveCategory(category)} aria-pressed={activeCategory === category} className={activeCategory === category ? 'category active' : 'category'}>{category}</Button>)}</div><InputGroup className="search-box"><Form.Control aria-label="Search products" placeholder="Search the collection" value={query} onChange={(event) => setQuery(event.target.value)} /><InputGroup.Text aria-hidden="true">⌕</InputGroup.Text></InputGroup></div>
        {!loading && !error && <p className="results-count" aria-live="polite">{filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'} selected for you</p>}
        {loading ? <div className="loading"><Spinner animation="border" /> Loading the collection…</div> : error ? <Alert className="collection-error" variant="light"><strong>We couldn’t reach the collection.</strong><span>{error}</span><Button onClick={loadProducts}>Try again</Button></Alert> : <Row className="g-4">{filteredProducts.map((product) => <Col sm={6} lg={4} key={product.id}><Card className="product-card"><div className="product-image"><Card.Img variant="top" src={product.image} alt={product.name} loading="lazy" /><Badge>{product.tag}</Badge><Button className="quick-add" onClick={() => addToCart(product)} aria-label={`Add ${product.name} to bag`}>Add to bag</Button></div><Card.Body><div className="product-meta"><span>{product.category}</span><span>{product.color}</span></div><div className="product-name"><Card.Title>{product.name}</Card.Title><strong>${product.price}</strong></div></Card.Body></Card></Col>)}</Row>}
        {!loading && filteredProducts.length === 0 && <div className="empty-state">No pieces match that search. Try a different word.</div>}
      </Container></section>

      <section id="story" className="story-section"><Container><Row className="align-items-center g-5"><Col md={6}><img src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1100&q=85" alt="Ceramic objects on a warm wood table" /></Col><Col md={5} className="ms-auto"><p className="eyebrow">The Paper & Co. way</p><h2>Less noise.<br /><em>More meaning.</em></h2><p>We choose pieces with an honest purpose: to make daily life feel more personal, practical, and calm.</p><a className="text-link" href="#journal">Read our story <span>→</span></a></Col></Row></Container></section>
    </main>

    <footer id="journal"><Container><Row className="gy-4 align-items-end"><Col md={7}><div className="footer-brand">PAPER <i>&</i> CO.</div><p>Everyday objects for unhurried homes.</p></Col><Col md={5}><div className="footer-links"><a href="#shop">Shop</a><a href="#story">Our story</a><a href="#top">Back to top ↑</a></div></Col></Row><small>© 2026 Paper & Co. Student e-commerce demo.</small></Container></footer>
    {notice && <div className="cart-notice" role="status">{notice}<Button variant="link" onClick={() => setShowCart(true)}>View bag</Button></div>}
    <Modal show={showCart} onHide={() => setShowCart(false)} centered><Modal.Header closeButton><Modal.Title>Your bag ({cartCount})</Modal.Title></Modal.Header><Modal.Body>{cart.length === 0 ? <p className="mb-0">Your bag is ready for something special.</p> : cart.map((item) => <div className="cart-item" key={item.id}><img src={item.image} alt="" /><div className="flex-grow-1"><strong>{item.name}</strong><div>${item.price} each</div></div><div className="quantity"><Button onClick={() => changeQuantity(item.id, -1)} aria-label={`Remove one ${item.name}`}>−</Button><span>{item.quantity}</span><Button onClick={() => changeQuantity(item.id, 1)} aria-label={`Add one ${item.name}`}>+</Button></div></div>)}</Modal.Body>{cart.length > 0 && <Modal.Footer className="d-block"><div className="d-flex justify-content-between mb-3"><strong>Total</strong><strong>${cartTotal}</strong></div><Button className="checkout" onClick={() => { setShowCart(false); setNotice('Checkout is ready for a real payment flow. This demo keeps your bag saved.'); }}>Checkout (demo)</Button></Modal.Footer>}</Modal>
  </>;
}

export default App;
