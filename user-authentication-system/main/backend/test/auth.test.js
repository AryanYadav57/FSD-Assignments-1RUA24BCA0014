/**
 * Comprehensive TDD Verification Suite for User Authentication System
 * Tests:
 * 1. User Registration & Input Validation
 * 2. Bcrypt Password Encryption (verified directly in Mongo/storage)
 * 3. User Login & JWT Generation
 * 4. Protected Route Authorization (Bearer Token validation)
 * 5. Role-Based Access Control (RBAC: Student vs Admin on /api/admin/users)
 */

const assert = require('assert');
const http = require('http');
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const app = require('../server');

let server;
let baseUrl;

// Helper to make HTTP requests
const request = ({ method, path, headers = {}, body = null }) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let rawData = '';
      res.on('data', (chunk) => {
        rawData += chunk;
      });
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(rawData);
        } catch (e) {
          parsed = rawData;
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: parsed,
        });
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

async function runTestSuite() {
  console.log('\n========================================================');
  console.log('🧪 Starting Full-Stack Auth TDD Verification Suite');
  console.log('========================================================\n');

  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test_secret_for_verification_only_12345';

  await connectDB();
  await User.deleteMany({}); // Clean state

  // Start HTTP server on dynamic port
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      console.log(`[Test Runner] Test server listening on ${baseUrl}\n`);
      resolve();
    });
  });

  let testsPassed = 0;
  let testsFailed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      testsPassed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Error: ${err.message}\n`);
      testsFailed++;
    }
  }

  let studentToken = '';
  let adminToken = '';

  // --- 1. Registration Tests ---
  await test('1.1 Should register a student successfully with 201 Created and return JWT', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/auth/register',
      body: {
        name: 'Alice Student',
        email: 'alice@college.edu',
        password: 'Password123!',
        role: 'student',
      },
    });

    assert.strictEqual(res.status, 201, `Expected status 201, got ${res.status}`);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.token, 'Response should contain a JWT token');
    assert.strictEqual(res.body.user.email, 'alice@college.edu');
    assert.strictEqual(res.body.user.role, 'student');
    assert.strictEqual(res.body.user.password, undefined, 'Password must not be returned in response');
    studentToken = res.body.token;
  });

  await test('1.2 Should register an admin successfully with 201 Created', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/auth/register',
      body: {
        name: 'Bob Admin',
        email: 'admin@college.edu',
        password: 'AdminMasterKey999!',
        role: 'admin',
      },
    });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.user.role, 'admin');
    assert.ok(res.body.token);
    adminToken = res.body.token;
  });

  await test('1.3 Should reject registration if email is already taken with 400 Bad Request', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/auth/register',
      body: {
        name: 'Duplicate Alice',
        email: 'alice@college.edu',
        password: 'DifferentPassword456',
        role: 'student',
      },
    });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.match(res.body.message, /already exists/i);
  });

  await test('1.4 Should reject registration when required fields are missing', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/auth/register',
      body: {
        email: 'incomplete@college.edu',
      },
    });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  // --- 2. Security & Password Hashing Verification ---
  await test('2.1 Passwords MUST be encrypted using bcrypt (verified in DB directly)', async () => {
    const userInDb = await User.findOne({ email: 'alice@college.edu' });
    assert.ok(userInDb, 'User must exist in database');
    assert.notStrictEqual(userInDb.password, 'Password123!', 'Password must NOT be plain text');
    assert.ok(
      userInDb.password.startsWith('$2a$') || userInDb.password.startsWith('$2b$'),
      'Password must be a valid bcrypt hash starting with $2a$ or $2b$'
    );
  });

  // --- 3. Login Tests ---
  await test('3.1 Should authenticate valid student credentials with 200 OK & JWT', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/auth/login',
      body: {
        email: 'alice@college.edu',
        password: 'Password123!',
      },
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.token);
    assert.strictEqual(res.body.user.email, 'alice@college.edu');
  });

  await test('3.2 Should reject login with invalid password with 401 Unauthorized', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/auth/login',
      body: {
        email: 'alice@college.edu',
        password: 'WRONG_PASSWORD_XYZ',
      },
    });

    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
  });

  await test('3.3 Should reject login with unregistered email with 401 Unauthorized', async () => {
    const res = await request({
      method: 'POST',
      path: '/api/auth/login',
      body: {
        email: 'nobody@college.edu',
        password: 'AnyPassword123!',
      },
    });

    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
  });

  // --- 4. Protected Route & JWT Verification ---
  await test('4.1 Should fetch user profile when valid Bearer token is provided', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/auth/profile',
      headers: {
        Authorization: `Bearer ${studentToken}`,
      },
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.user.name, 'Alice Student');
    assert.strictEqual(res.body.user.email, 'alice@college.edu');
  });

  await test('4.2 Should reject profile request with 401 Unauthorized when token is missing', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/auth/profile',
    });

    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
  });

  await test('4.3 Should reject profile request with 401 when token is tampered/invalid', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/auth/profile',
      headers: {
        Authorization: 'Bearer invalid.tampered.token',
      },
    });

    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
  });

  // --- 5. Role-Based Access Control (RBAC) ---
  await test('5.1 Admin role MUST be allowed access to /api/admin/users (200 OK)', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/admin/users',
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.users));
    assert.strictEqual(res.body.meta.totalUsers, 2);
    assert.strictEqual(res.body.meta.studentCount, 1);
    assert.strictEqual(res.body.meta.adminCount, 1);
  });

  await test('5.2 Student role MUST be blocked from /api/admin/users with 403 Forbidden', async () => {
    const res = await request({
      method: 'GET',
      path: '/api/admin/users',
      headers: {
        Authorization: `Bearer ${studentToken}`,
      },
    });

    assert.strictEqual(res.status, 403, `Student must receive 403 Forbidden, got ${res.status}`);
    assert.strictEqual(res.body.success, false);
    assert.match(res.body.message, /Forbidden/i);
  });

  console.log('\n--------------------------------------------------------');
  console.log(`📊 Test Summary: ${testsPassed} Passed, ${testsFailed} Failed`);
  console.log('--------------------------------------------------------\n');

  // Teardown
  server.close();
  await disconnectDB();

  if (testsFailed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTestSuite().catch((err) => {
  console.error('Fatal Test Suite Error:', err);
  process.exit(1);
});
