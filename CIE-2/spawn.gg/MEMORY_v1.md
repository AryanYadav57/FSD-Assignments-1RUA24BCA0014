# Spawn.gg — Project Memory (v1)

> **Purpose:** This document serves as a "save state" for the project. It outlines the current architecture, tech stack, and recent updates so that other AI agents can quickly catch up and continue development without losing context.

## 1. Project Overview
**Spawn.gg** is an AI-powered web application that generates fully playable, single-file HTML5 `<canvas>` games based on short user prompts. 

## 2. Tech Stack
- **Frontend:** React Native (Expo for Web) — runs on `http://localhost:8081`
- **Backend:** Node.js (Express) — runs on `http://localhost:3000`
- **AI Provider:** Groq API (originally NVIDIA NIM, migrated for performance)
- **Primary Models:** `openai/gpt-oss-120b` (Main Generator), `openai/gpt-oss-20b` (Fast Enhancer)

## 3. Core Architecture
The core game generation process uses a **2-Stage Prompt Enhancement Pipeline (PEP)**:

1. **Stage 1: Prompt Enhancement (`server/src/services/enhancer.ts`)**
   - User inputs a short prompt (e.g., "zombie survival").
   - The fast `gpt-oss-20b` model expands it into a focused **Game Design Brief** with a distinct art direction, core loop, progression, and required PC key bindings.
2. **Stage 2: Game Generation (`server/src/services/nvidia.ts` & `routes/generate.ts`)**
   - The brief is sent to the selected model (default `openai/gpt-oss-120b`).
   - The model writes a complete, single-file HTML5 game: Canvas 2D by default, or self-contained WebGL/WebGL2 for explicit 3D requests.
   - A model fallback chain and best-effort QA/polish pass run within a 120-second request deadline.
3. **Validation (`server/src/services/validate.ts`)**
   - Output is sanitized, checked for a complete canvas game, `keydown` and `keyup` handlers with key mapping, and the 200KB limit. Explicit 3D requests must contain WebGL shaders and depth testing.

## 4. Key Fixes & Learnings (Context for Agents)
- **Iframe Input Focus Bug:** Games rendered in an `<iframe>` on the player screen were ignoring the first user click. 
  - **The Fix:** The frontend iframe was updated with `ref` and `onLoad` handlers to automatically `.focus()` itself. Additionally, the backend system prompt was updated to explicitly force the AI to attach event listeners to the `window` object (not just the canvas) and to call `canvas.focus()` inside the game loop to ensure immediate playability.
- **Navigation Crashing:** Calling `router.back()` on the player screen crashed the app if the user navigated there directly. 
  - **The Fix:** Used `router.canGoBack()` to safely fallback to `router.replace('/')`.
- **Quality Bar:** The main generator prompt prioritizes a prompt-specific core loop, cohesive art direction, finished menus/HUD/results, responsive composition, and a QA/polish pass. Avoid requiring boilerplate classes or autoplay audio.
- **Desktop Controls:** Every generated game must be playable from keyboard controls (Arrow/WASD, Space, Enter, Escape, R) and show a compact control reminder in its HUD. The server rejects output without keydown/keyup handling.
- **3D Support:** Explicit 3D prompts use procedural WebGL/WebGL2 with shaders and depth testing; generated files remain self-contained with no external assets/libraries.

## 5. File Structure
- `app/` — Expo frontend
  - `src/app/index.tsx` — Home screen (Prompt input, model selector, 2-stage loading UI).
  - `src/app/player.tsx` — Game player screen (Iframe renderer, collapsible AI Design Brief).
- `server/` — Express backend
  - `src/routes/generate.ts` — API endpoint tying Stage 1 and Stage 2 together.
  - `src/services/enhancer.ts` — Stage 1 logic (GPT-OSS 20B).
  - `src/services/nvidia.ts` — Stage 2 logic (System prompts for GPT-OSS 120B).
  - `src/services/validate.ts` — Code extraction and sanity checks.

## 6. Next Steps (Pending)
- Continue hands-on frontend QA in the running web app and fix issues found during real use. The current pass covers the home studio and its interactive hero art; it is not a guarantee that every route or device has been exhaustively tested.
- Continue improving generated-game quality and reliability based on user testing, keeping generation within the current 180-second deadline.

## 7. Session Progress (2026-09-29)

### Interactive neural-network hero artwork
- Reworked `app/src/components/hero-artwork.tsx` from a rotating dotted sphere into a procedural 3D-style neural mesh: 224 neurons are connected to nearby nodes, with depth, a soft aura, node glow, and signal pulses traveling along synapses.
- Interaction: pointer movement wakes nearby neurons; click/tap fires from the nearest node; Enter and Space fire from the center. Ambient firing keeps the mesh alive. Reduced-motion preference stops continuous rotation/autofiring while leaving the interaction available.
- Added accessible button semantics, a descriptive label and keyboard shortcut metadata, high-DPI canvas sizing, capped signal count, and cleanup for animation frames and event listeners.
- Updated hero copy in `app/src/app/index.tsx` to identify the artwork as a live neural network and explain how to interact with it.

### Frontend interaction and responsive polish
- Fixed the visible selection/focus rectangle reported around the neural artwork. It now appears for keyboard-visible focus and not after mouse/touch interaction, preserving an accessible keyboard focus cue.
- Made the model picker dismiss on outside pointer input or Escape, with event listeners removed when it closes/unmounts.
- Improved narrow-screen layout: the palette controls and footer wrap into a vertical/flow layout rather than crowding, and prompt suggestion chips now meet a 44px minimum touch height. Added pressed feedback for chips and palette swatches.
- Aligned the generation request timeout with the product promise: frontend timeout is now 120,000 ms (2 minutes).
- Documented the intentional web color-scheme hydration state update so the existing lint rule does not flag it.

### Verification and current state
- Web app was running at `http://localhost:8081/` during manual review. Pointer activation of the artwork was confirmed to fire signals without leaving the outline; keyboard focus retains its visible ring. The mobile-width view and outside-click model-menu dismissal were also checked in the browser.
- `cd app && npx expo lint` — passes.
- `cd app && npx tsc --noEmit` — passes.
- No automated test suite was run in this pass.
- Main files changed: `app/src/components/hero-artwork.tsx`, `app/src/app/index.tsx`, and `app/src/hooks/use-color-scheme.web.ts`.

### Generation-output quality pass and upstream reference
- The user provided `E:\class related\5th sem\FSD-Assignments-1RUA24BCA0014\CIE-2\sandbox\sandbox` as the original GitHub project to reference. It is a Next.js/React app with a seeded three.js runtime, structured seven-part game briefing, explicit runtime constraints, and an agent QA workflow. Do not migrate Spawn.gg to Next.js: keep its Expo/React Native app and use the reference for game-generation/runtime patterns only. The upstream `reference/` directory is explicitly marked as an archive and was not used.
- Updated `server/src/services/validate.ts` to syntax-compile inline classic JavaScript with Node's `vm.Script` without executing generated code on the server; JSON/template and module scripts are excluded from this classic-script check. Syntax defects now return a concrete error for a retry.
- Updated `server/src/services/nvidia.ts` so fallback generation receives the prior validation error as repair feedback. Expanded the QA review checklist to inspect parseability, start/state/goal/replay flow, keyboard mapping, resizing, and duplicate loops/listeners; increased its full-document output budget from 3,500 to 10,000 tokens.
- Updated `server/src/routes/generate.ts` to give the QA pass the full enhanced design brief rather than only the first 400 characters of the original prompt.
- Backend API remained live during the code change; `/health` returned HTTP 200. Changed backend sources pass a targeted TypeScript check with NodeNext settings and `verbatimModuleSyntax` disabled for the repo's CommonJS package.
- Caveat: the repository-wide `npx tsc --noEmit` in `server/` still fails on pre-existing project configuration issues (CommonJS `package.json` combined with NodeNext and `verbatimModuleSyntax: true`, plus standalone test scripts included in the project). No runtime/browser test of a newly generated game was performed in this pass; syntax compilation catches parse failures but cannot prove gameplay works.
- Follow-up after a user stress-test exposed a real failure chain: the primary model produced JavaScript ending with `Unexpected end of input`, then the fallback returned no content; the route reported only the fallback failure. Generation now logs provider `finish_reason`, returned character count, and completion token count, retries the primary model once more with the validation failure in its repair instructions, and returns a clearer user-facing message if all attempts fail. The combined failure causes remain in server logs. Targeted backend TypeScript checking passed after this follow-up.

### Shared runtime and browser QA foundation (2026-09-29)
- Started the Expo-first hybrid architecture in response to the upstream Sandbox runtime idea. New non-3D requests now ask the model for a compact, versioned `GameModuleV1` JSON module rather than a full HTML page. The server assembles it into a self-contained HTML document and continues to return the existing `html` response field, so current navigation/storage/player conventions remain compatible.
- Added `server/src/runtime/v1.ts`: shared responsive Canvas 2D sizing, bounded delta-time loop, keyboard and touch inputs, menu/start/pause/restart/win/lose UI, score, particles/signals, and client error diagnostics. The module supplies only game-specific `update` and `render` hooks plus optional start/reset hooks. Module source is syntax-compiled but not evaluated server-side.
- Added isolated browser smoke QA with `playwright-core`: server launches system Chrome/Edge/Chromium (override using `SPAWN_BROWSER_EXECUTABLE`), blocks network requests, captures JS errors, checks the runtime reaches its menu, and exercises Enter start, Escape pause/resume, and R restart. A failed runtime check receives one QA-feedback repair request and a second run. Legacy explicit-WebGL games receive load/canvas bounds QA and a best-effort repair when time remains.
- Updated the Expo player to render native games with the already-installed `react-native-webview`, while web continues using its sandboxed iframe. Runtime v1 keeps its own menu; legacy games retain their start compatibility signal. The `runtimeVersion` response metadata is carried through navigation, with the old `html` payload preserved.
- Added runtime contract/setup notes at `server/src/runtime/README.md`; corrected `server/.env.example` to name `GROQ_API_KEY` and documented optional browser executable selection. The actual `.env` secret file was not read or edited.
- Verification: targeted server TypeScript check passes; Expo lint and app TypeScript checks pass. A headless Chrome smoke run initially caught a stale pause state in its QA snapshot; the runtime now publishes state transitions, and the browser check passes start, pause/resume, and restart. No real model generation request was sent in this pass.
- Known scope boundary: the shared runtime is currently Canvas 2D. Explicit 3D/WebGL stays on the previous complete-HTML path and receives browser loading/canvas-size checks; consistent shared 3D systems, richer entity/physics APIs, and outcome validation beyond lifecycle smoke checks remain future runtime work. Native player requires an Expo native/dev build to verify on a physical Android/iOS device; web build/typecheck passed.

### Design interview, chat workspace, and three-minute generation (2026-09-29)
- Inspected the original Sandbox workflow outside its archived `reference/` directory. It asks one choice-based question at a time across seven design dimensions. Adapted the interaction to Spawn.gg as five tailored questions (three concise options each), progress indication, answer recap, back/change controls, and an explicit build action.
- Added `POST /api/clarify`, powered by Qwen 3.8 27B with bounded timeouts and strict response validation. The prompt endpoint returns five distinct game-design dimensions and options; the user's choices are included in the final generation request. Existing game/player response shape remains compatible.
- Reworked the Expo home screen into a Claude-inspired studio conversation: an idea composer, assistant question cards, user answer transcript, question progress, model picker, and desktop studio sidebar. Kept Spawn.gg's original dark palettes, theme swatches, Spawn.gg identity, neural artwork, and responsive mobile palette controls.
- Raised the generation deadline on both server and app request to 180,000 ms (three minutes), with corresponding in-progress and timeout copy.
- Fixed legacy game browser QA to load on an intercepted local origin, allowing generated legacy documents to use `localStorage` while browser QA continues to block outbound network requests.
- Verification: app lint and TypeScript checks pass; targeted server TypeScript check passes. A live app browser interaction advanced from prompt through question one to question two without browser errors. Shared-runtime browser QA passed menu/start/pause/resume/restart, and legacy browser QA passed canvas sizing plus a localStorage write. `/api/clarify` had already been exercised against a real prompt and returned five validated, tailored questions.

### Aside + Claude workspace UI direction (2026-09-29)
- Reviewed the current Aside website at `https://aside.com/`; carried over its persistent work/navigation rail and task-oriented workspace structure, combined with a Claude-like conversation-first main panel.
- Updated `app/src/app/index.tsx` to use a full-window app shell with a solid left studio rail, workspace top bar, central prompt/chat area, and responsive mobile header/palette controls. Kept Spawn.gg's existing theme definitions, colors, gradients, and interactive neural artwork.
- Removed the inset rounded page card and translucent sidebar/conversation surfaces. Replaced them with opaque theme surfaces, quieter borders, smaller controls, and more restrained corner radii. Fixed the neural artwork caption so it sits below the drawing without overlap.
- Verified desktop and mobile layouts render without horizontal overflow in the local browser. `npx expo lint` and `npx tsc --noEmit` pass.
- In a follow-up visual polish pass, condensed the question history and hid duplicated Q&A transcript on the final review step. The game plan now appears as a compact five-row summary with a visible “Edit answers” path and primary “Build my game” action; the final review fits cleanly in the desktop viewport.
- Reference: the user's latest screenshot showed excessive vertical spacing and duplicated plan content. Confirmed the updated review state in a 1440×920 browser capture; five choices, edit action, and build action are visible together.

### Curated demo library and saved games (2026-09-29)
- Reworked `app/src/app/gallery.tsx` into a complete game library with two clear areas: user-created games and a curated shelf of included demos. It follows the Spawn.gg dark palette and theme swatches, uses opaque surfaces, responsive cards, game-specific cover art, visible PC controls, and a compact mobile empty state.
- Added three self-contained, immediately playable demo games in `app/src/data/demo-games.ts`:
  - `Last Light: Quarantine`: first-person 3D-style raycast survival shooter with WASD movement, mouse aim, click-to-fire, reload, sprint, ammo/health HUD, zombie waves, and extraction goal.
  - `Starline Courier`: keyboard-controlled space arcade game with collectible objective and timer.
  - `Midnight Drift`: perspective highway racer with steering, acceleration/braking, traffic, and distance scoring.
- Added `app/src/data/game-library.ts` for local browser/device saves (maximum 6 games and 650 KB per game document), and wired successful game generation to save the result before opening it. The library can reopen and remove generated saves; included demos remain available separately.
- Updated `app/src/app/player.tsx` to open curated demo IDs and locally saved game IDs. Full HTML game documents are rendered directly in the player iframe, avoiding nested-document sizing issues.
- Verification: all three demos were manually started in browser smoke checks with no game JavaScript errors; the Last Light player route shows its full HUD and menu and fills the play area. `npx expo lint` and `npx tsc --noEmit` pass. Local app is available at `http://localhost:8081/`; API health at `http://localhost:3000/health` returned `OK`.
- Browser persistence is per browser/device; curated demos are bundled and work without first generating a game. No real model generation call was made during this library pass.

### Shared Three.js runtime implementation (2026-09-29)
- Implemented the Spawn-owned Three.js runtime v2 as an independent equivalent inspired by Sandbox. No Sandbox source was copied because its checkout had no root license file; the engine uses MIT-licensed Three.js and `fflate` dependencies.
- Added `server/src/runtime/v2.ts`, `server/src/runtime/v2/browser.ts`, and API notes in `server/src/runtime/v2/README.md`. Runtime v2 bundles Three.js locally, gzip-compresses the engine for saved HTML, and embeds a local decoder fallback for older WebViews; it has no CDN dependency and uses a restrictive CSP. Generated code remains in a sandboxed iframe with a unique origin; v1 no longer posts messages to the parent app.
- Runtime systems include bounded WebGL sizing/timestep, keyboard and pointer controls, first/third-person and vehicle controllers, axis-separated static AABB collision, raycasts, scene primitives/lights, synthesized audio, tweens, named state machines, a 512-point pooled particle system, and lifecycle/error/disposal handling. A collision overlap bug found during QA was fixed so unrelated arena walls no longer teleport players to the edge.
- Clear explicit 3D requests now use validated GameModuleV2 JSON and the shared runtime; 2D continues using GameModuleV1. Both generation/repair flows remain under the existing 180-second server deadline and preserve the saved HTML response shape.
- Replaced the Last Light library demo document with `Last Light: Quarantine`, a real 3D first-person survival game with arena walls/obstacles, mouse aim, Space/click shooting, health, infected, score, extraction win, loss, and restart. `server/scripts/build-last-light.ts` regenerates `app/src/data/last-light-v2.ts`; the document remains below the existing 650 KB library limit.
- Upgraded game library persistence to async browser-localStorage/native AsyncStorage APIs so saved games work on Expo native as well as web. Saved-game reads validate document size and metadata; the player shows a recoverable missing/unsupported runtime message rather than an empty game screen. AsyncStorage was installed using the SDK57-compatible Expo package version.
- Browser QA now tests v2 WebGL startup, resize, Enter start, Space damage against an infected target, deterministic game progress, Escape pause/resume, R restart/reset, and blocked external requests. Added repeatable `npm run qa:runtime` fixtures covering v1 and the v2 showcase. The actual running app route `/player?demoId=last-light` was opened in Chrome: title/menu, 1280×734 WebGL canvas, and QA-ready state confirmed with no page errors.
- Verification: `npm run qa:runtime`, targeted server TypeScript check, `app` `npx tsc --noEmit`, and `app` `npm run lint` pass. No Android/iOS device is attached (`adb devices` is empty), so native WebView playback, offline save/reopen, mobile performance, and WebGL context-loss recovery remain open acceptance items. See `SHARED_RUNTIME_IMPLEMENTATION_PLAN.md` for the phase-by-phase checkpoint. UI redesign remains deferred.
