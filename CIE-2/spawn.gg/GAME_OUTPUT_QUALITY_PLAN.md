# Spawn.gg Game Output Quality Plan

## Goal

Make short prompts produce games that start, respond to controls, show visible progress, and have a clear finish. Keep variety by letting the AI describe and customize content while Spawn.gg's shared runtime owns the rules that must work every time.

## Product direction

Use a hybrid pipeline:

1. The model turns the prompt and the player's answers into a small, typed game blueprint.
2. Spawn.gg validates and normalizes that blueprint.
3. A tested genre foundation builds the playable game with shared movement, camera, physics, scoring, and lifecycle systems.
4. Browser QA plays a deterministic action trace and verifies observable progress and restart.
5. If the model or its repair call is unavailable, preserve the valid draft or build from safe local defaults.

Generated JavaScript remains a compatibility path while genre foundations are introduced. It should not remain the default way to build games once a matching foundation is available.

## Phases

### 1. 3D racing vertical slice — implemented; local QA passing

- AI emits only a constrained racing blueprint, never the driving code.
- An authored Spawn.gg racing module owns the track, car controls, rivals, boost, lap tracking, and finish state.
- Clamp every model-provided value and fall back to a local blueprint if inference is unavailable.
- QA verifies keyboard acceleration, steering, measurable progress, Space action, lap/finish behavior, pause, and restart.
- Provider failure falls back to a local blueprint. Live model personalization still needs a manual run when OpenRouter credits are available.

### 2. 3D survival foundation — first slice implemented

- Move the reliable survival loop into an authored foundation: movement, enemy waves, hit feedback, health, score, win/loss, and restart.
- Have the model customize the setting, enemy appearance, wave pacing, objective, and palette through a validated blueprint.
- Keep combat and collision rules in the runtime module.

First implementation covers zombie/undead prompts with a local authored foundation: courtyard geometry, lights, cover, enemy approach, a camera-mounted rifle, crosshair/hit feedback, magazine/reserve ammo, reload animation, health, kills, win/loss, and restart. Forest/quarantine/city prompts choose a bounded local palette. AI-driven customization of the survival blueprint is still pending.

### 3. Foundation registry and more genres

- Introduce a small archetype registry that maps prompts to racing, survival, platforming, and collection foundations.
- Share common components and gameplay contracts across foundations.
- When a request does not fit a supported foundation, use the existing generated-module path and clearly label QA confidence.

### 4. Play-focused QA and repair

- Run realistic input sequences, not just isolated key presses.
- Check movement, collisions, collection/combat, score or objective progress, reachable completion, pause, restart, and responsive layout.
- Capture deterministic screenshots and check for empty scenes, missing HUD, and obvious clipping.
- Send concise failures to one bounded repair attempt; never discard a complete draft because optional repair hit a provider limit.

### 5. Quality evaluation and release gates

- Keep a fixed prompt set for each foundation and run it against every runtime or prompt change.
- Record pass rates for startup, controls, progress, completion, reset, visual checks, and repair rate.
- Compare model/config changes on the same prompt set before changing production defaults.
- Expand only when each foundation passes its gameplay and visual acceptance criteria.

## First slice acceptance criteria

- A short 3D racing prompt creates a playable game without asking the model to author JavaScript.
- W/Up accelerates, S/Down brakes or reverses, A/D steers, Space boosts, Escape pauses, and R restarts.
- A deterministic QA action advances the same progress mechanic as normal driving, and the live snapshot reports it immediately.
- A lap counter advances and the race can be completed.
- Invalid model output, missing provider access, or a 402 credit response falls back to a safe playable blueprint with a clear notice.
- Runtime QA and TypeScript checks pass.

## Current status

- Existing 2D and 3D generated-module flows remain available.
- 3D racing blueprint foundation is implemented in `server/src/runtime/v2/racer-foundation.ts` and wired through `server/src/routes/generate.ts`.
- Zombie/undead 3D prompts now use the authored survival foundation in `server/src/runtime/v2/survival-foundation.ts`, avoiding free-form AI authored gameplay code for this genre.
- 3D runtime snapshots report visible mesh/triangle/light counts. Production 3D browser QA rejects a started game with fewer than five visible meshes or 100 triangles. The existing lightweight compatibility fixtures opt out of this scene richness rule.
- The recent QA snapshot delay fix and provider request queue remain in place.
