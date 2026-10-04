import { Router, Request, Response } from 'express';
import { generateGameModule, generateThreeGameModule, generateRacerBlueprint, generateDesignQuestions, createFallbackDesignQuestions, repairGameModule, repairThreeGameModule, AVAILABLE_MODELS, SAME_PROVIDER_RECOVERY_MODEL, PartialModelOutputError, ModelId } from '../services/nvidia';
import { enhancePrompt } from '../services/enhancer';
import { buildRuntimeHtml, parseGameModuleV1 } from '../runtime/v1';
import { buildRuntimeHtmlV2, parseGameModuleV2 } from '../runtime/v2';
import { buildRacerFoundation, fallbackRacerBlueprint, normalizeRacerBlueprint } from '../runtime/v2/racer-foundation';
import { buildSurvivalFoundation } from '../runtime/v2/survival-foundation';
import { runBrowserQa } from '../services/browser-qa';

const router = Router();

function getAiProviderError(error: unknown): string | null {
  const status = typeof error === 'object' && error !== null && 'status' in error
    ? Number((error as { status?: unknown }).status)
    : 0;
  if (status === 401 || status === 403) {
    return 'NVIDIA NIM denied model inference. Check that the API key is active and has access to Kimi K3.';
  }
  if (status === 402) {
    return 'NVIDIA NIM could not accept this request because of account or service limits. Wait for in-flight requests to finish, then try again.';
  }
  if (status === 429) return 'NVIDIA NIM is rate limiting requests right now. Wait a little and try again.';
  if (status === 422) return 'NVIDIA NIM rejected the model request. Check the model request settings and try again.';
  if (status >= 500) return 'NVIDIA NIM model inference is temporarily unavailable. Try again shortly.';
  return null;
}

function isNonRetryableProviderError(error: unknown): boolean {
  const status = typeof error === 'object' && error !== null && 'status' in error
    ? Number((error as { status?: unknown }).status)
    : 0;
  return [401, 402, 403, 422, 429].includes(status);
}

// Return the list of available models so the frontend can populate its selector
router.get('/models', (_req: Request, res: Response) => {
  return res.status(200).json({ models: AVAILABLE_MODELS });
});

router.post('/clarify', async (req: Request, res: Response) => {
  const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt.trim() : '';
  if (prompt.length < 2) return res.status(400).json({ error: 'Add a game idea first.' });
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 70_000);
  timer.unref?.();
  try {
    const questions = await generateDesignQuestions(prompt.slice(0, 3000), { signal: controller.signal, timeoutMs: 65_000 });
    return res.status(200).json({ questions });
  } catch (error) {
    console.error('[clarify] Could not prepare design questions:', error instanceof Error ? error.message : error);
    return res.status(200).json({
      questions: createFallbackDesignQuestions(prompt.slice(0, 3000)),
      fallback: true,
    });
  } finally {
    clearTimeout(timer);
  }
});

router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { prompt, modelId } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 2) {
      return res.status(400).json({ error: 'Prompt is required (at least 2 characters).' });
    }

    const rawChoices: unknown[] = Array.isArray(req.body?.clarifications) ? req.body.clarifications : [];
    const designChoices = rawChoices.slice(0, 5).flatMap((item: any) => {
      if (typeof item?.dimension !== 'string' || typeof item?.label !== 'string') return [];
      return [`${item.dimension.slice(0, 32)}: ${item.label.trim().slice(0, 90)}`];
    });
    const generationPrompt = designChoices.length
      ? `${prompt.trim()}\n\nPLAYER'S GAME DESIGN CHOICES:\n${designChoices.map((choice) => `- ${choice}`).join('\n')}`
      : prompt.trim();
    const requiresWebGL = /\b3\s*d\b|three[\s-]?dimensional|\b(first|third)[ -]?person\b/i.test(generationPrompt);
    const usesSharedRuntime = !requiresWebGL;

    const primaryModel = (AVAILABLE_MODELS.find((m) => m.isDefault)?.id ?? AVAILABLE_MODELS[0].id) as ModelId;
    const validModelIds = AVAILABLE_MODELS.map((m) => m.id);
    const chosenModel: ModelId = validModelIds.includes(modelId) ? modelId as ModelId : primaryModel;

    // First hybrid-runtime vertical slice: the model chooses safe race content
    // settings while Spawn.gg's tested module owns controls and race rules.
    const is3dRacer = requiresWebGL && /\b(race|racing|racer|car|kart|drive|driving|vehicle)\b/i.test(generationPrompt);
    if (is3dRacer) {
      let blueprint = fallbackRacerBlueprint(generationPrompt);
      let usedModel = chosenModel;
      let qualityNotice: string | undefined;
      try {
        const rawBlueprint = await generateRacerBlueprint(generationPrompt, chosenModel);
        let parsedBlueprint: unknown;
        try { parsedBlueprint = JSON.parse(rawBlueprint); }
        catch { throw new Error('The AI returned invalid race settings.'); }
        blueprint = normalizeRacerBlueprint(parsedBlueprint, generationPrompt);
      } catch (error) {
        const providerMessage = getAiProviderError(error);
        qualityNotice = `The race was built with Spawn.gg's reliable defaults because AI customization was unavailable${providerMessage ? `: ${providerMessage}` : '.'}`;
        console.warn('[generate] Using local 3D racer blueprint:', error instanceof Error ? error.message : error);
      }

      const racer = buildRacerFoundation(blueprint);
      const racerHtml = await buildRuntimeHtmlV2(racer);
      const browserQa = await runBrowserQa(racerHtml, 12_000, 2, true);
      if (!browserQa.passed) {
        qualityNotice = `${qualityNotice ? `${qualityNotice} ` : ''}Automated play checks found an issue: ${browserQa.diagnostics}`;
        console.warn('[generate] Authored racer foundation QA:', browserQa.diagnostics);
      }
      return res.status(200).json({
        id: `game-${Date.now()}`,
        title: prompt.substring(0, 40),
        html: racerHtml,
        model: usedModel,
        originalPrompt: prompt.trim(),
        enrichedBrief: null,
        runtimeVersion: 2,
        browserQa,
        qualityNotice,
      });
    }

    // Zombie prompts use an authored survival loop instead of asking the model
    // to invent both the rendering setup and the combat rules from scratch.
    const is3dZombieSurvival = requiresWebGL && /\b(zombie|undead|infected)\b/i.test(generationPrompt);
    if (is3dZombieSurvival) {
      const survival = buildSurvivalFoundation(generationPrompt);
      const survivalHtml = await buildRuntimeHtmlV2(survival);
      const browserQa = await runBrowserQa(survivalHtml, 12_000, 2, true);
      const qualityNotice = browserQa.passed
        ? 'Built with Spawn.gg’s tested 3D survival foundation for reliable movement, combat, health, and restart.'
        : `Survival game created, but an automated play check found an issue: ${browserQa.diagnostics}`;
      if (!browserQa.passed) console.warn('[generate] Authored zombie survival foundation QA:', browserQa.diagnostics);
      return res.status(200).json({
        id: `game-${Date.now()}`,
        title: survival.title,
        html: survivalHtml,
        model: 'spawn-survival-foundation-v1',
        originalPrompt: prompt.trim(),
        enrichedBrief: null,
        runtimeVersion: 2,
        browserQa,
        qualityNotice,
      });
    }

    // ── Stage 1: Prompt Enhancement ──────────────────────────────────────────
    // A fast model expands the short user prompt into a rich Game Design Brief.
    // Falls back to the raw prompt automatically if enhancement fails.
    // Five structured answers already give the model a compact design brief.
    // Skip the extra hosted-model round-trip for these short prompts.
    const shouldEnhance = generationPrompt.length > 800;
    const enrichedBrief = shouldEnhance
      ? await enhancePrompt(generationPrompt)
      : generationPrompt;
    const wasEnhanced = shouldEnhance && enrichedBrief !== generationPrompt;

    console.log(`[generate] Enhancement: ${wasEnhanced ? '✅ enriched' : '⚠️ used raw prompt'}`);

    // ── Stage 2: Game Generation ─────────────────────────────────────────────
    // Validate the requested model, fall back to default if not recognised
    const recoveryModel = SAME_PROVIDER_RECOVERY_MODEL;

    let finalHtml = '';
    let finalModuleJson = '';
    let usedModel = chosenModel;
    // Keep all attempts on the selected NVIDIA model; no other provider keys are used.
    const modelsToTry = [chosenModel, recoveryModel];
    let lastError: Error | null = null;
    let partialOutput = '';
    const failedAttempts: string[] = [];

    for (const [attemptIndex, model] of modelsToTry.entries()) {
      try {
        console.log(`[generate] model=${model} attempt=${attemptIndex + 1}/${modelsToTry.length}`);
        let rawOutput: string;
        if (partialOutput) {
          const partialDiagnostics = 'The previous model stream timed out before finishing. Complete and repair this partial response into a complete, valid game module. Preserve its game idea and working code.';
          rawOutput = usesSharedRuntime
            ? await repairGameModule(enrichedBrief, partialOutput, partialDiagnostics, model)
            : await repairThreeGameModule(enrichedBrief, partialOutput, partialDiagnostics, model, { compact: true });
          partialOutput = '';
        } else {
          rawOutput = usesSharedRuntime
            ? await generateGameModule(enrichedBrief, model, {
              ...(lastError ? { repairFeedback: lastError.message } : {}),
            })
            : await generateThreeGameModule(enrichedBrief, model, {
              ...(lastError ? { repairFeedback: lastError.message } : {}),
              // Some hosted models return empty completions under JSON mode.
              // Keep strict JSON on the primary pass and the explicit contract on recovery.
              jsonMode: attemptIndex === 0,
              compact: attemptIndex > 0,
            });
        }

        if (!rawOutput || rawOutput.trim().length < 50) {
          throw new Error('Model returned an empty or too-short response.');
        }

        if (usesSharedRuntime) {
          let parsed: ReturnType<typeof parseGameModuleV1>;
          try {
            parsed = parseGameModuleV1(rawOutput);
          } catch (parseError) {
            const diagnostics = parseError instanceof Error ? parseError.message : String(parseError);
            rawOutput = await repairGameModule(enrichedBrief, rawOutput, diagnostics, model);
            parsed = parseGameModuleV1(rawOutput);
          }
          finalHtml = buildRuntimeHtml(parsed);
          } else {
            let parsed: ReturnType<typeof parseGameModuleV2>;
            try {
              parsed = parseGameModuleV2(rawOutput);
            } catch (parseError) {
              const diagnostics = parseError instanceof Error ? parseError.message : String(parseError);
              // If repair fails, let the next model repair this draft instead
              // of spending another long call generating a different game.
              partialOutput = rawOutput;
              rawOutput = await repairThreeGameModule(enrichedBrief, rawOutput, diagnostics, model);
              partialOutput = '';
              parsed = parseGameModuleV2(rawOutput);
            }
          finalHtml = await buildRuntimeHtmlV2(parsed);
        }
        finalModuleJson = rawOutput;
        usedModel = model;
        console.log(`[generate] ✅ valid first pass model=${model}`);
        break;
      } catch (err: any) {
        lastError = err;
        if (err instanceof PartialModelOutputError) partialOutput = err.partialOutput;
        failedAttempts.push(`${model}: ${err.message}`);
        console.error(`[generate] ❌ model=${model}: ${err.message}`);
        if (isNonRetryableProviderError(err)) break;
        // If both configured models have already produced something usable
        // but a response was cut off, spend one bounded final pass repairing
        // that draft instead of starting yet another full game generation.
        if (attemptIndex === modelsToTry.length - 1 && partialOutput && modelsToTry.length < 3) {
          modelsToTry.push(chosenModel);
        }
      }
    }

    if (!finalHtml) {
      if (lastError && isNonRetryableProviderError(lastError)) throw lastError;
      if (failedAttempts.length) {
        console.error(`[generate] all attempts failed: ${failedAttempts.join(' | ')}`);
        if (lastError?.message.toLowerCase().includes('timed out')) {
          throw new Error('NVIDIA NIM stopped responding before a complete game was ready. Please retry shortly.');
        }
        throw new Error(`The game model did not return a usable draft after ${failedAttempts.length} attempts. Last issue: ${lastError?.message ?? 'empty model response'}`);
      }
      throw lastError ?? new Error('All available models failed to generate a valid game.');
    }

    let browserQa: { passed: boolean; diagnostics: string } | null = null;
    {
      try {
        browserQa = await runBrowserQa(finalHtml, 12_000, usesSharedRuntime ? 1 : 2, !usesSharedRuntime);
        let repairAttempt = 0;
        const maxQaRepairs = 2;
        while (!browserQa.passed && repairAttempt < maxQaRepairs && !browserQa.diagnostics.startsWith('No Chromium browser is available')) {
          repairAttempt++;
          const repairModel = repairAttempt === 1
            ? usedModel
            : usedModel === primaryModel ? recoveryModel : primaryModel;
          console.warn(`[generate] Browser QA repair ${repairAttempt}/${maxQaRepairs} model=${repairModel}: ${browserQa.diagnostics}`);
          let repairSource: string;
          if (usesSharedRuntime) {
            repairSource = await repairGameModule(enrichedBrief, finalModuleJson, browserQa.diagnostics, repairModel);
          } else {
            const compactRepair = repairAttempt > 1;
            try {
              repairSource = await repairThreeGameModule(enrichedBrief, finalModuleJson, browserQa.diagnostics, repairModel, { compact: compactRepair });
            } catch (repairError) {
              // A length-limited/empty repair should not discard the playable
              // draft or fail the whole generation. Retry once with a shorter
              // repair contract and the other configured model.
              if (isNonRetryableProviderError(repairError)) throw repairError;
              if (compactRepair) throw repairError;
              const partialRepair = repairError instanceof PartialModelOutputError ? repairError.partialOutput : '';
              const repairInput = partialRepair.trim().length > 100 ? partialRepair : finalModuleJson;
              const retryModel = repairModel === primaryModel ? recoveryModel : primaryModel;
              const retryDiagnostics = `${browserQa.diagnostics}\n\nThe previous repair response was unusable: ${repairError instanceof Error ? repairError.message : String(repairError)}. Make only the smallest fix. Keep the returned module compact and complete.`;
              console.warn(`[generate] Retrying truncated 3D repair with compact output model=${retryModel}`);
              repairSource = await repairThreeGameModule(enrichedBrief, repairInput, retryDiagnostics, retryModel, { compact: true });
              usedModel = retryModel;
            }
          }
          const repairedHtml = usesSharedRuntime
            ? buildRuntimeHtml(parseGameModuleV1(repairSource))
            : await buildRuntimeHtmlV2(parseGameModuleV2(repairSource));
          finalHtml = repairedHtml;
          finalModuleJson = repairSource;
          usedModel = repairModel;
          browserQa = await runBrowserQa(repairedHtml, 12_000, usesSharedRuntime ? 1 : 2, !usesSharedRuntime);
        }
        if (!browserQa.passed && !browserQa.diagnostics.startsWith('No Chromium browser is available')) {
          throw new Error(`Browser QA still fails after ${repairAttempt} repair${repairAttempt === 1 ? '' : 's'}: ${browserQa.diagnostics}`);
        }
        if (repairAttempt > 0 && browserQa.passed) console.log(`[generate] Browser QA passed after ${repairAttempt} repair(s).`);
      } catch (error) {
        console.error('[generate] Browser QA:', error instanceof Error ? error.message : error);
        const providerStatus = typeof error === 'object' && error !== null && 'status' in error
          ? Number((error as { status?: unknown }).status)
          : 0;
        if ([401, 402, 403, 429].includes(providerStatus) && browserQa && !browserQa.passed) {
          const reason = getAiProviderError(error) ?? 'The model provider is temporarily unavailable.';
          // A failed paid repair must not throw away a complete, playable
          // draft that already passed module validation and loaded in QA.
          browserQa = {
            passed: false,
            diagnostics: `${browserQa.diagnostics}\nAutomatic repair was skipped: ${reason} The generated draft is still available to play.`,
          };
          console.warn('[generate] Returning the validated draft without a repaired QA pass.');
        } else if (isNonRetryableProviderError(error)) throw error;
        else if (error instanceof Error && error.message.startsWith('No Chromium browser is available')) {
          browserQa = { passed: false, diagnostics: error.message };
        } else if (error instanceof Error && error.message.startsWith('Browser QA still fails')) {
          throw error;
        } else if (error instanceof Error && error.message.startsWith('Browser QA failed')) {
          throw error;
        } else if (browserQa && !browserQa.passed) {
          const repairIssue = error instanceof Error ? error.message : String(error);
          throw new Error(`Browser QA repair could not complete: ${repairIssue}. First QA issue: ${browserQa.diagnostics}`);
        }
      }
    }

    // Both shared runtimes receive lifecycle/input QA and one bounded repair attempt.

    return res.status(200).json({
      id: `game-${Date.now()}`,
      title: prompt.substring(0, 40),
      html: finalHtml,
      model: usedModel,
      originalPrompt: prompt.trim(),
      enrichedBrief: wasEnhanced ? enrichedBrief : null,
      runtimeVersion: usesSharedRuntime ? 1 : 2,
      browserQa,
      qualityNotice: browserQa?.diagnostics.split('\n').find((line) => line.startsWith('Automatic repair was skipped:'))
        ?.replace('Automatic repair was skipped: ', 'The game is ready, but automatic repair was skipped: '),
    });

  } catch (error: any) {
    console.error('[generate] Fatal error:', error.message);
    const timeoutFailure = /timed out|timeout/i.test(error.message ?? '');
    const providerError = getAiProviderError(error);
    const providerStatus = typeof error === 'object' && error !== null && 'status' in error ? Number(error.status) : 0;
    const statusCode = timeoutFailure ? 504 : providerError && [401, 402, 403, 422, 429].includes(providerStatus) ? providerStatus : 500;
    return res.status(statusCode).json({
      error: providerError ?? error.message ?? 'Failed to generate game. Please try a different prompt.',
    });
  }
});

export default router;
