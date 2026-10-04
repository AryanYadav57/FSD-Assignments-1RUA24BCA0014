import { build, transformSync } from 'esbuild';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

export type GameModuleV2 = {
  version: 2;
  title: string;
  objective: string;
  instructions: string;
  palette: { sky: string; ground: string; accent: string; highlight: string };
  /** JavaScript function body evaluated inside the isolated game document. */
  module: string;
};

const colorPattern = /^#[\da-f]{6}$/i;
let runtimeBundle: Promise<{ engine: string; decoder: string }> | undefined;

const safeText = (value: unknown, max: number) => typeof value === 'string' ? value.trim().slice(0, max) : '';

function normalizeModuleBody(source: string): string {
  // Models sometimes return the requested body as `function(game) { ... }`.
  // Invoke that expression from the runtime-owned wrapper instead of rejecting it.
  return /^function\s*\(/.test(source.trim()) ? `return (${source.trim()})(game);` : source.trim();
}

export function parseGameModuleV2(raw: string): GameModuleV2 {
  let value: any;
  try { value = JSON.parse(raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()); }
  catch { throw new Error('3D runtime response must be one valid JSON object.'); }
  if (value?.version !== 2) throw new Error('Unsupported game runtime version; expected version 2.');
  const p = value.palette ?? {};
  const parsed: GameModuleV2 = {
    version: 2,
    title: safeText(value.title, 60),
    objective: safeText(value.objective, 180),
    instructions: safeText(value.instructions, 180),
    palette: { sky: safeText(p.sky, 7), ground: safeText(p.ground, 7), accent: safeText(p.accent, 7), highlight: safeText(p.highlight, 7) },
    module: normalizeModuleBody(safeText(value.module, 24_000)),
  };
  if (!parsed.title || !parsed.objective || !parsed.instructions || !parsed.module) throw new Error('3D game is missing its title, objective, controls, or game module.');
  if (Object.values(parsed.palette).some((color) => !colorPattern.test(color))) throw new Error('3D game colors must be six-digit hex values.');
  if (parsed.module.length < 80) throw new Error('3D game module is too short to contain a playable game.');
  try { new Function('game', parsed.module); }
  catch (error) {
    const message = error instanceof Error ? error.message : 'syntax error';
    try {
      transformSync(parsed.module, { loader: 'js', target: 'es2020' });
      throw new Error(`3D game module has invalid JavaScript: ${message}`);
    } catch (diagnosticError) {
      if (diagnosticError instanceof Error && diagnosticError.message.startsWith('3D game module has invalid JavaScript:')) throw diagnosticError;
      throw new Error(`3D game module has invalid JavaScript. Repair this parser diagnostic: ${diagnosticError instanceof Error ? diagnosticError.message : message}`);
    }
  }
  return parsed;
}

async function getRuntimeBundle(): Promise<{ engine: string; decoder: string }> {
  runtimeBundle ??= Promise.all([
    build({ entryPoints: [path.join(__dirname, 'v2', 'browser.ts')], bundle: true, minify: true, platform: 'browser', format: 'iife', globalName: 'SpawnThreeRuntime', target: ['es2020'], legalComments: 'inline', write: false }),
    build({ entryPoints: [path.join(__dirname, 'v2', 'decompress.ts')], bundle: true, minify: true, platform: 'browser', format: 'iife', globalName: 'SpawnDecompress', target: ['es2017'], legalComments: 'inline', write: false }),
  ]).then(([engineBuild, decoderBuild]) => {
    const code = engineBuild.outputFiles[0]?.text, decoder = decoderBuild.outputFiles[0]?.text;
    if (!code || !decoder) throw new Error('Could not bundle the local 3D runtime and decoder.');
    return { engine: gzipSync(Buffer.from(code)).toString('base64'), decoder };
  }).catch((error) => {
    runtimeBundle = undefined;
    throw error;
  });
  return runtimeBundle;
}

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);

/** Produces a standalone offline HTML game, including the local Three.js runtime. */
export async function buildRuntimeHtmlV2(game: GameModuleV2): Promise<string> {
  const bundle = await getRuntimeBundle();
  const config = JSON.stringify(game).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
  const title = escapeHtml(game.title);
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval'; style-src 'unsafe-inline'; img-src data: blob:; media-src data: blob:; connect-src 'none'; font-src 'none'; worker-src 'none'"><title>${title}</title><style>
*{box-sizing:border-box}html,body,#game{margin:0;width:100%;height:100%;min-height:100%;overflow:hidden;background:#0b0d10;color:#f4f2ee;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}body{touch-action:none}#game{position:relative}canvas{display:block;width:100%;height:100%;touch-action:none;outline:none}#hud{position:absolute;inset:0 0 auto;display:flex;align-items:center;gap:16px;padding:18px 22px;pointer-events:none;text-shadow:0 2px 12px #000a}#gameTitle{font-weight:850;letter-spacing:.03em;font-size:clamp(14px,2vw,19px);flex:1}#hint{font-size:11px;color:#ffffffb8}#score{font-weight:800;font-variant-numeric:tabular-nums;font-size:18px}#status{position:absolute;top:62px;left:22px;color:#ffffffc4;font-size:12px;font-weight:750;letter-spacing:.06em;text-shadow:0 2px 8px #000;pointer-events:none}#overlay{position:absolute;inset:0;display:grid;place-items:center;padding:24px;background:linear-gradient(180deg,#08090b30,#08090bc9);transition:opacity .2s ease}#overlay[hidden]{display:none}.panel{width:min(450px,100%);padding:clamp(22px,5vw,36px);border:1px solid #ffffff32;border-radius:14px;background:#17191ceF;box-shadow:0 24px 90px #0009}.eyebrow{color:#ffffff95;text-transform:uppercase;letter-spacing:.15em;font-size:10px;font-weight:850}.panel h1{font-size:clamp(30px,7vw,48px);line-height:1.02;margin:12px 0}.panel p{color:#ffffffc4;line-height:1.6;margin:10px 0 22px}.panel button{width:100%;min-height:50px;border:0;border-radius:8px;color:#101113;font-weight:850;font-size:15px;cursor:pointer}.panel button:focus-visible{outline:3px solid white;outline-offset:3px}#error{position:absolute;left:12px;bottom:12px;padding:10px 12px;max-width:min(600px,calc(100% - 24px));border-radius:8px;background:#7f1d1dcc;color:#fff;font:12px ui-monospace,monospace;display:none;white-space:pre-wrap}#crosshair{position:absolute;left:50%;top:50%;width:28px;height:28px;transform:translate(-50%,-50%);pointer-events:none;z-index:2}#crosshair[hidden],#ammoPanel[hidden]{display:none}#crosshair i{position:absolute;display:block;background:#f4f2ee;box-shadow:0 0 3px #080a0c;transition:background .08s ease}#crosshair .top{left:13px;top:1px;width:2px;height:7px}#crosshair .bottom{left:13px;bottom:1px;width:2px;height:7px}#crosshair .left{left:1px;top:13px;width:7px;height:2px}#crosshair .right{right:1px;top:13px;width:7px;height:2px}#crosshair b{position:absolute;left:12px;top:12px;width:4px;height:4px;border-radius:50%;background:#f4f2ee;box-shadow:0 0 3px #080a0c}#crosshair.hit i,#crosshair.hit b{background:#ff765d}#ammoPanel{position:absolute;right:24px;bottom:22px;display:flex;align-items:baseline;gap:6px;padding:10px 13px;border:1px solid #ffffff35;border-radius:9px;background:#111518eF;color:#f2f1ec;font-variant-numeric:tabular-nums;pointer-events:none;z-index:2}#ammoPanel>span:first-child{align-self:center;margin-right:7px;color:#b7c0c1;font-size:9px;font-weight:850;letter-spacing:.16em}#ammoPanel strong{font-size:24px;line-height:1}#ammoPanel>span:nth-of-type(2),#ammoReserve{color:#a8afb0;font-size:14px}#ammoPanel small{margin-left:9px;color:#a8afb0;font-size:9px;letter-spacing:.05em}@media(max-width:600px){#ammoPanel{right:14px;bottom:14px;padding:8px 10px}#ammoPanel strong{font-size:20px}#ammoPanel small{display:none}}
</style></head><body><main id="game"><canvas id="view" tabindex="0" aria-label="${title} game"></canvas><header id="hud"><span id="gameTitle"></span><span id="hint"></span><span id="score">0</span></header><div id="status"></div><div id="crosshair" hidden aria-hidden="true"><i class="top"></i><i class="right"></i><i class="bottom"></i><i class="left"></i><b></b></div><div id="ammoPanel" hidden aria-label="Ammunition"><span>AMMO</span><strong id="ammoCount">0</strong><span>/</span><span id="ammoReserve">0</span><small>F · RELOAD</small></div><section id="overlay"><div class="panel"><div class="eyebrow" id="kicker">READY TO PLAY</div><h1 id="heading"></h1><p id="copy"></p><button id="primary"></button></div></section><div id="error" role="alert"></div></main><script>${bundle.decoder}</script><script>(()=>{try{const data='${bundle.engine}';const bytes=Uint8Array.from(atob(data),c=>c.charCodeAt(0));const code=new TextDecoder().decode(SpawnDecompress.gunzip(bytes));const tag=document.createElement('script');tag.text=code;document.head.appendChild(tag);window.__SPAWN_GAME_V2__=SpawnThreeRuntime.SpawnThreeRuntime.start(${config})}catch(error){const box=document.getElementById('error');box.textContent='The 3D runtime could not start: '+error.message;box.style.display='block'}})();</script></body></html>`;
}
