# Spawn.gg shared game runtime

New 2D games use runtime contract v1. The model returns a small JSON game module rather than rebuilding a page, canvas lifecycle, controls, and menus. `buildRuntimeHtml` assembles that module into the self-contained `html` field the Expo app already consumes.

The shared runtime owns responsive canvas sizing, a bounded animation loop, desktop and touch input, title/start/pause/restart/results states, score display, safe-area-aware controls, and error reporting. A module returns `update(dt, engine)` and `render(ctx, engine)` functions; optional `start(engine)` and `reset(engine)` hooks are supported. The engine exposes `input.down(key)`, `viewport()`, `time`, `score`, `setScore`, `win`, `lose`, `pause`, `restart`, and `signal`.

The server checks the module's JSON shape and parses its JavaScript without executing it. The finished document runs in the player. Browser QA opens it in an isolated Chromium process, blocks network access, captures JavaScript errors, starts the game with Enter, exercises Escape pause/resume, and checks R restart. A failed runtime QA run gets one focused model repair and a second browser run. WebGL output remains full-document HTML for backwards compatibility and receives browser load/canvas checks plus an optional focused HTML repair.

## Chromium setup

`playwright-core` does not download a browser. The QA runner detects common system Chrome, Edge, or Chromium paths. Set `SPAWN_BROWSER_EXECUTABLE` to the full executable path when the browser is installed elsewhere. Without a browser, generation continues with server validation and the API reports the skipped QA diagnostic in `browserQa`.

Explicit 3D requests remain on the legacy WebGL generation path for now. A shared WebGL renderer and a richer automated gameplay contract can be added as later runtime versions without changing the Expo app's HTML player interface.
