import { ACTIVE_MODEL_ID, activeAiClient as openai } from './ai-provider';

// Use the fastest small model for the enhancement step — cheap & quick
const ENHANCER_MODEL = ACTIVE_MODEL_ID;

const ENHANCER_SYSTEM_PROMPT = `You are a senior game designer writing a practical design brief for a code-generation model. Keep the user's core idea recognizable; do not replace it with a generic shooter or runner. Infer a fitting genre and make concrete, buildable choices.

Your job is to expand it into a focused, structured Game Design Brief for a code-generation AI. Preserve the user's idea. Prioritize a fun, immediately understandable core loop and a strong visual identity over feature count. Specify one signature mechanic and only the supporting systems needed to make it satisfying; avoid turning a small idea into an over-scoped game.

OUTPUT FORMAT — fill in every field below. Output ONLY the structured brief. No preamble, no explanation, no markdown fences.

GAME TITLE: [a creative, thematic name]
GENRE: [Platformer | Shooter | Puzzle | RPG | Racing | Survival | Arcade | Tower Defense | Fighting | Clicker]
RENDER MODE: [2D | 2.5D | 3D; preserve an explicit 3D request and use real WebGL for 3D]
ART DIRECTION: [cohesive polished style; if realism is requested, specify grounded proportions, materials, lighting, and environment]
VISUAL THEME: [distinct art direction, setting, mood, and visual motifs]
COLOR PALETTE: [3–5 coordinated colors with hex values]
SCREEN COMPOSITION: [camera/lens, scene depth, playfield layout, background layers, foreground, and how the game fills different screen shapes without empty bands]
CORE LOOP: [what the player repeatedly does, what creates risk, and what makes the next 30 seconds interesting]

PLAYER:
  - Sprite: [describe how the player should look — shape, colors, details]
  - Movement: [specific, responsive controls appropriate to this genre]
  - Actions: [primary action and any secondary action]
  - Stats: [starting health/lives and any resource]

PC KEYBOARD CONTROLS (REQUIRED):
  - Movement / selection: [exact keys; prefer Arrow keys and WASD]
  - Primary action: [exact key; prefer Space]
  - Confirm / start: [Enter]
  - Pause / restart: [Escape / R]
  - Every mechanic must be playable from a keyboard alone; show these exact bindings in the menu.

ENEMIES / OBSTACLES:
  - Type 1: [name — appearance — behavior — how it harms the player]
  - Type 2: [optional second enemy type]
  - Type 3: [optional — only for complex games]

PROGRESSION:
  - Objective and lose condition: [clear, achievable goals and how failure happens]
  - Difficulty scaling: [specific pacing and at least one meaningful change over time]
  - Rewards: [how score, combos, upgrades, or discoveries reward good play]

COLLECTIBLES / POWER-UPS:
  - [up to 2 useful items with appearance, effect, and rarity; use none if they do not fit]

BACKGROUND:
  - [describe at least two restrained layers of motion and how they support the playfield]

PARTICLE EFFECTS:
  - [specific feedback for actions, hits, pickups, and game end; avoid effects that obscure play]

HUD:
  - [readable placement for score, health, objective/progress, and concise control hints]

AUDIO EFFECTS:
  - [list sounds to synthesise — shoot: short buzz, explosion: low boom, collect: rising chirp, game over: descending tone]

SPECIAL MECHANIC:
  - [one distinctive mechanic that creates a meaningful choice or changes the core loop]`;

/**
 * Takes a raw user prompt (short or long) and returns a rich, structured
 * Game Design Brief that the main generator model can use to produce a
 * much higher-quality game.
 */
export async function enhancePrompt(
  rawPrompt: string,
  options: { signal?: AbortSignal; timeoutMs?: number } = {}
): Promise<string> {
  console.log(`[enhancer] Expanding prompt: "${rawPrompt.slice(0, 80)}"`);

  try {
    const response = await openai.chat.completions.create({
      model: ENHANCER_MODEL,
      messages: [
        { role: 'system', content: ENHANCER_SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Game idea: ${rawPrompt}\n\nExpand this into a complete Game Design Brief.`,
        },
      ],
      temperature: 1,
      max_tokens: 1200,
      reasoning_effort: 'low',
    }, {
      ...(options.signal ? { signal: options.signal } : {}),
      ...(options.timeoutMs !== undefined ? { timeout: options.timeoutMs } : {}),
    });

    const brief = response.choices[0]?.message?.content?.trim() ?? '';

    if (brief.length < 50) {
      console.warn('[enhancer] Brief too short, falling back to raw prompt.');
      return rawPrompt;
    }

    console.log(`[enhancer] ✅ Brief generated (${brief.length} chars)`);
    return brief;

  } catch (err: any) {
    // Non-fatal — if enhancement fails, fall back to the original prompt
    console.error(`[enhancer] ⚠️ Failed (${err.message}), using raw prompt as fallback.`);
    return rawPrompt;
  }
}
