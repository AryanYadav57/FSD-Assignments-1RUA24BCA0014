const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Apply both JWT authentication and admin role authorization
router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);

module.exports = router;
