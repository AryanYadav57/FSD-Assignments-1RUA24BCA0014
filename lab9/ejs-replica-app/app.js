const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const users = require('./data/users');

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes

// 1. Home Route - Displays all profiles
app.get('/', (req, res) => {
    res.render('home', { users: users });
});

// 2. Profile Route - Dynamic routing based on username
app.get('/profile/:username', (req, res) => {
    const requestedUsername = req.params.username.toLowerCase();
    
    // Search for the requested username in the users array
    const user = users.find(u => u.username === requestedUsername);
    
    if (user) {
        // If user found, render the profile page with user's data
        res.render('profile', { user: user });
    } else {
        // If not found, render the notfound page
        res.status(404).render('notfound', { username: requestedUsername });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
