# Findings & Technical Notes

## Environment & Constraints
- **OS:** Windows 11
- **Node.js:** v24.13.0, **npm:** 11.6.2
- **Local MongoDB daemon:** Not running as a background service on this workstation.
- **Decision:** Support both `MONGO_URI` (from environment or `.env` for MongoDB Atlas/Compass) and provide an embedded/in-memory fallback via `mongodb-memory-server` or an embedded mock so that professors, evaluators, or test runners can immediately run the application without installing or configuring external database services.

## Architecture Decisions
1. **Password Hashing:** Use `bcryptjs` with a work factor of 10. Passwords must never be stored or returned in plain text.
2. **JWT Security:** Sign tokens with user ID and user role, setting standard expiration (e.g. 24h).
3. **Role-Based Access Control:**
   - Roles: `student` (default) and `admin`.
   - `authMiddleware.protect`: Validates `Bearer <token>` and attaches user object.
   - `authMiddleware.authorize('admin')`: Restricts administrative endpoints (e.g., `/api/admin/users`) to users with `admin` role, returning `403 Forbidden` for students.
4. **Frontend Architecture:**
   - React Native for Web enables writing universal React Native components that render cleanly on Web browsers (desktop & mobile).
   - Strict minimalist design system inspired by modern editorial/SaaS interfaces: Slate palette (`#0F172A`, `#64748B`, `#E2E8F0`, `#F8FAFC`), crisp 1px borders, subtle elevation, and distinct Emerald (student) / Purple (admin) role indicators.
