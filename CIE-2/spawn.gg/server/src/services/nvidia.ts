import { ACTIVE_MODEL_ID, activeAiClient as openai } from './ai-provider';
import type { ChatCompletion, ChatCompletionCreateParamsNonStreaming, ChatCompletionCreateParamsStreaming } from 'openai/resources/chat/completions';

// ─── Available Models ──────────────────────────────────────────────────────────
export const AVAILABLE_MODELS = [
  {
    id: ACTIVE_MODEL_ID,
    label: 'Kimi K3',
    description: 'NVIDIA NIM · primary',
    isDefault: true,
  },
] as const;

// Recovery stays on Kimi K3; other providers are locked during this evaluation.
export const SAME_PROVIDER_RECOVERY_MODEL = ACTIVE_MODEL_ID;
export type ModelId = typeof AVAILABLE_MODELS[number]['id'];

type RequestOptions = { signal?: AbortSignal; timeout?: number };

// Serialize hosted inference requests to avoid overlapping requests against
// the NVIDIA trial endpoint and to keep retries from amplifying rate limits.
let providerQueue: Promise<void> = Promise.resolve();

function withProviderSlot<T>(request: () => Promise<T>): Promise<T> {
  const current = providerQueue.then(request, request);
  providerQueue = current.then(() => undefined, () => undefined);
  return current;
}

export class PartialModelOutputError extends Error {
  constructor(message: string, readonly partialOutput: string) {
    super(message);
    this.name = 'PartialModelOutputError';
  }
}

async function streamModelText(
  params: ChatCompletionCreateParamsNonStreaming,
  options: RequestOptions = {},
): Promise<{ content: string; finishReason: string }> {
  let content = '';
  let finishReason = 'missing';
  try {
    await withProviderSlot(async () => {
      const stream = await openai.chat.completions.create({ ...params, stream: true } as ChatCompletionCreateParamsStreaming, options);
      for await (const event of stream) {
        const choice = event.choices[0];
        const delta = choice?.delta?.content;
        if (typeof delta === 'string') content += delta;
        if (choice?.finish_reason) finishReason = choice.finish_reason;
      }
    });
  } catch (error) {
    if (content.trim().length > 100) {
      const message = error instanceof Error ? error.message : 'Model generation stream ended early.';
      throw new PartialModelOutputError(message, content);
    }
    throw error;
  }
  return { content: content.trim(), finishReason };
}

async function createModelCompletion(
  params: ChatCompletionCreateParamsNonStreaming,
  options: RequestOptions = {},
): Promise<ChatCompletion> {
  return await withProviderSlot(async () => await openai.chat.completions.create(params, options) as ChatCompletion);
}

const DEFAULT_MODEL: ModelId = ACTIVE_MODEL_ID;
const REVIEW_MODEL: ModelId = ACTIVE_MODEL_ID;
const CLARIFIER_MODEL: ModelId = ACTIVE_MODEL_ID;

/** Ask the model for bounded race content settings, not executable game code. */
export async function generateRacerBlueprint(prompt: string, modelId: ModelId = DEFAULT_MODEL): Promise<string> {
  const response = await createModelCompletion({
    model: modelId,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'You are configuring a small arcade racing game. Return one JSON object only with exactly these keys: title, theme, laps, rivalCount, difficulty. theme must be night-city, coast, canyon, or forest. laps must be an integer from 1 to 4. rivalCount must be an integer from 1 to 4. difficulty must be relaxed, standard, or challenging. Choose settings that fit the user idea. Do not return code, colors, prose, or additional keys.' },
      { role: 'user', content: `Game idea and player choices:\n${prompt.slice(0, 3200)}\n\nChoose a concise title and matching race settings.` },
    ],
    temperature: 0.6,
    max_tokens: 500,
    reasoning_effort: 'low',
  });
  const content = response.choices[0]?.message?.content?.trim() ?? '';
  if (!content || response.choices[0]?.finish_reason === 'length') throw new Error('The race blueprint response was empty or incomplete.');
  return content;
}

export type DesignQuestion = {
  dimension: 'loop' | 'goal' | 'challenge' | 'controls' | 'world' | 'look' | 'feel';
  question: string;
  options: { id: string; label: string; description: string }[];
};

/** Keep the design flow usable when the hosted model is unavailable. */
export function createFallbackDesignQuestions(prompt: string): DesignQuestion[] {
  type FallbackChoice = [id: string, label: string, description: string];
  const idea = prompt.toLowerCase();
  const isRacing = /race|racing|car|drive|kart|vehicle/i.test(idea);
  const isShooter = /shoot|shooter|zombie|battle|gun/i.test(idea);
  const loopOptions: FallbackChoice[] = isRacing
    ? [['clean-laps', 'Race clean laps', 'Steer around hazards and keep your speed up.'], ['collect-boost', 'Collect boost', 'Pick up energy on the track and spend it to surge ahead.'], ['beat-rivals', 'Beat rivals', 'Pass a few rivals before reaching the finish.']]
    : isShooter
      ? [['fight-enemies', 'Fight enemies', 'Keep moving while you deal with approaching enemies.'], ['protect-place', 'Protect a place', 'Hold a small area against waves of enemies.'], ['collect-supplies', 'Find supplies', 'Explore for useful items while avoiding danger.']]
      : [['explore-world', 'Explore the world', 'Move through the setting and discover useful things.'], ['beat-challenges', 'Beat challenges', 'Clear a few short obstacles on the way.'], ['collect-items', 'Collect items', 'Gather things that help you reach the goal.']];
  const goalOptions: FallbackChoice[] = isRacing
    ? [['finish-race', 'Finish the race', 'Reach the finish line before time runs out.'], ['best-time', 'Set a fast time', 'Complete the course as quickly as you can.'], ['collect-points', 'Earn points', 'Pick up track tokens while staying on course.']]
    : [['reach-the-end', 'Reach the end', 'Make it to the final area.'], ['get-high-score', 'Get a high score', 'Collect points by playing well.'], ['survive-longer', 'Stay safe', 'Keep going for as long as you can.']];
  const options = (items: FallbackChoice[]) => items.map(([id, label, description]) => ({ id, label, description }));
  return [
    { dimension: 'loop', question: isRacing ? 'What sounds most fun during the race?' : 'What would you like to do most?', options: options(loopOptions) },
    { dimension: 'goal', question: 'What should your main goal be?', options: options(goalOptions) },
    { dimension: 'challenge', question: 'What should make the game tricky?', options: options([['moving-hazards', 'Moving hazards', 'Watch for things that cross your path.'], ['tight-timing', 'Quick timing', 'Choose the right moment to move or act.'], ['limited-chances', 'Limited chances', 'A few mistakes make the game harder.']]) },
    { dimension: 'controls', question: 'How would you like to control it on your computer?', options: options([['arrows-wasd', 'Arrow keys or WASD', 'Use the keyboard to move around.'], ['space-action', 'Space to act', 'Press Space for the main action.'], ['simple-keys', 'Keep it simple', 'Use a few easy-to-remember keys.']]) },
    { dimension: 'look', question: 'What style should the world have?', options: options([['bright-cartoon', 'Bright and playful', 'Friendly colors and clear shapes.'], ['neon-arcade', 'Neon arcade', 'Glowing colors and energetic effects.'], ['grounded-realistic', 'Grounded and realistic', 'Detailed places with natural materials.']]) },
  ];
}

/** Tailor five short, choice-based design questions to the user's premise. */
export async function generateDesignQuestions(prompt: string, options: { signal?: AbortSignal; timeoutMs?: number } = {}): Promise<DesignQuestion[]> {
  const response = await createModelCompletion({
    model: CLARIFIER_MODEL,
    messages: [
      {
        role: 'system',
        content: `You are a friendly game designer helping a first-time game maker decide what their game should feel like. Return one valid JSON object and no surrounding prose: {"questions":[{"dimension":"loop|goal|challenge|controls|world|look|feel","question":"one short, friendly question","options":[{"id":"short-id","label":"2–5 word choice","description":"one short sentence"}]}]}. Return exactly five concise questions, each on a different dimension, in this order when sensible: loop, goal, challenge, controls, look/world/feel. Each must fit this game idea, use words a child can understand, and have exactly THREE short choices with one short description each. Never ask how to implement the game. Do not repeat a choice the prompt already makes explicit; ask a more specific question about that dimension instead. Keep option ids lowercase kebab-case. Escape all quotation marks inside JSON strings.`
      },
      { role: 'user', content: `Game idea: ${prompt}\nWrite five useful questions to shape this game before it is built.` },
    ],
    temperature: 1,
    max_tokens: 2400,
    // Kimi K3 accepts low/high/max; low keeps clarifying responses concise.
    reasoning_effort: 'low',
  }, {
    ...(options.signal ? { signal: options.signal } : {}),
    ...(options.timeoutMs !== undefined ? { timeout: options.timeoutMs } : {}),
  });
  const raw = response.choices[0]?.message?.content?.trim() ?? '';
  const finish = response.choices[0]?.finish_reason ?? 'missing';
  console.log(`[clarify] model=${CLARIFIER_MODEL} finish=${finish} chars=${raw.length} tokens=${response.usage?.completion_tokens ?? 'unknown'}`);
  if (!raw || finish === 'length') throw new Error(`Could not prepare the game questions (finish=${finish}, chars=${raw.length}). Please try again.`);
  let parsed: any;
  const jsonStart = raw.indexOf('{');
  const jsonEnd = raw.lastIndexOf('}');
  try { parsed = JSON.parse(jsonStart >= 0 && jsonEnd > jsonStart ? raw.slice(jsonStart, jsonEnd + 1) : raw); } catch { throw new Error('The game-question step returned an invalid response. Please try again.'); }
  if (!Array.isArray(parsed.questions) || parsed.questions.length !== 5) throw new Error('The game-question step did not return five questions. Please try again.');
  const dimensions = new Set(['loop', 'goal', 'challenge', 'controls', 'world', 'look', 'feel']);
  const usedDimensions = new Set<string>();
  return parsed.questions.map((item: any, index: number): DesignQuestion => {
    if (!dimensions.has(item?.dimension) || usedDimensions.has(item.dimension) || typeof item.question !== 'string' || !Array.isArray(item.options) || item.options.length !== 3) {
      throw new Error(`Question ${index + 1} is incomplete. Please try again.`);
    }
    usedDimensions.add(item.dimension);
    const options = item.options.map((choice: any) => ({
      id: typeof choice?.id === 'string' ? choice.id.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 32) : '',
      label: typeof choice?.label === 'string' ? choice.label.trim().slice(0, 45) : '',
      description: typeof choice?.description === 'string' ? choice.description.trim().slice(0, 120) : '',
    }));
    if (!item.question.trim() || options.some((choice: { id: string; label: string; description: string }) => !choice.id || !choice.label || !choice.description)) {
      throw new Error(`Question ${index + 1} contains an empty choice. Please try again.`);
    }
    return { dimension: item.dimension, question: item.question.trim().slice(0, 160), options };
  });
}

const RUNTIME_V1_PROMPT = `Create a complete game-specific module for Spawn.gg's shared Canvas 2D runtime. Return ONLY one JSON object with this exact shape:
{"version":1,"title":"...","objective":"...","instructions":"...","palette":{"sky":"#112233","ground":"#223344","accent":"#445566","highlight":"#aabbcc"},"module":"..."}

The module value is JavaScript source (escaped as a JSON string). It is evaluated as a function body with one argument named engine and MUST return an object with update(dt, engine) and render(ctx, engine) functions. Optional reset(engine) and start(engine) functions are allowed. The shared runtime already owns a full-screen responsive canvas, animation loop, normalized keyboard/touch input, score display, menu/start/pause/restart/game-over screens, focus, resize, safe-area spacing, and error reporting. Do not create another canvas, animation loop, DOM UI, keyboard listeners, or HTML.

engine API: canvas, ctx, palette, input.down(key) where keys include ArrowLeft/Right/Up/Down, KeyW/A/S/D and Space; viewport() -> {width,height}; time seconds; score; setScore(number); win(message); lose(message); restart(); pause(); signal(x,y,color). Render all visuals in canvas coordinates using viewport dimensions. Update receives clamped seconds delta. Return a complete playable game with a clear win/survival condition and fair difficulty. Draw layered prompt-specific scenery, attractive characters/enemies/collectibles with recognizable silhouettes, shadows/highlights, animated particles, polished HUD details (within canvas), and clear visual feedback. Use collision detection and keyboard controls. Keep memory bounded; no external assets, URLs, eval, or network APIs. The shared runtime maps arrows/WASD to movement, Space to action, Enter to start/replay, Escape to pause, and R to restart. Palette values must be six-digit hex strings. Keep module source concise, valid, and below 14,000 characters. This runtime is Canvas 2D only; requests for 3D must use legacy WebGL generation instead.`;

export async function generateGameModule(userPrompt: string, modelId: ModelId = DEFAULT_MODEL, options: { signal?: AbortSignal; timeoutMs?: number; repairFeedback?: string; compact?: boolean } = {}): Promise<string> {
  const compactInstructions = options.compact
    ? 'Keep this retry compact: build one polished core level and prioritize the main action, responsive controls, collision, score/progress, and a clear ending. Reuse a few shapes and avoid optional systems or long comments. Keep the module below 10,000 characters.'
    : '';
  const { content, finishReason } = await streamModelText({
    model: modelId,
    messages: [
      { role: 'system', content: RUNTIME_V1_PROMPT },
      { role: 'user', content: `Build this game for the shared runtime. Make the unique core mechanic and setting visible in play. ${compactInstructions} ${options.repairFeedback ? `Fix these concrete problems from the previous draft: ${options.repairFeedback}` : ''}\n\nGAME BRIEF:\n${userPrompt}` },
    ],
    temperature: 1,
    max_tokens: options.compact ? 3600 : 5200,
    reasoning_effort: 'low',
  }, {
    ...(options.signal ? { signal: options.signal } : {}),
    ...(options.timeoutMs !== undefined ? { timeout: options.timeoutMs } : {}),
  });
  console.log(`[generate-runtime-v1] model=${modelId} finish=${finishReason} chars=${content.length}`);
  if (!content || finishReason === 'length') throw new Error('Runtime module response was empty or truncated.');
  return content;
}

export async function repairGameModule(userPrompt: string, moduleJson: string, diagnostics: string, modelId: ModelId, options: { signal?: AbortSignal; timeoutMs?: number; compact?: boolean } = {}): Promise<string> {
  const response = await createModelCompletion({
    model: modelId,
    messages: [
      { role: 'system', content: RUNTIME_V1_PROMPT },
      { role: 'user', content: `${options.compact ? 'Make only the smallest necessary changes to finish or fix this draft. Preserve working gameplay and art; do not redesign it. ' : 'Repair this shared-runtime game. Preserve its concept and art direction, and fix the browser QA failures. '}Return the complete JSON module.\n\nBRIEF:\n${userPrompt}\n\nREPAIR DIAGNOSTICS:\n${diagnostics}\n\nCURRENT OR PARTIAL MODULE:\n${moduleJson}` },
    ], temperature: options.compact ? 0.35 : 1, max_tokens: options.compact ? 3600 : 6500, reasoning_effort: 'low',
  }, {
    ...(options.signal ? { signal: options.signal } : {}),
    ...(options.timeoutMs !== undefined ? { timeout: options.timeoutMs } : {}),
  });
  const content = response.choices[0]?.message?.content?.trim() ?? '';
  if (!content || response.choices[0]?.finish_reason === 'length') throw new Error('Browser repair response was empty or truncated.');
  return content;
}

const RUNTIME_V2_PROMPT = `Create a fully playable 3D game module for Spawn.gg's shared Three.js runtime v2. Return ONLY one JSON object, with no markdown:
{"version":2,"title":"...","objective":"...","instructions":"...","palette":{"sky":"#112233","ground":"#223344","accent":"#445566","highlight":"#aabbcc"},"module":"..."}

The module string is a JavaScript function body invoked as new Function('game', module)(game). It MUST directly return a hook object, for example: return { update(dt, game) { /* update gameplay */ }, reset(game) { /* restore the start state */ }, qaAction() { /* make one deterministic move */ }, qaSnapshot() { return { progress: 0 }; } }; Do not wrap the function body in an uninvoked function or rely on implicit return. Do not return HTML. Do not create a renderer, canvas, DOM, animation loop, keyboard listener, or menu. The runtime owns those.

API: game.THREE; game.scene/camera/renderer/canvas; game.palette; game.models.ground(size,color), box(w,h,d,color), sphere(radius,color), capsule(radius,length,color); game.lights.moody(color,intensity), fill(color,intensity); game.physics.createWorld({gravity,floorY}) with addBox(mesh), addBody({position,radius,height}), step(dt); game.physics.createBox({position:{x,y,z},size:{x,y,z},color}) creates and registers a visible static collision box (numeric form: x,y,z,width,height,depth,color); game.controls.firstPerson(body,world,{speed,sensitivity,eyeHeight}) (WASD/arrows, mouse look, movement, physics step), game.controls.vehicle(object,options) (WASD/arrows throttle/steer), game.controls.thirdPerson(target,options); game.states.create(initial,allowedTransitions); game.input.down(key), pressed(key), look, locked, capture(), raycast(objects), onFire(fn) (click or Space); game.particles.burst(position,{count,color,speed,lifetime}) for bounded pooled impact feedback; game.helpers.follow/look/clamp; game.audio.play(name,frequency); game.onUpdate(fn); game.setScore(n), game.score, game.time; game.win(message), lose(message), pause(), resume(), restart(), onEnd(fn).

Build a cohesive, actually dimensional scene with perspective, deliberate composition, layered geometry, lights/materials, readable silhouettes, and an objective the player can reach. Use world units consistently. Add PC instructions that match functioning bindings. Use Space or click for a primary action, WASD/arrows for movement, Escape to pause, R to restart. For a first-person game, implement a floor and static collision boxes, make sure the player starts in a clear space, and aim from the camera center when pointer locked. Provide visible hit/progress feedback, health/resources as needed, fair difficulty, and win/loss hooks. Use game.particles.burst for brief impact feedback where suitable. Keep arrays/entities bounded and make reset return to a clean playable start without adding duplicate listeners or loops. Include qaAction() that performs one deterministic meaningful gameplay action and qaSnapshot() returning a small JSON-safe progress snapshot; these power browser QA and must exercise the real game logic. qaAction must synchronously advance a real gameplay metric that qaSnapshot returns (such as score, lap, playerProgress, kills, or collected items); never return true without changing measurable progress, and do not depend on simulated key presses or waiting for real time. For vehicle games, use the same movement/progress helper used by update() to advance the player once. Keep the module string below 12,000 characters. Colors must be six-digit hex. No network access, remote assets, external modules, eval, or generated scripts.`;

export async function generateThreeGameModule(userPrompt: string, modelId: ModelId = DEFAULT_MODEL, options: { signal?: AbortSignal; timeoutMs?: number; repairFeedback?: string; jsonMode?: boolean; compact?: boolean } = {}): Promise<string> {
  const compactInstructions = options.compact
    ? 'Keep this retry deliberately compact: build one polished, complete level around the main action, use simple reusable geometry, and avoid optional systems or long comments. Keep the module string below 12,000 characters. Prioritize reliable controls, collision, visible objective/progress, and a clear win or loss state.'
    : '';
  const { content, finishReason } = await streamModelText({
    model: modelId,
    ...(options.jsonMode === false ? {} : { response_format: { type: 'json_object' as const } }),
    messages: [
      { role: 'system', content: RUNTIME_V2_PROMPT },
      { role: 'user', content: `Build this specific 3D game. Use the shared runtime systems instead of rebuilding them. ${compactInstructions} ${options.repairFeedback ? `Fix these concrete problems: ${options.repairFeedback}` : ''}\n\nGAME BRIEF:\n${userPrompt}` },
    ], temperature: 1, max_tokens: options.compact ? 4600 : 5600, reasoning_effort: 'low',
  }, {
    ...(options.signal ? { signal: options.signal } : {}),
    ...(options.timeoutMs !== undefined ? { timeout: options.timeoutMs } : {}),
  });
  console.log(`[generate-runtime-v2] model=${modelId} finish=${finishReason} chars=${content.length}`);
  if (finishReason === 'length') {
    throw new PartialModelOutputError('3D runtime module response reached the model output limit.', content);
  }
  if (!content) throw new Error('3D runtime module response was empty.');
  return content;
}

export async function repairThreeGameModule(userPrompt: string, moduleJson: string, diagnostics: string, modelId: ModelId, options: { signal?: AbortSignal; timeoutMs?: number; compact?: boolean } = {}): Promise<string> {
  const repairSystemPrompt = `You repair a broken game module for Spawn.gg Three.js runtime v2. Return only one valid JSON object with the exact keys version, title, objective, instructions, palette, module. Keep title/objective/instructions/palette from the input. The module is a JavaScript function body executed with new Function('game', module)(game); it must directly end by returning { update(dt, game), reset(game), qaAction(), qaSnapshot() }. Never return an uncalled wrapper.

The runtime owns renderer, scene, camera, input, animation loop, and UI. Use game.scene, game.camera, game.THREE; game.models.box/sphere/capsule/ground/tree/rock/coin; game.lights.moody/fill; game.physics.createWorld({gravity,floorY}) which returns a world with addBox(mesh), addBody({position,radius,height}), step(dt); game.controls.vehicle(object, options), firstPerson(body,world,options), thirdPerson(target,options); game.input.down/pressed/onFire; game.onUpdate(fn); game.setScore, game.win, game.lose, game.restart, game.particles.burst.

Repair only the listed browser failure. Preserve the game's concept, visual direction, and functioning mechanics. For a QA-action failure, make qaAction synchronously advance a real gameplay metric that qaSnapshot returns; never return true without a measurable change and do not depend on elapsed time or simulated keyboard input. Do not add features, long comments, or new systems. Fix invalid/missing values before dereferencing them and use only the listed runtime API. Keep the module source below 12,000 characters so it fits reliably. Output no markdown or explanation.`;
  const response = await createModelCompletion({
    model: modelId,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: repairSystemPrompt },
      { role: 'user', content: `${options.compact ? 'Make only the smallest necessary code changes to fix the listed browser QA failures. Preserve working gameplay and art, remove optional details if needed, and keep the module string below 12,000 characters. ' : 'Repair this game module while preserving the design. If it fails during startup or does not return an update hook, rebuild its module body cleanly instead of trying to patch broken initialization. Initialize every object before reading its position or properties. '}Return the complete JSON object, not a patch. Its module string must execute directly as a function body and end by returning an object with update(dt, game), reset(game), qaAction(), and qaSnapshot() hooks. Do not use an uninvoked function wrapper.\n\nGAME BRIEF:\n${userPrompt}\n\nBROWSER QA FAILURES:\n${diagnostics}\n\nCURRENT MODULE:\n${moduleJson}` },
    // Repairs must re-emit a complete JSON module. Give even the compact
    // repair enough completion room; a smaller cap caused otherwise useful
    // fixes to be discarded as truncated JSON.
    ], temperature: options.compact ? 0.25 : 0.5, max_tokens: options.compact ? 9000 : 10_000, reasoning_effort: 'low',
  }, {
    ...(options.signal ? { signal: options.signal } : {}),
    ...(options.timeoutMs !== undefined ? { timeout: options.timeoutMs } : {}),
  });
  const content = response.choices[0]?.message?.content?.trim() ?? '';
  if (response.choices[0]?.finish_reason === 'length') {
    throw new PartialModelOutputError('3D browser repair response reached the model output limit.', content);
  }
  if (!content) throw new Error('3D browser repair response was empty.');
  return content;
}

// ─── System Prompt ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a world-class HTML5 canvas game developer. You will receive a game description and must produce a COMPLETE, SELF-CONTAINED, FULLY PLAYABLE HTML5 game.

═══════════════════════════════════
OUTPUT FORMAT — STRICTLY ENFORCED
═══════════════════════════════════
- Output ONLY the raw HTML. Start with <!DOCTYPE html>. End with </html>.
- NEVER include markdown fences (no \`\`\`html or \`\`\`).
- NEVER include explanations, comments, or text outside the HTML.
- The file must be 100% self-contained. NO external scripts, NO external stylesheets, NO images from URLs, NO CDN links, and NO external 3D/game libraries.
- Match the renderer to the request: use Canvas 2D for 2D games; use real WebGL/WebGL2 for an explicit 3D request. Never fake a requested 3D game with a flat 2D canvas or CSS perspective.

═══════════════════════════════════
QUALITY BAR — MAKE THE GAME FEEL DESIGNED
═══════════════════════════════════
- Preserve the requested genre, theme, and recognizable subject. Do not turn every idea into a generic shooter.
- Establish one cohesive art direction: deliberate palette, foreground/background contrast, consistent line weight, lighting, material treatment, and typography. For realistic requests, use grounded proportions, believable materials, environmental lighting, and coherent scale; for stylized requests, keep the style intentional and consistent.
- Compose the playfield intentionally. Make the canvas fit the viewport responsively (including resize and portrait screens); avoid letterboxed empty bands, tiny play areas, clipped HUD, and controls outside the visible area.
- Build finished-looking scenes from layered, game-specific environments and distinct objects. Give important objects recognizable silhouettes, multiple purposeful details, consistent scale, and material-aware lighting; do not use placeholder rectangles or a mostly empty black screen as the final art direction.
- Give the world a setting-specific background, atmospheric depth, subtle motion, and foreground detail. Keep the action area readable and uncluttered.
- For explicit 3D requests, create a real self-contained WebGL/WebGL2 scene: perspective camera, depth testing, lit 3D geometry with normals/material variation, a coherent environment, and camera movement that supports the game. Use procedural meshes/textures and compact shaders; do not rely on external assets or libraries. Target a polished low-poly or stylized-realistic finish rather than pretending to deliver photorealism.
- Use polished feedback for actions, hits, pickups, and game end; keep effects brief and never obscure play.
- Present a deliberate title/menu screen, concise instructions, an in-game HUD, pause state, and a results screen with a clear replay action.
- The start control must be wired to the game state machine. On starting, immediately hide the menu/overlay and show active gameplay; do not leave a title or start layer covering the running game.
- Make the first 10 seconds understandable and playable: an immediate objective, responsive controls, fair difficulty ramp, and satisfying feedback for progress.
- Make the game feel specific to the prompt: build one distinctive core mechanic, a clear short-term goal, and a satisfying feedback loop. Prefer a few finished mechanics over many shallow systems.
- Give the player, hazards, and rewards readable silhouettes and layered detail. Avoid a mostly empty black screen, tiny central play area, unstyled text, or placeholder geometry as the finished art direction.
- Ensure the game is winnable or has a clear survival target; avoid impossible spawns, unwinnable starts, and scoring without meaningful interaction.
- Use small, purposeful audio cues with a mute control. Do not autoplay loud or continuous music; audio must start only after a user gesture.

═══════════════════════════════════
GAMEPLAY — MANDATORY
═══════════════════════════════════
- Implement a proper GAME STATE MACHINE with at least 3 states:
  1. MENU state: attractive title screen with game name, instructions, and "Click/Press to Start".
  2. PLAYING state: the full game loop.
  3. GAME OVER state: show final score, high score, and a "Play Again" button.
- Include a real-time HUD (score, lives/health, level/wave).
- Difficulty must increase over time (faster enemies, more spawns, new enemy types, etc.).
- Use health/lives only when they fit the genre; provide fair recovery or clear consequences.
- Include score or another meaningful progress measure and persist a high score when appropriate. Handle unavailable localStorage without crashing.

═══════════════════════════════════
CONTROLS — MANDATORY
═══════════════════════════════════
- Desktop keyboard is the primary control scheme, not an optional fallback. Every game must be fully playable with the keyboard alone, including its main action and restart.
- Use genre-appropriate, consistent defaults: Arrow keys and WASD to move/steer or navigate; Space for the main action; Enter to start/replay/confirm; Escape to pause; R to restart. If a key does not fit the genre, assign a clear keyboard alternative rather than omitting the action.
- Implement real keydown/keyup handling (including held-key state for continuous movement), clear stuck keys on blur/visibility changes, and prevent browser defaults for game keys while playing.
- Show exact PC bindings in a readable menu legend and make the legend match the implemented controls.
- Keep a compact reminder of the main PC controls visible during play as part of the HUD, without covering the action.
- If the user explicitly asks for 3D, use canvas.getContext('webgl2') with a webgl fallback, vertex/fragment shaders, a perspective projection, and depth testing. Do not use getContext('2d') as the renderer for that request.
- Also support pointer/touch. On-screen mobile buttons are secondary controls and must not replace keyboard support.

═══════════════════════════════════
IMPLEMENTATION AND SELF-REVIEW
═══════════════════════════════════
- Use readable, well-factored JavaScript classes or modules where they clarify the game; avoid boilerplate that adds no value.
- Use requestAnimationFrame with delta time, clamp large frame gaps, and avoid unbounded arrays and timers.
- Handle resize, pause/resume, keyboard focus, pointer/touch input, and repeated restart without duplicate listeners or loops.
- Prevent browser defaults for game keys only while the game is active. Support keyboard and pointer/touch controls with visible, thumb-friendly buttons where useful.
- Initialize audio only after a user gesture. Include an obvious mute toggle if audio is present.
- Before returning, privately review for parse/runtime errors, missing event wiring, dead-end states, HUD overlap, canvas scaling, restart bugs, and whether the requested theme is visible during gameplay. Fix issues you find.
- Specifically verify that keyboard input changes the game state and moves/acts during play; a keyboard legend without working key handlers is a defect.
- Avoid filler, huge source comments, fake buttons, and decorative systems that do not affect play.

═══════════════════════════════════
RENDERER AND INPUT REQUIREMENTS
═══════════════════════════════════
- Use const canvas = document.getElementById('canvas'); choose a 2D or WebGL context to match the requested renderer.
- Make the game canvas fill its actual play area; account for device pixel ratio and resize without stretching the game world or creating blank bands.
- Wrap everything in a DOMContentLoaded listener.
- CRITICAL — IFRAME INPUT HANDLING: The game runs inside an <iframe>. To ensure click and keyboard events work on the FIRST interaction (without needing a double-click), you MUST:
  1. At the top of your DOMContentLoaded callback, call: canvas.focus(); document.body.focus(); window.focus();
  2. Set on canvas: canvas.setAttribute('tabindex', '0'); canvas.style.outline = 'none';
  3. Listen for the start event on BOTH window AND canvas AND document:
     - window.addEventListener('click', startGame);
     - window.addEventListener('keydown', startGame);
     - canvas.addEventListener('click', startGame);
  4. In the startGame function, always call: canvas.focus(); before starting the game loop.
  5. For the MENU screen "click to start": detect clicks on window level, not just canvas, so the very first click anywhere starts the game.

Write a complete, polished, immediately playable game that fulfills this specific brief. Prefer robust, finished gameplay to unnecessary code volume.`;

// ─── Generator ────────────────────────────────────────────────────────────────
export async function generateGameHtml(
  userPrompt: string,
  modelId: ModelId = DEFAULT_MODEL,
  options: { signal?: AbortSignal; timeoutMs?: number; repairFeedback?: string } = {}
): Promise<string> {
  console.log(`[generate] model=${modelId} prompt="${userPrompt.slice(0, 80)}..."`);

  const response = await createModelCompletion({
    model: modelId,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Create this game from the design brief below. Treat it as a product specification, not a list of optional ideas. Make its core loop, theme, and special mechanic visible in the playable state. Prioritize a complete, polished, responsive game over unnecessary code volume. Before answering, check that the menu starts, controls work on first input, the game can end and restart, and the layout fills the screen without clipping.${options.repairFeedback ? `\n\nREPAIR THE FAILED DRAFT: The previous attempt failed these checks: ${options.repairFeedback}. Fix those concrete defects first, preserve the requested game, and return a complete document rather than a patch.` : ''}\n\nDESIGN BRIEF:\n${userPrompt}\n\nReturn ONLY the complete raw HTML starting with <!DOCTYPE html>. No markdown or explanation.`,
      },
    ],
    temperature: 1,
    max_tokens: 10000,
    reasoning_effort: 'low',
  }, {
    ...(options.signal ? { signal: options.signal } : {}),
    ...(options.timeoutMs !== undefined ? { timeout: options.timeoutMs } : {}),
  });

  const choice = response.choices[0];
  const content = choice?.message?.content?.trim() ?? '';
  const completionTokens = response.usage?.completion_tokens ?? 'unknown';
  console.log(`[generate] response finish=${choice?.finish_reason ?? 'missing'} chars=${content.length} completion_tokens=${completionTokens}`);

  if (!content) {
    throw new Error(`Model returned no game content (finish=${choice?.finish_reason ?? 'missing'}, completion_tokens=${completionTokens}).`);
  }
  if (choice?.finish_reason === 'length') {
    throw new Error(`Model hit its output limit after ${completionTokens} tokens; the game may be incomplete.`);
  }
  return content;
}

/** Best-effort second pass that fixes concrete design, layout, and gameplay issues. */
export async function improveGameHtml(
  userPrompt: string,
  html: string,
  options: { signal?: AbortSignal; timeoutMs?: number; repairFeedback?: string } = {}
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: REVIEW_MODEL,
    messages: [
      {
        role: 'system',
        content: `You are a meticulous HTML5 game QA engineer. Review the supplied game against the full design brief and make only changes that improve completeness or fix defects. Check that the code parses; the game enters play from its start UI; keyboard controls match their on-screen labels and work on keydown/keyup; pause, win/loss, and replay transitions work; the goal is reachable; resize does not break the playfield or HUD; and restart does not duplicate loops or event listeners. Preserve the requested theme, signature mechanic, and already-working systems. Do not add features just to increase scope. Keep the result self-contained, with no external dependencies or network calls, and under 200 KB. ${options.repairFeedback ? `Prior browser QA found these defects; fix them first: ${options.repairFeedback}` : ''} Return the complete HTML document only, never a patch or explanation.`,
      },
      {
        role: 'user',
        content: `DESIGN BRIEF:\n${userPrompt}\n\nCURRENT GAME HTML (review, improve, and return the complete corrected document):\n${html}`,
      },
    ],
    temperature: 1,
    max_tokens: 10000,
    reasoning_effort: 'low',
  }, {
    ...(options.signal ? { signal: options.signal } : {}),
    ...(options.timeoutMs !== undefined ? { timeout: options.timeoutMs } : {}),
  });

  return response.choices[0]?.message?.content ?? '';
}
