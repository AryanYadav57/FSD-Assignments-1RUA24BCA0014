import { Script } from 'node:vm';

/**
 * Cleans raw model output and validates it is a playable HTML5 game.
 * Returns the clean HTML string or throws a descriptive error.
 */
export function cleanAndValidateHtml(
  rawOutput: string,
  options: { requireWebGL?: boolean } = {}
): string {
  let html = rawOutput.trim();

  // 1. Strip markdown fences — handle all common variants
  // e.g. ```html ... ``` or ``` ... ```
  html = html.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '').trim();

  // 2. If the model prepended commentary before <!DOCTYPE html>, strip it
  const doctypeIdx = html.toLowerCase().indexOf('<!doctype html');
  const htmlTagIdx = html.toLowerCase().indexOf('<html');
  const startIdx = doctypeIdx !== -1 ? doctypeIdx : htmlTagIdx !== -1 ? htmlTagIdx : -1;

  if (startIdx > 0) {
    console.warn(`[validate] Stripped ${startIdx} chars of preamble before HTML start.`);
    html = html.slice(startIdx);
  }

  // 3. If the model appended commentary after </html>, strip it
  const endIdx = html.toLowerCase().lastIndexOf('</html>');
  if (endIdx !== -1 && endIdx < html.length - 8) {
    console.warn(`[validate] Stripped trailing content after </html>.`);
    html = html.slice(0, endIdx + 7);
  }

  html = html.trim();

  // 4. Validate it contains the core HTML structure
  const lower = html.toLowerCase();
  if (!lower.includes('<html') && !lower.includes('<!doctype')) {
    throw new Error('Output does not appear to be valid HTML — missing <html> tag.');
  }
  if (!lower.includes('<canvas')) {
    throw new Error('Output is missing a <canvas> element — not a canvas game.');
  }

  // 5. Must have some JS (canvas games always need JS)
  if (!lower.includes('<script')) {
    throw new Error('Output is missing JavaScript — game cannot run.');
  }
  if (!lower.includes('</html>')) {
    throw new Error('Output appears incomplete — missing closing </html> tag.');
  }

  // Catch the most common hard failure before returning a game: invalid inline
  // JavaScript. Compile only; never execute model-generated code on the server.
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)];
  const classicScripts = scripts.flatMap((match) => {
      const attributes = match[1] ?? '';
      const body = match[2] ?? '';
      const typeMatch = attributes.match(/\btype\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
      const type = (typeMatch?.[1] ?? typeMatch?.[2] ?? typeMatch?.[3] ?? '').toLowerCase();
      return body.trim() && type !== 'module' && (!type || /javascript|ecmascript/.test(type))
        ? [body]
        : [];
    });
  if (classicScripts.length) {
    try {
      new Script(classicScripts.join('\n;\n'), { filename: 'generated-game.js' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'unknown syntax error';
      throw new Error(`Generated game has invalid JavaScript: ${message}`);
    }
  }

  if (options.requireWebGL) {
    if (!/getContext\s*\(\s*['"]webgl2?['"]/i.test(html)) {
      throw new Error('A 3D request must use a WebGL or WebGL2 canvas renderer.');
    }
    if (!lower.includes('gl_position') || !lower.includes('depth_test')) {
      throw new Error('The requested 3D game is missing shader geometry or depth testing.');
    }
  }

  // Keyboard support is required for the desktop-first experience. Require
  // both an actual key event listener and code that reads the pressed key.
  const hasKeyHandler = (eventName: 'keydown' | 'keyup') =>
    new RegExp(`addEventListener\\s*\\(\\s*['"]${eventName}['"]`, 'i').test(html);
  if (!hasKeyHandler('keydown') || !hasKeyHandler('keyup')) {
    throw new Error('Game must handle both keydown and keyup for desktop controls.');
  }
  if (!/(?:\b(?:event|evt|e)\s*\.\s*(?:key|code)\b|\bkeyCode\b)/i.test(html)) {
    throw new Error('Game does not map keyboard input to controls.');
  }

  // 6. Block real external network calls (src/href pointing to http/https)
  // Whitelist data: URIs which are fine.
  if (/(src|href)\s*=\s*['"]https?:\/\//i.test(html)) {
    throw new Error('Generated game contains external network calls which are not allowed.');
  }

  // 7. Size guard — cap at 200 KB (doubled from 100 KB to allow richer games)
  const sizeKb = Buffer.byteLength(html, 'utf8') / 1024;
  if (sizeKb > 200) {
    throw new Error(`Generated HTML is too large (${sizeKb.toFixed(1)} KB). Max is 200 KB.`);
  }

  console.log(`[validate] OK — ${sizeKb.toFixed(1)} KB`);
  return html;
}
