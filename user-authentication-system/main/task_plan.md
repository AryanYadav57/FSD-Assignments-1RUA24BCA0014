# Task Plan: Full Stack User Authentication System

## Project Context
- **Subject:** Full Stack Development (5th Sem BCA)
- **Topic:** User Authentication System with MongoDB, Express, React Native Web (Expo Web)
- **Goal:** Build a robust, end-to-end user authentication and role-based access control system following the specified design system and lab requirements.

## Phases & Milestones

### Phase 1: Planning & Setup
- [x] Review implementation plan and lab specifications.
- [x] Initialize persistent tracking files (`task_plan.md`, `findings.md`, `progress.md`).
- [x] Initialize root configuration, backend dependencies, and folder structure.

### Phase 2: Backend Architecture & TDD Verification (Express + MongoDB)
- [x] Create `backend/package.json` with required dependencies: `express`, `mongoose`, `bcryptjs`, `jsonwebtoken`, `cors`, `dotenv`.
- [x] Implement database connection with fallback memory storage for seamless local execution (`backend/config/db.js`).
- [x] Define Mongoose `User` model with pre-save bcrypt hashing hook and password comparison method (`backend/models/User.js`).
- [x] Implement `authMiddleware` for JWT verification and role authorization (`backend/middleware/authMiddleware.js`).
- [x] Implement `authController` (`register`, `login`, `getProfile`) and routes (`backend/routes/authRoutes.js`).
- [x] Implement `adminController` and routes (`backend/routes/adminRoutes.js`) for RBAC verification.
- [x] Implement server entry point (`backend/server.js`) and auto-seed demo accounts (`backend/config/seed.js`).
- [x] TDD Suite: Write automated test runner (`backend/test/auth.test.js`) verifying:
  - User registration & duplicate email check (PASS)
  - Password encryption in database (PASS)
  - User login & JWT generation (PASS)
  - Protected profile route access (PASS)
  - Role-based access control (Admin allowed 200, Student blocked 403) (PASS)

### Phase 3: Frontend Architecture (React Native for Web / Expo)
- [x] Set up frontend workspace with React Native for Web support.
- [x] Implement Design System tokens (`src/theme/colors.js`, `typography.js`, `spacing.js`).
- [x] Implement reusable minimalist UI components:
  - `Card`: Crisp bordered card container with subtle shadows
  - `InputField`: High-contrast, focused border, clear error/helper labels
  - `Button`: Clean primary/secondary styling with active and loading states
  - `Badge`: Role badge for Student (Emerald) vs Admin (Purple)
  - `SegmentedControl`: Role selector for interactive lab evaluation
- [x] Build API communication layer with HTTP client & JWT storage (`src/api/client.js`).
- [x] Implement `AuthContext` with login, register, logout, and token persistence (`src/context/AuthContext.js`).

### Phase 4: UI Screens & RBAC Verification Dashboard
- [x] Build `LoginScreen`: Minimalist sign-in card with validation, demo fill chips, and toggle to registration.
- [x] Build `RegisterScreen`: Registration card with full name, email, password, and Student/Admin role selector.
- [x] Build `ProfileScreen`: Profile card with user details, dynamic role badge, live RBAC demo ("Fetch Admin Directory" showing 200 for Admin and 403 Forbidden for Student), and logout action.
- [x] Root `App.js`: Screen router connected to `AuthContext`.
- [x] Serve interactive web client directly from Express (`backend/public/index.html`) on `http://localhost:5000` for zero-friction lab evaluation.

### Phase 5: Verification, Packaging & Documentation
- [x] Run full automated backend test suite (13/13 tests passed, 0 failures).
- [x] Verify web frontend compilation and rendering.
- [x] Create comprehensive `README.md` with step-by-step setup, API documentation, demo credentials, and route references.
