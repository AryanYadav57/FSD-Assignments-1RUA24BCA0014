# Spawn.gg 3D runtime v2

Runtime v2 is a Spawn.gg-owned Three.js game runtime, independent of Sandbox source. Sandbox's checkout has no identified license file, so this runtime uses the MIT-licensed Three.js package and original Spawn.gg code.

## Game module contract

The model returns one JSON object:

```json
{
  "version": 2,
  "title": "Night Watch",
  "objective": "Hold the yard until the extraction lights turn green.",
  "instructions": "WASD move · mouse aim · Space fire · Esc pause · R restart",
  "palette": { "sky": "#12171c", "ground": "#303333", "accent": "#6c423c", "highlight": "#e7b982" },
  "module": "const floor=game.models.ground(50);game.scene.add(floor);game.lights.moody();return {update(dt,g){},reset(g){}};"
}
```

`module` is a JavaScript function body invoked with `game`. It returns optional `update(dt, game)`, `reset(game)`, `dispose()`, and `qaAction()` hooks. The runtime owns WebGL/Three.js startup, resize, animation timing, PC controls, pause/restart screens, errors and disposal. Game code should not install page-level listeners, start another animation loop, or replace the player shell.

## Current API

- `game.THREE`, `scene`, `camera`, `renderer`, `canvas`, `palette`, `time`, `score`, `state`; the camera is also a scene child so camera-mounted first-person view models render correctly.
- `hud.showCrosshair(visible)`, `hud.setAmmo(magazine, reserve)`, and `hud.hitMarker()` for consistent shooter UI.
- `input.down(key)`, `input.pressed(key)`, `input.look`, `input.locked`, `input.capture()`, `input.raycast(objects)`, `input.onFire(fn)`
- `onUpdate(fn)`, `setScore(n)`, `win(message)`, `lose(message)`, `pause()`, `resume()`, `restart()`, `onEnd(fn)`
- Procedural `models.ground/box/sphere/capsule/tree/crate/rock/coin/character`, `lights.moody/fill`, `physics.createWorld()` with static boxes and simple vertical player bodies, `controls.firstPerson(body, world, options)`, `helpers.follow/look/clamp`, pooled `particles.burst(position, options)`, tweens, and synthesized `audio.play(...)`.
- `world.addBody({position, radius, height})` accepts either a Three.js vector or a plain `{x,y,z}` object. The runtime converts the starting position into a mutable Three.js vector, so generated reset hooks can safely call `body.position.set(x,y,z)`.
- `physics.createBox({position, size, color})` creates a visible static collision box and registers it with physics worlds; the numeric form is `(x, y, z, width, height, depth, color)`. `controls.firstPerson(body, world, options)` supplies WASD/arrow movement and mouse look; `controls.vehicle(vehicle, options)` supplies keyboard throttle and steering; `controls.thirdPerson(target, options)` follows a target from behind. Camera controllers attach to the one runtime update loop. Legacy `game.vehicle` and `game.thirdPerson` aliases remain supported.
- `states.create(initial, allowedTransitions)` provides a small named state machine with guarded transitions and change listeners.
- A module may provide `qaAction()` and `qaSnapshot()` hooks. The isolated browser QA runner uses them to verify a deterministic game action changes real progress. Keep both bounded, deterministic, and free from unrelated state changes.

This is a small arcade-game physics layer, not a general rigid-body simulator. Game modules execute in the player document and are not made trustworthy by JSON/schema validation. The generated document applies a restrictive CSP and disables network access, but browser sandbox and native WebView boundaries still require platform-specific review.

The particle pool is capped at 512 points per document and 64 particles per burst. Static box collision uses axis-separated AABB tests and vertical capsule-like bodies; it does not provide dynamic body-to-body collision or complex mesh collision.

## Packaging and compatibility

`buildRuntimeHtmlV2` uses esbuild to bundle the pinned local Three.js dependency into the returned HTML. It compresses the engine bundle and embeds a small `fflate` decoder fallback, so startup does not depend on the WebView's native gzip API. The document contains no remote library requests and uses the existing inline-document web iframe and native WebView. The fully bundled file is larger than a v1 document; measure before raising game-save limits or promising unlimited local saves.
