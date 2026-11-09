const User = require('../models/User');

/**
 * Auto-seed initial test accounts for lab demonstration and grading
 */
const seedDemoAccounts = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Seed] Seeding initial test accounts for lab grading...');

      await User.create([
        {
          name: 'Alice Student',
          email: 'alice@college.edu',
          password: 'Password123!',
          role: 'student',
        },
        {
          name: 'Bob Admin',
          email: 'admin@college.edu',
          password: 'AdminMasterKey999!',
          role: 'admin',
        },
      ]);

      console.log('[Seed] ✓ Created student: alice@college.edu (Password: Password123!)');
      console.log('[Seed] ✓ Created admin: admin@college.edu (Password: AdminMasterKey999!)');
    }
  } catch (err) {
    console.warn('[Seed] Notice: Could not seed test accounts:', err.message);
  }
};

module.exports = { seedDemoAccounts };
