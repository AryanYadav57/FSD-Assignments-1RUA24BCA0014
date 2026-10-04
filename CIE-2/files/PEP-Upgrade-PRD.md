# PRD: Prompt Enhancement Pipeline (PEP)
## spawn.gg — Upgrade v2.0

> **Status:** Planned  
> **Author:** Aryan Yadav  
> **Project:** spawn.gg — AI Game Generator (CIE-2)

---

## 1. Problem Statement

Currently, when a user types a short prompt like `"zombie game"` or `"snake"`, the main generation model receives very little context. This leads to:

- Generic, low-quality game output
- Missing mechanics (no scoring, no lives, no progression)
- Poor visual design decisions
- Inconsistent results between generations

The model is capable of producing excellent games — it just needs more context to do so. Users shouldn't have to be game designers to get a great game.

---

## 2. Proposed Solution — Prompt Enhancement Pipeline (PEP)

Introduce a **two-stage AI pipeline** before every game generation:

```
[User Prompt] → [Stage 1: Enhancer] → [Enriched Brief] → [Stage 2: Generator] → [Game HTML]
```

### Stage 1 — Prompt Enhancer (Fast, small model)
A lightweight model reads the user's raw prompt and produces a structured **Game Design Brief**. This runs fast (< 5 seconds) and costs very little.

### Stage 2 — Game Generator (Existing pipeline)  
The enriched Game Design Brief replaces the raw user prompt. The main model now has full context and produces a dramatically better game.

---

## 3. Game Design Brief Schema (Stage 1 Output)

```
GAME TITLE: [creative name based on the concept]
GENRE: [Platformer | Shooter | Puzzle | RPG | Racing | Survival | Arcade | Tower Defense]
PLAYER:
  - Movement: [how the player moves]
  - Actions: [shoot, jump, dash, etc.]
  - Stats: [health, lives, stamina, ammo, etc.]
ENEMIES / OBSTACLES:
  - Type 1: [name, behavior, appearance, spawn pattern]
  - Type 2: [optional]
PROGRESSION:
  - Win condition: [what the player must achieve]
  - Lose condition: [what causes game over]
  - Difficulty scaling: [how it gets harder]
  - Levels / Waves: [how many, what changes]
POWER-UPS / ITEMS:
  - [list of collectable items and effects]
VISUAL STYLE:
  - Color palette: [dark sci-fi / bright cartoon / neon cyberpunk / etc.]
  - Background: [scrolling space / parallax forest / animated city / etc.]
  - Particle effects: [explosions, sparks, blood, magic, etc.]
AUDIO:
  - Sound effects: [shoot, jump, collect, die, level up, etc.]
  - Music mood: [upbeat, tense, chill, dramatic]
HUD ELEMENTS:
  - [score, health bar, ammo counter, wave number, lives, timer, etc.]
SPECIAL MECHANICS:
  - [any unique mechanic specific to this game concept]
```

---

## 4. Technical Implementation Plan

### 4.1 New File: `server/src/services/enhancer.ts`

```typescript
export async function enhancePrompt(rawPrompt: string): Promise<string> {
  // Uses GPT-OSS 20B (fast) with a specialised system prompt
  // Returns a structured Game Design Brief string
}
```

### 4.2 Updated File: `server/src/routes/generate.ts`

```
POST /api/generate
  ↓
1. Receive raw { prompt, modelId } from frontend
2. Call enhancer.enhancePrompt(prompt) → enrichedBrief
3. Call generateGameHtml(enrichedBrief, modelId) → rawHtml
4. Call cleanAndValidateHtml(rawHtml) → finalHtml
5. Return { html, model, originalPrompt, enrichedBrief }
```

### 4.3 New API Response Fields

```json
{
  "id": "game-1234567890",
  "html": "<!DOCTYPE html>...",
  "model": "openai/gpt-oss-120b",
  "originalPrompt": "zombie game",
  "enrichedBrief": "GAME TITLE: Dead Zone Survival\nGENRE: Top-down Survival Shooter\n..."
}
```

---

## 5. UX Changes

### 2-Stage Loading Progress
Currently there is a single spinner. With PEP, show a 2-stage indicator:

```
Stage 1 ●───────────────── Stage 2
🧠 Designing your game...   ⚙️ Building your game...
```

### Prompt Preview Panel (Optional)
On the Player screen, a collapsible section shows:
> **What the AI designed:**  
> *"Top-down zombie survival — WASD + mouse aim, 3 zombie types, ammo drops, health kits, wave-based difficulty, neon green palette..."*

---

## 6. Estimated Impact

| Metric | Before PEP | After PEP |
|--------|-----------|-----------|
| Quality from simple prompts | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| Games with complete mechanics | ~40% | ~90% |
| Extra generation time | — | +5–8 seconds |
| Games with scoring + lives | ~50% | ~95% |
| Games with particle effects | ~30% | ~85% |

---

## 7. Enhancer System Prompt Design

```
You are a professional game designer for HTML5 canvas games.

The user will give you a short game idea (1–10 words). 
Your job is to expand it into a complete, structured Game Design Brief.

RULES:
- Be specific and creative — invent interesting mechanics and visual themes.
- Output ONLY the structured brief. No preamble, no explanation.
- Make the game fun and well-balanced.
- The game must be achievable in a single HTML5 canvas file.
- Always include: genre, controls, scoring, lives, progression, visual style, HUD elements.
```

---

## 8. Implementation Priority

| Task | Priority | Effort |
|------|----------|--------|
| `enhancer.ts` service | 🔴 High | Small (1 file) |
| Update `generate.ts` route | 🔴 High | Small (~15 lines) |
| 2-stage loading UI | 🟡 Medium | Medium |
| Brief display panel on Player screen | 🟢 Low | Medium |

---

## 9. Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Enhancer adds 5–10s latency | Use fastest model; show progress UI |
| Enhancer misinterprets niche concepts | Pass original prompt alongside brief |
| Rate limit hit on 2 API calls | Cache enhanced prompts by input hash |
| Enhancer produces poor brief | Validate brief has minimum required sections |

---

## 10. Success Criteria

- [ ] 1-word prompts ("snake", "pong") generate games with complete mechanics
- [ ] Generated games consistently have: score, lives, game-over screen, difficulty progression
- [ ] Simple prompts produce visually distinct, themed games
- [ ] Total pipeline time (enhance + generate) stays under 90 seconds
