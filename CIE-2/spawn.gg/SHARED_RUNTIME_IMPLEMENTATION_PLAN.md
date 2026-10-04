# Spawn.gg Shared Game Engine Integration Plan

## Purpose

Bring Sandbox's strongest engine ideas into Spawn.gg so generated games can use shared 3D rendering and gameplay systems instead of recreating them for every prompt. Keep Spawn.gg's Expo / React Native app, its web iframe and native WebView players, its design interview, and the current dark theme. Complete this engine improvement first; schedule the broader UI redesign as a separate follow-up after the engine is stable.

This is an integration plan, not a plan to copy Sandbox's entire application or to migrate Spawn.gg to Next.js.

## Current baseline

- The app is Expo / React Native. On web, `app/src/app/player.tsx` renders a game document in an iframe; on native it uses `react-native-webview`.
- `server/src/runtime/v1.ts` assembles a self-contained Canvas 2D document. `server/src/services/nvidia.ts` asks the model for a small `GameModuleV1` JavaScript module on this path. The runtime owns the canvas, frame loop, keyboard/touch input, menu, pause, restart, score and error diagnostics.
- Explicit 3D requests now use the versioned Three.js runtime v2 and a game-module contract; 2D stays on Canvas runtime v1. Browser QA exercises lifecycle on both paths, with deterministic gameplay QA hooks for the curated 3D showcase.
- Games in the library are stored as bounded HTML documents: browser `localStorage` on web and AsyncStorage on native (`app/src/data/game-library.ts`).
- Sandbox's `lib/games/runtime/engine/` is a Three.js toolkit with a renderer/loop, scene/camera helpers, input, physics, models/materials/lights, HUD, audio, animation/tweens, particles, state and storage utilities. Sandbox's generation agent edits files in a persistent per-game Linux sandbox; Spawn.gg currently receives a generated module or complete HTML response.
- The Sandbox checkout has no root `LICENSE`/`COPYING` file. No Sandbox source was copied; the Spawn.gg runtime is independently authored and uses Three.js under its own MIT license. Confirm upstream ownership/permission if any Sandbox source is considered for future reuse.

## Implementation checkpoint — 2026-09-29

The implementation is in progress. This checkpoint records completed work and remaining acceptance gates so the initial code slice is not mistaken for engine completion.

| Phase | Status | Implemented / remaining |
|---|---|---|
| 0 — Rights and portability | In progress | The current Sandbox checkout has no root license file; no Sandbox source was copied. Spawn-owned runtime code uses Three.js (`MIT`). A self-contained offline HTML bundle is below the existing 650 KB saved-game limit and now embeds a gzip decoder fallback for older WebViews. The browser iframe is verified; native WebView device verification and upstream rights confirmation remain. |
| 1 — 3D runtime core | Implemented for web; native gate open | Local Three.js bundle, responsive WebGL renderer, bounded timestep/pixel ratio, menu/pause/restart/error states, PC/mouse controls, blur/visibility input clearing, CSP/network block, and disposal hooks. Verify WebView and context-loss behavior on target devices. |
| 2 — Shared gameplay systems | Initial useful slice implemented | Action/held input, raycasts, first/third-person and keyboard vehicle controllers, static AABB collision, primitive scene helpers, lighting, HUD/score, audio, tweens, named states, and a bounded 512-particle pool. Character animation controllers, storage helpers, low-end device tuning, and broader browser coverage remain. |
| 3 — 3D quality benchmark | Curated web sample implemented | `Last Light: Quarantine` uses actual perspective Three.js gameplay, arena collision, aiming/shooting, health, infected, score, win/loss, and reset. Web browser QA confirms its deterministic shooting action changes score. Native performance and repeated real-device restart/resize measurement remain. |
| 4 — Versioned AI contract | Implemented, needs prompt fixtures | Runtime v2 validates metadata, colors, JS syntax and module size, and bundles shared engine code outside the model response. Clear 3D requests route to v2; 2D stays on v1; design answers feed either path. Test varied real model prompts and rejection/fallback behavior. |
| 5 — Browser QA and repair | Core integration implemented | Browser QA checks v1/v2 lifecycle, WebGL, resizing, primary action/damage, pause/resume/restart, deterministic showcase progress, the gzip fallback with native `DecompressionStream` deliberately disabled, and external-network blocking; failed QA can trigger one bounded model repair. Add repeatable 2D/racer/zombie prompt fixtures and more failure-mode coverage. |
| 6 — Library compatibility | Web save/reopen verified; native gate open | Bundled Last Light demo points at v2 HTML and remains within the current save-size ceiling; browser `localStorage` and native AsyncStorage share validated, async library functions; saved games show a recoverable unavailable-runtime state. A v2 save was reopened from its web library card and loaded offline in the player. Older demos and v1 saves retain their existing paths. Verify save/reopen and offline playback in native WebView before declaring compatibility complete. |

Current verification performed: targeted server TypeScript check, app TypeScript check/lint, Chromium QA for v1/v2, and a web library save/reopen route check. Native WebView, mobile hardware performance, and model-generated prompt fixture runs remain outstanding. UI revamp remains deferred until these engine acceptance items close.

## Product and architecture decisions

1. Preserve Expo / React Native and both existing game players.
2. Retain Canvas 2D runtime v1 for compatible games. Add a versioned Three.js runtime for 3D rather than forcing every genre through WebGL.
3. Define a Spawn.gg-owned, documented game-facing API inspired by Sandbox. AI-authored game content should use that API; common rendering lifecycle, input, camera, physics, HUD, sound, particles, and state behavior should live in the shared runtime.
4. Keep the player response and library migration compatible with existing `html`, `runtimeVersion`, demo ID, and saved-game routes until the new runtime is proven.
5. Package runtime dependencies locally. Do not rely on third-party CDNs for playable games. Select a packaging scheme that works in web iframes, Android WebView, and iOS WKWebView, and can be stored/reopened from the library.
6. Keep engine work focused. Do not redesign the studio or library UI in this effort; UI polish follows as a separate phase after engine acceptance.

## Proposed target architecture

```text
Expo app
  ├─ Web player: sandboxed iframe
  └─ Native player: react-native-webview
       └─ versioned self-contained game document
            ├─ shared runtime bootstrap (2D v1 / 3D v2)
            ├─ local Three.js build for 3D (no CDN)
            └─ validated game-specific module/config

API
  ├─ short idea + answers -> normalized design brief
  ├─ compatible 2D request -> existing GameModuleV1 flow
  └─ 3D request -> validated GameModuleV2 / supported template
       -> assemble document -> isolated browser QA -> bounded repair
```

The concrete delivery format (inlined bundle versus versioned local asset plus reliable offline packaging) is an early implementation decision. Verify resulting document size against localStorage/WebView constraints before committing to it; the present 650 KB saved-document cap may need to change or storage may need an asset-aware format.

## Implementation phases

### Phase 0 — Source rights and portability audit

- Inspect Sandbox repository history/remote metadata and any upstream licensing or ownership information available to the project owner. Record whether its engine can be copied, must be attributed, or should only inform an independent implementation.
- Inventory exact engine modules, exports, transitive dependencies, import-map behavior, expected browser APIs, and any Sandbox-only assumptions.
- Check the pinned Three.js version and license, and identify WebGL support limitations across the target browsers/WebViews.
- Prototype packaging the minimum Three.js + renderer bootstrap for both current players; measure output size, startup time, memory, and offline behavior.
- Decide the engine license/attribution approach and bundle distribution format before copying source.

**Gate:** written source-rights decision and a packaging spike that loads a local 3D scene in web iframe and native WebView without a CDN.

### Phase 1 — Spawn-owned 3D runtime core

- Add a versioned 3D runtime alongside v1 (proposed `server/src/runtime/v2` or a shared runtime package used by the server). Do not edit the Sandbox checkout.
- Implement the stable core: Three.js renderer, scene/camera setup, responsive sizing / pixel ratio, bounded frame timing, update and late-update hooks, visibility pause/resume, resize observation, and deterministic disposal/cleanup.
- Implement normalized PC-first keyboard input and pointer input, focus behavior, blur/visibility key clearing, pause/restart controls, and optional touch controls.
- Include basic accessible game menu/HUD/result overlays, diagnostics, runtime version metadata, and safe fallback if WebGL or module initialization fails.
- Apply a restrictive player boundary: no parent-app bridge for generated code, no remote network requests by default, explicit CSP, and no unnecessary file-origin access. Test this separately on iframe and WebView; a schema-valid module is still executable code.
- Add runtime documentation and short canonical examples so generation uses the shared API rather than rebuilding its systems.

**Gate:** hand-authored 3D sample starts, resizes, pauses, resumes, restarts, disposes, reports errors, and runs with outbound network blocked in both players.

### Phase 2 — Shared gameplay systems

Port or independently implement the useful Sandbox concepts in a deliberate order:

1. Action bindings and edge/held input snapshots, mouse look/raycast helpers, pointer-lock handling.
2. Lightweight arcade physics: ground, static box/arena collision, capsule-like player bodies, triggers, raycasts, and hit tests. Keep the intended scope explicit; do not imply a full rigid-body simulator.
3. Reusable camera helpers and character/vehicle controllers.
4. Procedural primitive models, materials, palette utilities, scene lighting/shadows, and instanced/reusable geometry for common game scenes.
5. HUD utilities, named game states, score/timer/storage helpers, and difficulty progression.
6. Tweens, hit feedback, particles, trails, synthesized sound, and optional post-processing only after core gameplay and performance are reliable.

- Avoid a one-to-one port of every Sandbox export. Each system must have a Spawn.gg use case, a stable API, ownership/license clarity, cleanup semantics, and browser coverage.
- Set performance defaults for mobile WebViews: capped device pixel ratio, sensible shadow/post-processing budgets, object/particle caps, pooling where useful, and graceful low-end fallback.

**Gate:** a single sample uses shared input, collision, camera, HUD, state, feedback and cleanup APIs without a game-owned duplicate engine loop or duplicate input manager.

### Phase 3 — First game and visual quality benchmark

- Convert the bundled `Last Light: Quarantine` demo into an actual Three.js 3D sample using the shared runtime. Preserve its recognizable survival loop but add real perspective geometry, lit materials, depth, a coherent environment, and practical mobile performance.
- Use the sample to exercise first-person movement/look, walls/collision, aiming/shooting, enemy hit feedback, health/ammo, pause, restart and extraction outcome.
- Keep the current raycast demo available until the new version passes its gameplay and device/browser checks; then point the library's featured demo at the verified 3D build.
- Measure initial frame/readiness, sustained frame rate on available desktop and representative mobile hardware, resize/orientation behavior, and memory across repeated restarts.

**Gate:** the first-person sample is visibly 3D, keyboard-playable, has reachable objectives, and survives repeated restart/resize without uncaught errors or runaway memory.

### Phase 4 — Versioned AI game contract and generation

- Define and validate a `GameModuleV2` contract: version, safe display metadata, controls/objective, bounded game-specific scene setup, and update hooks using only documented engine APIs. Keep engine source and HTML shell out of model output.
- Use strict parsing, limits on module bytes and numeric/object counts, syntax validation, known-runtime selection, and clear rejection messages. Do not claim server-side validation makes executable model code safe.
- Route clear 3D requests to v2; retain v1 for 2D. Normalize ambiguous requests conservatively and communicate renderer choice in the result metadata.
- Preserve the five-question design interview and include its answers in both 2D and 3D generation briefs.
- Make the model prompt concise, concrete, and tailored to v2. Include a few examples demonstrating engine APIs and quality patterns without asking the model to implement rendering/input boilerplate.
- Keep current complete-HTML output as a temporary, explicitly marked legacy path only if compatibility requires it; do not silently mix full HTML with the new contract.

**Gate:** a 3D prompt returns a v2 game document and a 2D prompt still returns a v1 document; invalid/truncated modules fail clearly or retry within the existing three-minute generation limit.

### Phase 5 — Browser QA, repair, and runtime acceptance

- Extend `server/src/services/browser-qa.ts` with runtime-version-specific checks and fixtures.
- For v2, verify: document and WebGL renderer initialize; menu appears; Enter starts; the loop advances; documented keyboard action changes a measurable state; Escape pauses/resumes; R restarts cleanly; resize works; objective/end state is reachable in deterministic seeded fixtures; no browser errors; and no unexpected network requests occur.
- Add bounded model repair using actionable QA diagnostics; rerun the same checks on repaired output. Keep the working draft if repair fails where current policy permits, and expose a readable quality/QA status rather than a blank player.
- Add repeatable prompt fixtures for zombie survival, a simple 3D racer, and a 2D collector. Separate deterministic runtime tests from stochastic model-generated tests; do not use “generated once” as a reliability claim.
- Check web iframe and native WebView separately, including keyboard focus, WebGL context loss/failure messaging, background/resume, offline operation, and saved-game reopen behavior.

**Gate:** required lifecycle and basic action QA passes on both platforms for the curated sample; generation failures return a clear message and do not break existing v1 games.

### Phase 6 — Library and compatibility rollout

- Add support for v2 saved games while preserving old local saves and bundled demos. Validate stored version and size before loading; show a recoverable unsupported/corrupt-game state.
- Keep runtime versions available for old saved games, and make any storage cap adjustment explicit and bounded. If localStorage is unsuitable for 3D bundles, separate shared engine assets from game-specific saved data without requiring network access.
- Roll out v2 to a small set of supported 3D prompt categories first. Track initialization/QA success and fallback rates locally or through existing permitted diagnostics; avoid collecting game source or sensitive user data unnecessarily.
- Only remove the legacy standalone WebGL path after representative old saves and new v2 games have a clear migration/compatibility story.

**Gate:** an existing saved v1 game still opens, a v2 game saves and reopens offline, and unsupported data fails gracefully.

## Out of scope until the engine work is accepted

- Redesigning the home, question flow, player chrome, or library appearance.
- A general-purpose professional game engine, full rigid-body physics, multiplayer, asset marketplace, arbitrary external packages/assets, or photorealistic output guarantees.
- Migrating the app away from Expo / React Native.
- Copying Sandbox's complete application, sandbox orchestration, database, or agent workflow.

## Overall definition of done

- Spawn.gg has a documented and versioned 3D runtime based on Three.js that runs locally in both the web iframe and native WebView.
- AI-generated 3D games use the shared renderer and gameplay APIs rather than emitting their own HTML/renderer/control framework.
- The converted survival demo has real 3D depth and working PC controls, readable objectives, and complete pause/restart/outcome flows.
- Browser QA exercises meaningful behavior and can feed failures into a bounded repair pass.
- Existing v1 games and saved games remain playable, and runtime packaging works offline within verified size/performance limits.
- Engine APIs, licensing/attribution, limitations, and supported templates are documented.
- Engine acceptance is complete before the next dedicated milestone revisits UI polish.

## Key risks and mitigations

| Risk | Mitigation |
|---|---|
| Sandbox engine source has unclear reuse rights | Resolve source license/ownership first; implement independently or use properly licensed dependencies if unclear. |
| 3D bundle makes every saved HTML too large | Measure before design freeze; store a shared versioned local runtime separately or choose an asset-aware bounded save format. |
| WebGL support differs between browser, Android WebView, and iOS WKWebView | Prototype both player targets early; have a clear capability check and playable fallback. |
| Generated modules can still execute harmful or runaway code | Isolate the player, enforce CSP/network restrictions and resource caps, validate contract/size, handle runtime failure; document residual limits. |
| Model can misuse a large engine API | Keep a small documented game-facing API, templates/examples, strict budgets, QA feedback, and a limited set of supported game patterns. |
| Shadows, post-effects, and entity counts overwhelm mobile devices | Cap pixel ratio and workload; tune quality tiers and test representative lower-end hardware. |
| The engine effort expands and delays UI polish | Use the phase gates above; defer UI revamp until engine acceptance, while preserving existing visual design. |
