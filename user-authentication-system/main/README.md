# Full-Stack User Authentication System

> **Subject:** Full Stack Development (5th Semester BCA)  
> **Topic:** User Authentication & Role-Based Access Control System  
> **Tech Stack:** Node.js, Express, MongoDB (Mongoose), Bcrypt, JSON Web Tokens (JWT), React Native for Web

---

## 📌 Project Overview

This project implements an end-to-end, production-grade **User Authentication and Authorization System** designed for academic evaluation and modern web security best practices.

### Key Capabilities
- **Secure Password Hashing:** Automatically hashes passwords using `bcryptjs` with 10 salt rounds before persisting to MongoDB. Plain-text passwords are never saved or exposed in responses.
- **JWT Authentication:** Stateless session management using cryptographic JSON Web Tokens signed with a secret key and expiring after 24 hours.
- **Role-Based Access Control (RBAC):** Distinct `student` and `admin` roles with middleware protection. Students are strictly blocked with `403 Forbidden` from administrative directories.
- **Zero-Setup Database Architecture:** Seamlessly connects to any local or cloud MongoDB instance (`process.env.MONGO_URI`), with an automatic embedded in-memory MongoDB fallback for instant viva/lab evaluation without manual database installation.
- **Minimalist Modern Frontend:** High-craft Slate & Emerald design system featuring responsive card layouts, crisp 1px borders, subtle ambient shadows, and an interactive live RBAC demonstration console.

---

## 🏗️ Project Architecture

```text
user-authentication-system/main/
├── backend/
│   ├── config/
│   │   ├── db.js             # Mongoose connection with in-memory fallback
│   │   └── seed.js           # Pre-seeds demo accounts on startup
│   ├── controllers/
│   │   ├── authController.js # register, login, getProfile
│   │   └── adminController.js# getAllUsers (Admin only)
│   ├── middleware/
│   │   └── authMiddleware.js # protect (JWT validation) & authorize (RBAC)
│   ├── models/
│   │   └── User.js           # Mongoose schema + bcrypt hooks + comparePassword
│   ├── routes/
│   │   ├── authRoutes.js     # /api/auth endpoints
│   │   └── adminRoutes.js    # /api/admin endpoints
│   ├── public/
│   │   └── index.html        # Interactive browser portal served by Express
│   ├── test/
│   │   └── auth.test.js      # Comprehensive TDD verification suite (13 tests)
│   ├── .env                  # Environment configuration
│   ├── package.json          # Backend dependencies
│   └── server.js             # Express application entry point
├── frontend/
│   ├── src/
│   │   ├── api/client.js     # Universal HTTP fetch wrapper with auto-auth headers
│   │   ├── components/       # Card, InputField, Button, Badge, SegmentedControl
│   │   ├── context/          # AuthContext for session & token state
│   │   ├── screens/          # LoginScreen, RegisterScreen, ProfileScreen
│   │   └── theme/            # Minimalist Slate tokens, typography, and spacing
│   ├── App.js                # React Native Web root navigator
│   ├── app.json              # Expo configuration
│   └── package.json          # React Native Web dependencies
├── IMPLEMENTATION_PLAN.md    # Architectural specification
├── task_plan.md              # Phase tracking & milestones
├── findings.md               # Technical notes & discoveries
├── progress.md               # Implementation log
├── package.json              # Root orchestration scripts
└── README.md                 # Complete documentation
```

---

## 🚀 Quick Start Guide

### 1. Run Automated Test Suite (TDD Verification)

To run the complete automated test suite verifying password hashing, token validation, and RBAC:

```bash
npm test
```

*Output:*
```text
  ✅ PASS: 1.1 Should register a student successfully with 201 Created and return JWT
  ✅ PASS: 1.2 Should register an admin successfully with 201 Created
  ✅ PASS: 1.3 Should reject registration if email is already taken with 400 Bad Request
  ✅ PASS: 1.4 Should reject registration when required fields are missing
  ✅ PASS: 2.1 Passwords MUST be encrypted using bcrypt (verified in DB directly)
  ✅ PASS: 3.1 Should authenticate valid student credentials with 200 OK & JWT
  ✅ PASS: 3.2 Should reject login with invalid password with 401 Unauthorized
  ✅ PASS: 3.3 Should reject login with unregistered email with 401 Unauthorized
  ✅ PASS: 4.1 Should fetch user profile when valid Bearer token is provided
  ✅ PASS: 4.2 Should reject profile request with 401 Unauthorized when token is missing
  ✅ PASS: 4.3 Should reject profile request with 401 when token is tampered/invalid
  ✅ PASS: 5.1 Admin role MUST be allowed access to /api/admin/users (200 OK)
  ✅ PASS: 5.2 Student role MUST be blocked from /api/admin/users with 403 Forbidden
--------------------------------------------------------
📊 Test Summary: 13 Passed, 0 Failed
--------------------------------------------------------
```

### 2. Start the Application

Start the Express backend and interactive web interface:

```bash
npm run server
```

Open your browser to:
👉 **[http://localhost:5000](http://localhost:5000)**

---

## 🔑 Pre-Configured Test Accounts

The system automatically pre-seeds two accounts upon server launch for convenient evaluation:

| Account Type | Email | Password | Privileges |
|--------------|-------|----------|------------|
| **Student** | `alice@college.edu` | `Password123!` | Personal profile access; blocked from `/api/admin/users` (403) |
| **Admin** | `admin@college.edu` | `AdminMasterKey999!` | Personal profile + full access to `/api/admin/users` directory (200) |

*(You can also use the **Quick Fill Demo Accounts** buttons directly on the login screen or register new student/admin accounts dynamically.)*

---

## 📡 REST API Reference

### Public Endpoints

#### 1. Register User
- **Method:** `POST`
- **URL:** `/api/auth/register`
- **Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@college.edu",
    "password": "Password123!",
    "role": "student"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Account registered successfully.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "672f...",
      "name": "Jane Doe",
      "email": "jane@college.edu",
      "role": "student",
      "createdAt": "2026-11-09T..."
    }
  }
  ```

#### 2. Login User
- **Method:** `POST`
- **URL:** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "jane@college.edu",
    "password": "Password123!"
  }
  ```
- **Response (200 OK):** Returns JWT token and sanitized user profile without password.

---

### Protected Endpoints (Requires `Authorization: Bearer <token>`)

#### 3. Get Current Profile
- **Method:** `GET`
- **URL:** `/api/auth/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):** Authenticated user record.
- **Response (401 Unauthorized):** Missing or invalid JWT token.

#### 4. Get User Directory (Admin Only)
- **Method:** `GET`
- **URL:** `/api/admin/users`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Response (200 OK - When logged in as Admin):**
  ```json
  {
    "success": true,
    "meta": {
      "totalUsers": 2,
      "studentCount": 1,
      "adminCount": 1
    },
    "users": [ ... ]
  }
  ```
- **Response (403 Forbidden - When logged in as Student):**
  ```json
  {
    "success": false,
    "message": "Forbidden: User role 'student' is not authorized to access this resource. Required role(s): [admin]"
  }
  ```

---

## 🧪 Security & Quality Verification

1. **Password Hashing:** Passwords in the database are hashed with `bcryptjs` and stored as `$2a$10$...`. Verified via test `2.1`.
2. **Data Sanitization:** The Mongoose schema overrides `toJSON` to delete the `password` field before serialization.
3. **Tamper Proofing:** JWTs are verified using standard signature checks. Modified tokens immediately return `401 Unauthorized`.
4. **Role Enforcement:** Server-side `authorize('admin')` middleware ensures roles cannot be spoofed from the client.
