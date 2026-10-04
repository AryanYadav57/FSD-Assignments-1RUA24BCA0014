import { existsSync } from 'node:fs';
import { chromium } from 'playwright-core';

function hasMeaningfulGameplayProgress(before: any, after: any): boolean {
  if (Number(after?.score) > Number(before?.score)) return true;
  const beforeCustom = before?.custom;
  const afterCustom = after?.custom;
  if (!beforeCustom || !afterCustom || typeof beforeCustom !== 'object' || typeof afterCustom !== 'object') return false;
  const progressField = /(progress|lap|score|coin|collect|kill|checkpoint|distance|speed|wave|level|target.?hp|health|fuel|energy|objective)/i;
  return Object.keys(afterCustom).some((key) => {
    if (!progressField.test(key)) return false;
    const previous = beforeCustom[key];
    const next = afterCustom[key];
    if (typeof previous !== 'number' || typeof next !== 'number' || !Number.isFinite(previous) || !Number.isFinite(next) || previous === next) return false;
    // Losing health or target HP is still a visible gameplay consequence;
    // other progress fields should move forward rather than merely change.
    return /health|target.?hp/i.test(key) ? next < previous : next > previous;
  });
}

function resolveBrowser(): string {
  const candidates = [
    process.env.SPAWN_BROWSER_EXECUTABLE,
    process.env.PROGRAMFILES && `${process.env.PROGRAMFILES}\\Google\\Chrome\\Application\\chrome.exe`,
    process.env['PROGRAMFILES(X86)'] && `${process.env['PROGRAMFILES(X86)']}\\Microsoft\\Edge\\Application\\msedge.exe`,
    process.env.LOCALAPPDATA && `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
    '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome', '/usr/bin/microsoft-edge',
  ].filter((candidate): candidate is string => Boolean(candidate));
  const executable = candidates.find(existsSync);
  if (!executable) throw new Error('No Chromium browser is available for game QA. Set SPAWN_BROWSER_EXECUTABLE to Chrome, Edge, or Chromium.');
  return executable;
}

/** Run the same generated document in an isolated headless browser and exercise its runtime lifecycle. */
export async function runBrowserQa(html: string, timeoutMs = 12_000, runtimeVersion: 1 | 2 | null = 1, requireVisualScene = false): Promise<{ passed: boolean; diagnostics: string }> {
  const browser = await chromium.launch({
    executablePath: resolveBrowser(),
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-background-networking', '--enable-webgl', '--enable-unsafe-swiftshader'],
  });
  const errors: string[] = [];
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, reducedMotion: 'reduce' });
    page.setDefaultTimeout(Math.max(1500, timeoutMs - 1500));
    if (runtimeVersion === 2) await page.addInitScript(() => { Object.defineProperty(window, 'DecompressionStream', { configurable: true, value: undefined }); });
    await page.route('**/*', async (route) => {
      if (route.request().url() === 'http://spawn-game.local/game') {
        return route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html });
      }
      if (route.request().url().startsWith('data:')) return route.continue();
      errors.push(`Unexpected browser network request blocked: ${route.request().url().slice(0, 160)}`);
      return route.abort();
    });
    page.on('pageerror', (error) => {
      const stack = error.stack?.replace(/\s+/g, ' ').slice(0, 900);
      errors.push(`Browser exception: ${error.message.slice(0, 400)}${stack ? ` | stack: ${stack}` : ''}`);
    });
    page.on('console', (message) => {
      if (message.type() === 'error') {
        const location = message.location();
        const source = location.url ? ` at ${location.url.slice(-100)}:${location.lineNumber}:${location.columnNumber}` : '';
        errors.push(`Browser console: ${message.text().slice(0, 400)}${source}`);
      }
    });
    await page.goto('http://spawn-game.local/game', { waitUntil: 'domcontentloaded', timeout: timeoutMs });
    if (runtimeVersion === null) {
      await page.waitForTimeout(500);
      const canvas = await page.locator('canvas').first().evaluate((node: HTMLCanvasElement) => {
        const rect = node.getBoundingClientRect();
        return { width: rect.width, height: rect.height, viewportWidth: innerWidth, viewportHeight: innerHeight, backingWidth: node.width, backingHeight: node.height };
      }).catch(() => null);
      if (!canvas) errors.push('Generated game did not create a canvas in the browser.');
      else if (canvas.width < 160 || canvas.height < 120 || canvas.width < canvas.viewportWidth * 0.5 || canvas.height < canvas.viewportHeight * 0.45) {
        errors.push(`Generated canvas is too small for the game viewport (${canvas.width}x${canvas.height}, viewport ${canvas.viewportWidth}x${canvas.viewportHeight}).`);
      }
      if (errors.length) return { passed: false, diagnostics: [...new Set(errors)].join('\n') };
      return { passed: true, diagnostics: 'Browser smoke checks passed: the game loaded without JavaScript or network errors and its canvas fills a usable part of the viewport.' };
    }
    if (runtimeVersion === 2) {
      await page.waitForTimeout(600);
      const ready3d = await page.evaluate(() => (window as any).__SPAWN_GAME_QA__ ?? null);
      if (!ready3d?.ready || ready3d.state !== 'menu') errors.push(`3D runtime did not reach its ready menu (snapshot=${JSON.stringify(ready3d)}).`);
      const canvas = await page.locator('canvas').first().evaluate((node: HTMLCanvasElement) => {
        const rect = node.getBoundingClientRect();
        return { width: rect.width, height: rect.height, viewportWidth: innerWidth, viewportHeight: innerHeight, webgl: Boolean(node.getContext('webgl2')) };
      }).catch(() => null);
      if (!canvas) errors.push('3D game did not create its render canvas.');
      else if (!canvas.webgl) errors.push('Three.js did not initialize a WebGL2 renderer.');
      else if (canvas.width < canvas.viewportWidth * .6 || canvas.height < canvas.viewportHeight * .6) errors.push(`3D canvas does not fill the player (${canvas.width}x${canvas.height}).`);
      await page.setViewportSize({ width: 900, height: 600 });
      await page.waitForTimeout(100);
      const resized = await page.locator('canvas').first().evaluate((node: HTMLCanvasElement) => { const rect = node.getBoundingClientRect(); return { width: rect.width, height: rect.height, viewportWidth: innerWidth, viewportHeight: innerHeight }; }).catch(() => null);
      if (!resized || resized.width < resized.viewportWidth * .6 || resized.height < resized.viewportHeight * .6) errors.push(`3D canvas did not resize with its player viewport (${JSON.stringify(resized)}).`);
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.keyboard.press('Enter');
      await page.waitForTimeout(250);
      const playing = await page.evaluate(() => (window as any).__SPAWN_GAME_QA__ ?? null);
      if (playing?.state !== 'playing' || !(playing.elapsed > 0)) errors.push(`Enter did not start the 3D game loop (snapshot=${JSON.stringify(playing)}).`);
      if (requireVisualScene && playing?.visual && (playing.visual.meshes < 5 || playing.visual.triangles < 100)) {
        errors.push(`The 3D scene is visually empty or incomplete: found ${playing.visual.meshes} visible meshes and ${playing.visual.triangles} triangles after starting (snapshot=${JSON.stringify(playing)}). Add visible world geometry, ground, and game objects.`);
      }
      if (playing?.custom?.archetype === 'survival') {
        const hud = await page.evaluate(() => ({ crosshair: !(document.getElementById('crosshair') as HTMLElement | null)?.hidden, ammo: !(document.getElementById('ammoPanel') as HTMLElement | null)?.hidden, magazine: document.getElementById('ammoCount')?.textContent, reserve: document.getElementById('ammoReserve')?.textContent }));
        if (!hud.crosshair || !hud.ammo || hud.magazine !== '12' || hud.reserve !== '48') errors.push(`The survival game is missing its aiming reticle or initialized ammo display (${JSON.stringify(hud)}).`);
      }
      if (playing?.custom?.archetype === 'racer') {
        const startProgress = Number(playing.custom.playerProgress ?? 0);
        await page.keyboard.down('w');
        await page.waitForTimeout(450);
        await page.keyboard.up('w');
        const driven = await page.evaluate(() => (window as any).__SPAWN_GAME_V2__?.snapshot?.() ?? (window as any).__SPAWN_GAME_QA__);
        if (!(Number(driven?.custom?.playerProgress) > startProgress)) errors.push(`W/Up did not move the racing car forward (snapshot=${JSON.stringify(driven)}).`);
        const laneBefore = Number(driven?.custom?.lane ?? 0);
        await page.keyboard.down('a');
        await page.waitForTimeout(300);
        await page.keyboard.up('a');
        const steered = await page.evaluate(() => (window as any).__SPAWN_GAME_V2__?.snapshot?.() ?? (window as any).__SPAWN_GAME_QA__);
        if (!(Number(steered?.custom?.lane) < laneBefore)) errors.push(`A/Left did not steer the racing car left (snapshot=${JSON.stringify(steered)}).`);
        if (errors.length) return { passed: false, diagnostics: [...new Set(errors)].join('\n') };
      }
      // Once startup has failed, later inputs only add symptoms from a game
      // that is already stopped. Return the first useful failure for repair.
      if (errors.length || playing?.message) return { passed: false, diagnostics: [...new Set(errors)].join('\n') || `3D game failed during startup: ${playing.message} (snapshot=${JSON.stringify(playing)}).` };
      const beforeAction = Number(playing?.actionCount ?? 0);
      await page.keyboard.press('Space');
      await page.waitForTimeout(100);
      const action = await page.evaluate(() => (window as any).__SPAWN_GAME_QA__ ?? null);
      if (Number(action?.actionCount ?? 0) <= beforeAction) errors.push(`Space did not trigger the primary action (snapshot=${JSON.stringify(action)}).`);
      if (action?.message || action?.state === 'over') {
        errors.push(`3D game crashed during its primary action (snapshot=${JSON.stringify(action)}).`);
        return { passed: false, diagnostics: [...new Set(errors)].join('\n') };
      }
      if (playing?.custom?.archetype === 'survival' && !(Number(action?.custom?.ammo) < Number(playing.custom.ammo))) errors.push(`Space fired but did not consume a survival-game round (snapshot=${JSON.stringify(action)}).`);
      if (typeof playing?.custom?.targetHp === 'number' && !(Number(action?.custom?.targetHp) < Number(playing.custom.targetHp))) {
        errors.push(`Space fired but did not damage the showcase target (before=${JSON.stringify(playing.custom)}, after=${JSON.stringify(action?.custom)}).`);
      }
      const gameplay = await page.evaluate(() => {
        const runtime = (window as any).__SPAWN_GAME_V2__;
        if (typeof runtime?.qaAction !== 'function') return { supported: false };
        const before = typeof runtime.snapshot === 'function' ? runtime.snapshot() : (window as any).__SPAWN_GAME_QA__;
        const result = runtime.qaAction();
        // The RAF-published global snapshot is one frame behind while this
        // evaluate callback runs. Read the module hook synchronously after its
        // action so valid progress is not mistaken for a no-op.
        const after = typeof runtime.snapshot === 'function' ? runtime.snapshot() : (window as any).__SPAWN_GAME_QA__;
        return { supported: true, result, score: runtime.game.score, before, snapshot: after };
      });
      if (gameplay.supported && !hasMeaningfulGameplayProgress(gameplay.before, gameplay.snapshot)) {
        errors.push(`The game-specific QA action did not change meaningful gameplay progress (snapshot=${JSON.stringify(gameplay)}).`);
      }
      if (playing?.custom?.archetype === 'survival') {
        await page.keyboard.press('f');
        await page.waitForTimeout(1200);
        const reloaded = await page.evaluate(() => (window as any).__SPAWN_GAME_V2__?.snapshot?.() ?? (window as any).__SPAWN_GAME_QA__);
        if (Number(reloaded?.custom?.ammo) !== 12 || Number(reloaded?.custom?.reserve) !== 45) errors.push(`F did not refill the survival magazine and use reserve ammunition (snapshot=${JSON.stringify(reloaded)}).`);
      }
      await page.keyboard.press('Escape');
      const paused = await page.evaluate(() => (window as any).__SPAWN_GAME_QA__ ?? null);
      if (paused?.state !== 'paused') errors.push(`Escape did not pause the 3D game (snapshot=${JSON.stringify(paused)}).`);
      await page.keyboard.press('Escape');
      await page.keyboard.press('r');
      await page.waitForTimeout(100);
      const restarted = await page.evaluate(() => (window as any).__SPAWN_GAME_QA__ ?? null);
      if (restarted?.state !== 'playing') errors.push(`R did not restart the 3D game (snapshot=${JSON.stringify(restarted)}).`);
      if (gameplay.supported && Number(restarted?.score) !== 0) errors.push(`R did not reset game progress (snapshot=${JSON.stringify(restarted)}).`);
      if (typeof restarted?.custom?.targetHp === 'number' && (restarted.custom.kills !== 0 || restarted.custom.zombies !== 5 || restarted.custom.targetHp !== 2)) errors.push(`R did not restore the 3D showcase's initial game state (snapshot=${JSON.stringify(restarted.custom)}).`);
      if (restarted?.custom?.archetype === 'racer') {
        const raceFinish = await page.evaluate(() => {
          const runtime = (window as any).__SPAWN_GAME_V2__;
          for (let i = 0; i < 100 && runtime.snapshot().state === 'playing'; i++) runtime.qaAction();
          return runtime.snapshot();
        });
        if (raceFinish?.state !== 'won' || !raceFinish?.custom?.finished) errors.push(`The racing foundation could not reach its finish state (snapshot=${JSON.stringify(raceFinish)}).`);
        await page.keyboard.press('r');
        await page.waitForTimeout(100);
        const raceRestart = await page.evaluate(() => (window as any).__SPAWN_GAME_V2__?.snapshot?.() ?? null);
        if (raceRestart?.state !== 'playing' || Number(raceRestart?.custom?.playerProgress) !== 0) errors.push(`R did not reset the racing foundation after its finish (snapshot=${JSON.stringify(raceRestart)}).`);
      }
      if (restarted?.custom?.archetype === 'survival' && (Number(restarted.custom.ammo) !== 12 || Number(restarted.custom.reserve) !== 48)) errors.push(`R did not restore starting survival ammunition (snapshot=${JSON.stringify(restarted.custom)}).`);
      if (errors.length) return { passed: false, diagnostics: [...new Set(errors)].join('\n') };
      return { passed: true, diagnostics: `Three.js browser QA passed: local WebGL runtime loaded without network requests, its menu/start loop works, Space triggers an action${gameplay.supported ? ' that changes game progress' : ''}, Escape pauses/resumes, and R restarts.` };
    }
    const ready = await page.evaluate(() => (window as any).__SPAWN_GAME_QA__ ?? null);
    if (!ready?.ready || ready.state !== 'menu') errors.push(`Runtime did not reach its ready menu state (snapshot=${JSON.stringify(ready)}).`);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(350);
    const playing = await page.evaluate(() => (window as any).__SPAWN_GAME_QA__ ?? null);
    if (playing?.state !== 'playing' || !(playing.elapsed > 0)) errors.push(`Keyboard start/game loop failed (snapshot=${JSON.stringify(playing)}).`);
    await page.keyboard.press('Escape');
    const paused = await page.evaluate(() => (window as any).__SPAWN_GAME_QA__ ?? null);
    if (paused?.state !== 'paused') errors.push(`Escape did not pause the game (snapshot=${JSON.stringify(paused)}).`);
    await page.keyboard.press('Escape');
    await page.keyboard.press('r');
    const restarted = await page.evaluate(() => (window as any).__SPAWN_GAME_QA__ ?? null);
    if (restarted?.state !== 'playing') errors.push(`Restart key did not resume a fresh game (snapshot=${JSON.stringify(restarted)}).`);
    return { passed: errors.length === 0, diagnostics: errors.length ? [...new Set(errors)].join('\n') : 'Browser smoke checks passed: document loaded, no JS errors or external requests, Enter started the game loop, Escape paused/resumed, and R restarted.' };
  } catch (error) {
    errors.push(`Browser QA runner failed: ${error instanceof Error ? error.message : String(error)}`);
    return { passed: false, diagnostics: [...new Set(errors)].join('\n') };
  } finally {
    await browser.close();
  }
}
