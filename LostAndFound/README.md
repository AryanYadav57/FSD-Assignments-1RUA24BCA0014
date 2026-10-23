# Campus Found

A campus lost and found application built with Node.js, Express, EJS, MongoDB, and Mongoose. Students can create profiles, report lost or found belongings, search reports, and use a claim-to-return workflow.

## Requirements

- Node.js 18 or newer
- Docker Desktop for the included local MongoDB setup, or MongoDB running elsewhere

## Setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and replace `SESSION_SECRET` with a long random value.
3. Start the included MongoDB service with `docker compose up -d`, or set `MONGODB_URI` to another MongoDB server.
4. Run `npm run dev` for development or `npm start`.
5. Open `http://localhost:3000`.

The server creates the database collections when the first records are saved. The session store uses Express's in-memory store for this classroom project; it resets when the server restarts and is not intended for a production deployment.

## Student accounts

Create a student account before reporting or claiming. Passwords are hashed before storage, and the active student ID is stored in the server-side session. Claim decisions compare the authenticated session student with the found item's `reportedBy` reference on the server.

## Data relationships

- **Student** stores a unique normalized email, full name, department, and contact number.
- **LostItem** and **FoundItem** each reference the reporting student through `reportedBy`.
- **Claim** references both a `FoundItem` (`foundItemId`) and a `Student` (`claimedBy`). A unique compound index prevents the same student from claiming the same found item twice.
- Claims start as `Pending`. Only the reporting student can approve or reject them. Approval marks the item `Returned`; other pending claims for the item are rejected, and the returned item cannot receive another claim.

## Route list

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/` | Home page and current report counts |
| GET | `/report` | Choose whether to report a lost or found item |
| GET | `/students/new` | Student registration and sign-in forms |
| POST | `/students` | Validate and create a student profile |
| POST | `/session/login` | Authenticate a student and start a session |
| POST | `/session/logout` | Clear the active student |
| GET | `/students/:id` | Student profile and report history |
| GET | `/lost-items` | Searchable/filterable lost-item list |
| GET | `/lost-items/new` | Lost-item report form |
| POST | `/lost-items` | Validate and create a lost-item report |
| GET | `/lost-items/:id` | Lost-item details |
| GET | `/found-items` | Searchable/filterable found-item list |
| GET | `/found-items/new` | Found-item report form |
| POST | `/found-items` | Validate and create a found-item report |
| GET | `/found-items/:id` | Found-item details, claim form, or finder claim review |
| POST | `/found-items/:id/claims` | Submit a pending claim |
| POST or PATCH | `/claims/:id/status` | Finder approves or rejects a pending claim |

## Suggested walkthrough

1. Create an account for the finder and report a found item.
2. Create a second student account, sign in as that student, and submit a claim with an identifying reason.
3. Sign back in as the finder, open the found item, and approve the pending claim.
4. Confirm the item shows Returned and the claim controls are no longer available.

## Manual evaluation scenarios

- **Successful report:** Submit a valid lost or found report while signed into a profile; verify it appears in the database-backed list and its details page.
- **Invalid ID:** Open `/students/not-an-id` or `/found-items/not-an-id`; expect a handled 400 response.
- **Missing record:** Open a valid-looking ID that has no record; expect a handled 404 response.
- **Invalid form:** Submit a blank profile or item form; expect inline validation feedback and no record creation.
- **Duplicate email:** Create a second profile with the same email; expect a duplicate profile message.
- **Unauthorized approval:** Sign in as a student other than the found-item reporter and submit a claim decision; expect a 403 response.
- **Returned item claim:** Approve a claim, then try to submit another claim for that item; expect a rejection message.
- **Duplicate claim:** Submit twice as the same student for the same item; expect the second claim to be rejected.
