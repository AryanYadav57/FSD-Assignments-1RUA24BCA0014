const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '../data/products.json');

// Helper to read products
const getProducts = () => {
    const data = fs.readFileSync(productsPath, 'utf8');
    return JSON.parse(data);
};

// In-memory orders and users (mock database)
const orders = [];
const users = []; // Format: { username, password, token }

// API: Login (Basic authentication)
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    // Generate a simple dummy token
    const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
    
    // Store user session
    users.push({ username, password, token });

    res.json({ token, username });
});

// Middleware to verify basic token for protected routes
const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1];
    const user = users.find(u => u.token === token);

    if (!user) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    req.user = user;
    next();
};

// API: Get all products
router.get('/products', (req, res) => {
    try {
        const products = getProducts();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve products' });
    }
});

// API: Get specific product by ID
router.get('/products/:id', (req, res) => {
    try {
        const products = getProducts();
        const product = products.find(p => p.id === req.params.id);
        
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve product details' });
    }
});

// API: Create an order (Protected)
router.post('/orders', authenticate, (req, res) => {
    const { items, total } = req.body; // items is array of { product, quantity }

    if (!items || items.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
    }

    // Optional: Validate stock and calculate total server-side for real security, 
    // but trusting frontend based on simple requirements.
    const products = getProducts();
    for (const item of items) {
        const product = products.find(p => p.id === item.id);
        if (!product) {
            return res.status(400).json({ error: `Product ${item.name} does not exist.` });
        }
        if (product.stock < item.quantity) {
            return res.status(400).json({ error: `Insufficient stock for ${item.name}` });
        }
    }

    // In a real app, we'd deduct stock here. 
    // For this simple mock, we just record the order.

    const order = {
        id: Date.now().toString(),
        username: req.user.username,
        items,
        total,
        date: new Date().toISOString()
    };

    orders.push(order);
    res.status(201).json({ message: 'Order placed successfully', order });
});

// API: Get orders (Protected)
router.get('/orders', authenticate, (req, res) => {
    const userOrders = orders.filter(o => o.username === req.user.username);
    res.json(userOrders);
});

module.exports = router;
