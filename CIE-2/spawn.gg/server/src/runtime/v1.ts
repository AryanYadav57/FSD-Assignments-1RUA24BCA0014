/** Shared browser runtime contract for new Canvas 2D games. */
export type GameModuleV1 = {
  version: 1;
  title: string;
  objective: string;
  instructions: string;
  palette: { sky: string; ground: string; accent: string; highlight: string };
  /** JavaScript function body. It receives the engine API and returns update/render hooks. */
  module: string;
};

const safeText = (value: unknown, max: number) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const colorPattern = /^#[\da-f]{6}$/i;

function normalizeModuleBody(source: string): string {
  return /^function\s*\(/.test(source.trim()) ? `return (${source.trim()})(engine);` : source.trim();
}

export function parseGameModuleV1(raw: string): GameModuleV1 {
  let value: any;
  try {
    value = JSON.parse(raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim());
  } catch {
    throw new Error('Runtime game response must be one valid JSON object.');
  }
  if (value?.version !== 1) throw new Error('Unsupported game runtime version; expected version 1.');
  const palette = value.palette ?? {};
  const result: GameModuleV1 = {
    version: 1,
    title: safeText(value.title, 60),
    objective: safeText(value.objective, 140),
    instructions: safeText(value.instructions, 140),
    palette: {
      sky: safeText(palette.sky, 9),
      ground: safeText(palette.ground, 9),
      accent: safeText(palette.accent, 9),
      highlight: safeText(palette.highlight, 9),
    },
    module: normalizeModuleBody(safeText(value.module, 18_000)),
  };
  if (!result.title || !result.objective || !result.instructions || !result.module) {
    throw new Error('Runtime game is missing its title, objective, instructions, or module code.');
  }
  if (Object.values(result.palette).some((color) => !colorPattern.test(color))) {
    throw new Error('Runtime palette must use six-digit hex colors.');
  }
  try {
    // Parse only. Generated source is never evaluated by the server.
    new Function('engine', result.module);
  } catch (error) {
    throw new Error(`Runtime module has invalid JavaScript: ${error instanceof Error ? error.message : 'syntax error'}`);
  }
  return result;
}

/** Assemble a self-contained document. Game code only supplies update/render hooks;
 * the shared runtime owns the loop, input, viewport, lifecycle, and standard UI. */
export function buildRuntimeHtml(game: GameModuleV1): string {
  const data = JSON.stringify(game).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval'; style-src 'unsafe-inline'; img-src data: blob:; media-src data: blob:; connect-src 'none'; font-src 'none'"><title>${game.title.replace(/[<>&"']/g, '')}</title><style>
*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#111;color:#fff;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}body{touch-action:none}#game{position:relative;width:100%;height:100%;overflow:hidden;background:#111}canvas{display:block;width:100%;height:100%;outline:none;touch-action:none}#hud{position:absolute;inset:0 0 auto;display:flex;align-items:center;gap:12px;padding:clamp(12px,2vw,24px);pointer-events:none;text-shadow:0 2px 12px #0008}#gameTitle{font-weight:800;letter-spacing:.02em;font-size:clamp(14px,2vw,20px);flex:1}#score{font-weight:750;font-variant-numeric:tabular-nums}#keys{font-size:12px;color:#ffffffb8}#overlay{position:absolute;inset:0;display:grid;place-items:center;padding:24px;background:linear-gradient(180deg,#06070a2c,#06070a99);transition:opacity .2s ease}#overlay[hidden]{display:none}.panel{width:min(440px,100%);padding:clamp(22px,5vw,36px);border:1px solid #ffffff30;border-radius:22px;background:#14171be8;box-shadow:0 24px 90px #0008;backdrop-filter:blur(18px)}.eyebrow{color:#ffffff90;text-transform:uppercase;letter-spacing:.14em;font-size:11px;font-weight:800}.panel h1{font-size:clamp(28px,7vw,44px);line-height:1.02;margin:12px 0}.panel p{color:#ffffffc4;line-height:1.55;margin:10px 0 22px}.panel button{width:100%;height:50px;border:0;border-radius:13px;color:#101113;font-weight:850;font-size:15px;cursor:pointer}.panel button:focus-visible{outline:3px solid white;outline-offset:3px}#touch{position:absolute;inset:auto 0 max(14px,env(safe-area-inset-bottom));display:flex;justify-content:center;gap:14px;pointer-events:none}#touch button{pointer-events:auto;width:58px;height:52px;border:1px solid #ffffff50;border-radius:16px;background:#17191dbb;color:white;font-weight:800;font-size:18px;touch-action:none}#error{position:absolute;left:12px;bottom:12px;padding:10px 12px;max-width:min(600px,calc(100% - 24px));border-radius:9px;background:#7f1d1dcc;color:#fff;font:12px ui-monospace,monospace;display:none}
</style></head><body><main id="game"><canvas id="canvas" tabindex="0" aria-label="${game.title.replace(/[<>&"']/g, '')} game"></canvas><header id="hud"><span id="gameTitle"></span><span id="keys">Move: WASD / Arrows · Action: Space · Pause: Esc · Restart: R</span><span id="score">0</span></header><section id="overlay"><div class="panel"><div class="eyebrow" id="eyebrow">READY TO PLAY</div><h1 id="heading"></h1><p id="message"></p><button id="primary"></button></div></section><nav id="touch" aria-label="Touch controls"><button data-key="ArrowLeft" aria-label="Move left">←</button><button data-key="ArrowUp" aria-label="Move up">↑</button><button data-key="Space" aria-label="Action">●</button><button data-key="ArrowDown" aria-label="Move down">↓</button><button data-key="ArrowRight" aria-label="Move right">→</button></nav><div id="error" role="alert"></div></main><script>
(()=>{'use strict';const GAME=${data};const canvas=document.getElementById('canvas'),ctx=canvas.getContext('2d',{alpha:false}),overlay=document.getElementById('overlay'),heading=document.getElementById('heading'),message=document.getElementById('message'),button=document.getElementById('primary'),eyebrow=document.getElementById('eyebrow'),scoreEl=document.getElementById('score'),errorEl=document.getElementById('error');let state='menu',raf=0,last=0,elapsed=0,score=0,keys=new Set(),hooks;const signals=[];let width=1,height=1,dpr=1;
const report=(kind,error)=>{const detail=String(error&&error.message||error||kind).slice(0,600);if(kind==='error'){errorEl.style.display='block';errorEl.textContent=detail}window.__SPAWN_GAME_QA__={ready:true,state,score,error:kind==='error'?detail:null,elapsed}};
window.addEventListener('error',e=>report('error',e.error||e.message));window.addEventListener('unhandledrejection',e=>report('error',e.reason));
function resize(){dpr=Math.min(window.devicePixelRatio||1,2);width=Math.max(1,innerWidth);height=Math.max(1,innerHeight);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);if(hooks?.resize)hooks.resize(width,height);}
function setScore(n){score=Math.max(0,Math.floor(Number(n)||0));scoreEl.textContent=String(score)}
function finish(won,text){if(state!=='playing')return;state=won?'won':'over';stop();show(won?'NICE WORK':'GAME OVER',text|| (won?'You completed the challenge.':'Give it another go.'), 'PLAY AGAIN');report('state')}
function api(){return{canvas,ctx,palette:GAME.palette,input:{down:k=>keys.has(k),get keys(){return keys}},viewport:()=>({width,height}),get time(){return elapsed},get score(){return score},setScore,win:text=>finish(true,text),lose:text=>finish(false,text),restart:start,pause:()=>{if(state==='playing'){state='paused';stop();show('PAUSED','Take a breather. Your progress is waiting.','RESUME');report('state')}},signal:(x,y,color=GAME.palette.highlight)=>signals.push({x,y,color,life:.55})}}
try{hooks=(new Function('engine',GAME.module))(api());if(!hooks||typeof hooks.update!=='function'||typeof hooks.render!=='function')throw Error('Module must return update(dt) and render(ctx, engine).');}catch(e){report('error',e);}
function show(kicker,title,action){eyebrow.textContent=kicker;heading.textContent=title;message.textContent=state==='menu'?GAME.objective+' '+GAME.instructions:(state==='paused'?'Press Escape to continue.':'Score: '+score+' · Press Enter to play again.');button.textContent=action;overlay.hidden=false}
function start(){if(!hooks){report('error','Game module did not initialize.');return}keys.clear();elapsed=0;score=0;scoreEl.textContent='0';signals.length=0;errorEl.style.display='none';state='playing';overlay.hidden=true;last=performance.now();try{hooks.reset?.(api());hooks.start?.(api())}catch(e){report('error',e);return}report('state');raf=requestAnimationFrame(frame);canvas.focus({preventScroll:true})}
function stop(){if(raf)cancelAnimationFrame(raf);raf=0}
function frame(now){if(state!=='playing')return;const dt=Math.min(.04,Math.max(0,(now-last)/1000));last=now;elapsed+=dt;try{ctx.setTransform(dpr,0,0,dpr,0,0);hooks.update(dt,api());hooks.render(ctx,api());for(let i=signals.length-1;i>=0;i--){signals[i].life-=dt;if(signals[i].life<=0)signals.splice(i,1)}for(const s of signals){ctx.save();ctx.globalAlpha=Math.min(1,s.life*2);ctx.fillStyle=s.color;ctx.shadowColor=s.color;ctx.shadowBlur=18;ctx.beginPath();ctx.arc(s.x,s.y,3+(.55-s.life)*7,0,Math.PI*2);ctx.fill();ctx.restore()}window.__SPAWN_GAME_QA__={ready:true,state,score,error:null,elapsed}}catch(e){report('error',e);finish(false,'The game hit an error. Press R to restart.');return}raf=requestAnimationFrame(frame)}
function onKeyDown(e){const key=e.code==='Space'?'Space':e.key;const supported=['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space','Escape','Enter','KeyW','KeyA','KeyS','KeyD','KeyR'];if(supported.includes(e.code)||supported.includes(key))e.preventDefault();keys.add(key);keys.add(e.code);if(state==='menu'&&(key==='Enter'||key==='Space'))start();else if(state==='playing'&&key==='Escape')api().pause();else if(state==='paused'&&key==='Escape'){state='playing';overlay.hidden=true;last=performance.now();raf=requestAnimationFrame(frame);report('state')}else if((state==='won'||state==='over')&&(key==='Enter'||key==='Space'))start();else if(key==='KeyR'||key==='r'||key==='R')start()}
function onKeyUp(e){keys.delete(e.key);keys.delete(e.code)}window.addEventListener('keydown',onKeyDown,{passive:false});window.addEventListener('keyup',onKeyUp);window.addEventListener('blur',()=>keys.clear());document.addEventListener('visibilitychange',()=>{if(document.hidden){keys.clear();if(state==='playing')api().pause()}});button.addEventListener('click',()=>state==='paused'?(state='playing',overlay.hidden=true,last=performance.now(),raf=requestAnimationFrame(frame)):start());document.querySelectorAll('#touch button').forEach(b=>{const k=b.dataset.key,down=e=>{e.preventDefault();keys.add(k);canvas.focus({preventScroll:true})},up=e=>{e.preventDefault();keys.delete(k)};b.addEventListener('pointerdown',down);b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up);b.addEventListener('pointerleave',up)});window.addEventListener('resize',resize);window.addEventListener('orientationchange',resize);document.getElementById('gameTitle').textContent=GAME.title;button.style.background=GAME.palette.accent;resize();show('READY TO PLAY',GAME.title,'START GAME');window.__SPAWN_GAME_QA__={ready:true,state,score,error:null,elapsed};report('ready');
})();
</script></body></html>`;
}
