import { createElement, useEffect, useRef } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

/** Theme-aware, interactive typographic vortex inspired by Spawn.gg's content architecture motif. */
export function ContentVortex({ color, accent, background, phrase = 'THE GAME IS THE CONTENT · SPAWN.GG · ' }: { color: string; accent: string; background: string; phrase?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d', { alpha: true });
    if (!canvas || !context) return;

    let frame = 0;
    let width = 1;
    let height = 1;
    let angle = 0;
    let targetTilt = 0;
    let tilt = 0;
    let pulse = 0;
    let lastFrame = 0;
    let reducedMotion = false;
    let motionQuery: MediaQueryList | undefined;
    try {
      motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      reducedMotion = motionQuery.matches;
    } catch { /* Animate gently if the media query is unavailable. */ }

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      if (!frame) frame = window.requestAnimationFrame(render);
    };

    const drawGlyph = (glyph: string, radius: number, theta: number, alpha: number) => {
      const x = width * 0.53 + Math.cos(theta) * radius;
      const y = height * 0.51 + Math.sin(theta) * radius * 0.78;
      context.save();
      context.translate(x, y);
      context.rotate(theta + Math.PI / 2 + tilt * Math.cos(theta));
      context.globalAlpha = alpha;
      context.fillText(glyph, 0, 0);
      context.restore();
    };

    const render = (time: number) => {
      frame = 0;
      if (!reducedMotion && time - lastFrame < 30) {
        frame = window.requestAnimationFrame(render);
        return;
      }
      const dt = Math.min(.05, (time - (lastFrame || time)) / 1000);
      lastFrame = time;
      if (!reducedMotion) angle += dt * .13;
      tilt += (targetTilt - tilt) * .045;
      pulse = Math.max(0, pulse - dt * .8);

      context.globalAlpha = 1;
      context.clearRect(0, 0, width, height);
      context.font = `500 ${Math.max(8, Math.min(14, width / 76))}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
      context.textBaseline = 'middle';
      const phraseWidth = context.measureText(phrase).width || 1;
      const maxRadius = Math.hypot(width * .66, height * .65);
      const ringGap = Math.max(19, Math.min(28, width / 30));
      const rings = Math.ceil(maxRadius / ringGap);

      for (let ring = rings; ring > 0; ring--) {
        const radius = ring * ringGap;
        const circumference = Math.PI * 2 * radius;
        const repeats = Math.max(1, Math.ceil(circumference / phraseWidth));
        const ringPhrase = phrase.repeat(Math.min(8, repeats));
        const circumferencePerText = circumference / repeats;
        let cursor = 0;
        for (const glyph of ringPhrase) {
          const advance = context.measureText(glyph).width;
          if (cursor >= circumferencePerText) break;
          const theta = angle + ring * .045 + (cursor / circumference) * Math.PI * 2;
          const depth = .5 + .5 * Math.sin(theta + tilt * 2);
          const alpha = .2 + depth * .64;
          context.font = `${ring < 4 ? '700' : '500'} ${Math.max(8, Math.min(14, width / 76))}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
          context.fillStyle = pulse > 0 && ring < 6 ? accent : color;
          drawGlyph(glyph, radius, theta, alpha);
          cursor += advance;
        }
        context.globalAlpha = 1;
        context.strokeStyle = `${color}${Math.round((.035 + (ring % 3) * .012) * 255).toString(16).padStart(2, '0')}`;
        context.lineWidth = 1;
        context.beginPath();
        context.ellipse(width * .53, height * .51, radius, radius * .78, angle * .035, 0, Math.PI * 2);
        context.stroke();
      }

      if (!reducedMotion || pulse > 0) frame = window.requestAnimationFrame(render);
    };

    const onPointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      targetTilt = Math.max(-.32, Math.min(.32, ((event.clientX - bounds.left) / Math.max(1, bounds.width) - .5) * .6));
      if (!frame) frame = window.requestAnimationFrame(render);
    };
    const onPointerLeave = () => { targetTilt = 0; };
    const onActivate = () => { pulse = 1.2; if (!frame) frame = window.requestAnimationFrame(render); };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Enter' || event.code === 'Space') { event.preventDefault(); onActivate(); }
    };
    const onMotionChange = (event: MediaQueryListEvent) => { reducedMotion = event.matches; if (!frame) frame = window.requestAnimationFrame(render); };

    resize();
    canvas.addEventListener('pointermove', onPointerMove, { passive: true });
    canvas.addEventListener('pointerleave', onPointerLeave, { passive: true });
    canvas.addEventListener('pointerdown', onActivate);
    canvas.addEventListener('keydown', onKeyDown);
    motionQuery?.addEventListener('change', onMotionChange);
    window.addEventListener('resize', resize);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('pointerdown', onActivate);
      canvas.removeEventListener('keydown', onKeyDown);
      motionQuery?.removeEventListener('change', onMotionChange);
      window.removeEventListener('resize', resize);
    };
  }, [color, accent, background, phrase]);

  if (Platform.OS !== 'web') return <View accessibilityLabel="Interactive Spawn.gg typographic vortex" style={[styles.nativeFallback, { borderColor: accent, backgroundColor: background }]} />;

  const canvasElement = createElement('canvas', {
    ref: canvasRef,
    role: 'button',
    tabIndex: 0,
    'aria-label': 'Interactive typographic vortex. Move the pointer to tilt the rings, or click, tap, Enter, or Space to spark them.',
    'aria-keyshortcuts': 'Enter Space',
    style: { display: 'block', width: '100%', height: '100%', touchAction: 'pan-y', outline: 'none', cursor: 'crosshair' },
  }) as any;

  return <View style={StyleSheet.absoluteFill}>{canvasElement}</View>;
}

const styles = StyleSheet.create({ nativeFallback: { width: '100%', aspectRatio: 1, borderWidth: 1, borderRadius: 999, backgroundColor: '#08090a' } });
