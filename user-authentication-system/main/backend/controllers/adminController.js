const User = require('../models/User');

/**
 * @desc    Get all users (Admin only)
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    const totalCount = users.length;
    const studentCount = users.filter((u) => u.role === 'student').length;
    const adminCount = users.filter((u) => u.role === 'admin').length;

    return res.status(200).json({
      success: true,
      meta: {
        totalUsers: totalCount,
        studentCount,
        adminCount,
      },
      users,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve user directory.',
      error: err.message,
    });
  }
};

module.exports = {
  getAllUsers,
};
