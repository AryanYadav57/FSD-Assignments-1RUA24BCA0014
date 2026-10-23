# Campus Lost and Found Implementation Plan

## Product goal

Build a complete campus lost and found website that follows the supplied assignment brief. Students can create profiles, report lost and found belongings, search reports, and return found property through a claim flow with server-side ownership checks.

## Build sequence

1. **Foundation:** Initialize Express, EJS, MongoDB/Mongoose, environment configuration, shared layout, navigation, responsive visual tokens, password-backed student accounts, and session identity.
2. **Phase 1 — profiles and reports:** Add Student, LostItem, and FoundItem models; profile creation/detail; create/list/detail pages for lost and found items; validation, search/filtering, empty states, and missing/invalid ID handling.
3. **Phase 2 — claims and return:** Add Claim model and unique student/item constraint; submit claims as Pending; allow only the found-item reporter to review/approve/reject; use guarded state transitions to mark approved items Returned; reject repeat claims and returned-item claims.
4. **Finish:** Add responsive styling, flash feedback, error pages, README with setup/routes/data relationships/demo walkthrough, and sample test scenarios from the assignment.

## Design direction

- A calm, editorial campus service: warm off-white canvas, deep evergreen navigation and primary actions, restrained mint and amber status colors, generous spacing, and clear typography.
- Responsive layouts that work from small phones to desktop; real labels, visible keyboard focus, accessible status text, and high-contrast controls.
- Shared EJS partials and CSS tokens keep the experience consistent across report, profile, and claim pages.

## Requirements mapping

| Assignment requirement | Planned implementation |
| --- | --- |
| Dynamic student profiles and duplicate email checks | `Student` model, profile form, `/students/:id`, normalized unique email |
| Lost and found CRUD views with database-backed lists | `LostItem` and `FoundItem` models and list/detail/create routes |
| Search/filter, validation, empty states | Query filters, server-side field validation, dedicated EJS states |
| Claims tied to item and student | `Claim` model with references and duplicate-claim index |
| Pending by default, owner review | Authenticated session identity and server-side ownership authorization |
| Approve means returned; no further claims | Guarded state transitions and returned-item checks |
| Useful errors and setup/documentation | Friendly flash/error pages and README with route/demo guide |

## Initial implementation scope

The first pass builds the full requested workflow in one runnable Express application. Password-backed student sign-in establishes a session identity; claim authorization derives the acting student from that authenticated session rather than trusting an actor ID from the approval form. The session store remains in memory for local classroom use.
