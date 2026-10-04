import { createElement, useEffect, useRef } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

type Point3D = { x: number; y: number; z: number };
type ScreenPoint = Point3D & { depth: number; radius: number };
type Synapse = { from: number; to: number };
type Signal = { edge: number; direction: 1 | -1; progress: number; speed: number };

const NODE_COUNT = 224;
const NEIGHBORS_PER_NODE = 5;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

function colorWithAlpha(hex: string, alpha: number) {
  const value = hex.replace('#', '');
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function createNeuralNetwork() {
  const nodes: Point3D[] = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const y = 1 - (i / (NODE_COUNT - 1)) * 2;
    const ring = Math.sqrt(1 - y * y);
    const angle = GOLDEN_ANGLE * i;
    const ripple = 1 + 0.035 * Math.sin(i * 2.47) + 0.02 * Math.cos(i * 0.73);
    nodes.push({ x: Math.cos(angle) * ring * ripple, y: y * ripple, z: Math.sin(angle) * ring * ripple });
  }

  const edges: Synapse[] = [];
  const edgeByPair = new Map<string, number>();
  const neighbors: number[][] = Array.from({ length: NODE_COUNT }, () => []);
  for (let i = 0; i < nodes.length; i++) {
    const nearest = nodes
      .map((point, j) => ({ j, score: i === j ? -2 : nodes[i].x * point.x + nodes[i].y * point.y + nodes[i].z * point.z }))
      .sort((a, b) => b.score - a.score)
      .slice(0, NEIGHBORS_PER_NODE);
    for (const { j } of nearest) {
      const from = Math.min(i, j);
      const to = Math.max(i, j);
      const key = `${from}:${to}`;
      if (edgeByPair.has(key)) continue;
      edgeByPair.set(key, edges.length);
      edges.push({ from, to });
      neighbors[from].push(edges.length - 1);
      neighbors[to].push(edges.length - 1);
    }
  }
  return { nodes, edges, neighbors };
}

const NETWORK = createNeuralNetwork();

/** Interactive, theme-aware neural mesh with traveling impulses along its synapses. */
export function HeroArtwork({ color, accent }: { color: string; accent: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d', { alpha: true });
    if (!canvas || !context) return;

    let frame = 0;
    let width = 0;
    let height = 0;
    let angle = 0;
    let tiltX = 0;
    let tiltY = 0;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let pointerX = 0;
    let pointerY = 0;
    let elapsed = 0;
    let previousTime = 0;
    let lastAutoFire = -1200;
    let motionQuery: MediaQueryList | undefined;
    const signals: Signal[] = [];
    const nodeEnergy = new Float32Array(NODE_COUNT);
    const projected: ScreenPoint[] = Array.from({ length: NODE_COUNT }, () => ({ x: 0, y: 0, z: 0, depth: 0, radius: 0 }));

    try { motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)'); } catch { /* Use the normal animation when unavailable. */ }

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(render);
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      schedule();
    };

    const addSignal = (edgeIndex: number, fromNode: number) => {
      if (signals.length > 90) signals.splice(0, signals.length - 90);
      const edge = NETWORK.edges[edgeIndex];
      signals.push({
        edge: edgeIndex,
        direction: edge.from === fromNode ? 1 : -1,
        progress: 0,
        speed: 0.62 + ((edge.from * 17 + edge.to * 11) % 35) / 100,
      });
    };

    const fireFromNode = (nodeIndex: number, strength = 1) => {
      nodeEnergy[nodeIndex] = Math.max(nodeEnergy[nodeIndex], strength);
      const links = NETWORK.neighbors[nodeIndex];
      for (let i = 0; i < links.length; i++) {
        addSignal(links[i], nodeIndex);
        const edge = NETWORK.edges[links[i]];
        const destination = edge.from === nodeIndex ? edge.to : edge.from;
        if (i < 3) nodeEnergy[destination] = Math.max(nodeEnergy[destination], strength * 0.55);
      }
    };

    const nearestNodeAt = (x: number, y: number) => {
      let closest = 0;
      let bestDistance = Number.POSITIVE_INFINITY;
      for (let i = 0; i < projected.length; i++) {
        const point = projected[i];
        const distance = (point.x - x) ** 2 + (point.y - y) ** 2;
        if (distance < bestDistance) {
          bestDistance = distance;
          closest = i;
        }
      }
      return closest;
    };

    const onPointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointerX = event.clientX - bounds.left;
      pointerY = event.clientY - bounds.top;
      targetTiltX = ((pointerX / Math.max(bounds.width, 1)) - 0.5) * 0.38;
      targetTiltY = ((pointerY / Math.max(bounds.height, 1)) - 0.5) * 0.3;
      schedule();
    };

    const onPointerLeave = () => {
      targetTiltX = 0;
      targetTiltY = 0;
      pointerX = -10000;
      pointerY = -10000;
      schedule();
    };

    const onPointerDown = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      const clickedNode = nearestNodeAt(event.clientX - bounds.left, event.clientY - bounds.top);
      fireFromNode(clickedNode, 1.35);
      schedule();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      fireFromNode(nearestNodeAt(width * 0.5, height * 0.5), 1.35);
      schedule();
    };

    const onFocus = () => {
      // Pointer clicks also focus this canvas. Keep the focus ring for keyboard
      // navigation without leaving a large selection frame after mouse/touch.
      const keyboardFocus = canvas.matches(':focus-visible');
      canvas.style.outline = keyboardFocus ? `2px solid ${accent}` : 'none';
      canvas.style.outlineOffset = keyboardFocus ? '3px' : '0';
    };
    const onBlur = () => {
      canvas.style.outline = 'none';
      canvas.style.outlineOffset = '0';
    };

    const render = (timestamp: number) => {
      frame = 0;
      const delta = previousTime ? Math.min((timestamp - previousTime) / 1000, 0.04) : 0.016;
      previousTime = timestamp;
      const reducedMotion = Boolean(motionQuery?.matches);
      if (!reducedMotion) {
        elapsed += delta;
        angle += delta * 0.13;
        tiltX += (targetTiltX - tiltX) * 0.055;
        tiltY += (targetTiltY - tiltY) * 0.055;
      } else {
        tiltX = targetTiltX;
        tiltY = targetTiltY;
      }

      context.clearRect(0, 0, width, height);
      const scale = Math.min(width * 0.49, height * 0.47);
      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const rotateY = angle + tiltX;
      const rotateX = -0.2 + tiltY;
      const cosY = Math.cos(rotateY);
      const sinY = Math.sin(rotateY);
      const cosX = Math.cos(rotateX);
      const sinX = Math.sin(rotateX);

      for (let i = 0; i < NETWORK.nodes.length; i++) {
        const node = NETWORK.nodes[i];
        const breathing = 1 + 0.025 * Math.sin(elapsed * 1.35 + i * 0.19);
        const x0 = node.x * breathing;
        const y0 = node.y * breathing;
        const z0 = node.z * breathing;
        const x1 = x0 * cosY - z0 * sinY;
        const z1 = x0 * sinY + z0 * cosY;
        const y1 = y0 * cosX - z1 * sinX;
        const z2 = y0 * sinX + z1 * cosX;
        const perspective = 2.4 / (2.4 - z2 * 0.3);
        const depth = Math.max(0.12, Math.min(1, 0.52 + z2 * 0.42));
        projected[i] = {
          x: centerX + x1 * scale * perspective,
          y: centerY + y1 * scale * perspective,
          z: z2,
          depth,
          radius: (1.15 + depth * 1.15) * Math.min(1.15, width / 500),
        };
      }

      const aura = context.createRadialGradient(centerX, centerY, scale * 0.12, centerX, centerY, scale * 1.08);
      aura.addColorStop(0, colorWithAlpha(accent, 0.105));
      aura.addColorStop(0.56, colorWithAlpha(accent, 0.04));
      aura.addColorStop(1, colorWithAlpha(accent, 0));
      context.fillStyle = aura;
      context.fillRect(centerX - scale * 1.08, centerY - scale * 1.08, scale * 2.16, scale * 2.16);

      // Dim, hairline synapses establish the network before any pulses fire.
      for (const edge of NETWORK.edges) {
        const from = projected[edge.from];
        const to = projected[edge.to];
        const depth = (from.depth + to.depth) * 0.5;
        if ((from.z + to.z) * 0.5 < -0.55) continue;
        context.globalAlpha = 0.055 + depth * 0.1;
        context.strokeStyle = color;
        context.lineWidth = 0.55 + depth * 0.35;
        context.beginPath();
        context.moveTo(from.x, from.y);
        context.lineTo(to.x, to.y);
        context.stroke();
      }

      // A nearby pointer gently wakes its closest neuron without forcing a click.
      let hoverNode = -1;
      if (pointerX >= 0 && pointerY >= 0 && pointerX <= width && pointerY <= height) {
        hoverNode = nearestNodeAt(pointerX, pointerY);
        nodeEnergy[hoverNode] = Math.max(nodeEnergy[hoverNode], 0.22);
      }

      for (let i = 0; i < projected.length; i++) {
        const point = projected[i];
        nodeEnergy[i] = Math.max(0, nodeEnergy[i] - delta * 1.45);
        const energy = nodeEnergy[i] + (i === hoverNode ? 0.25 : 0);
        const radius = point.radius * (1 + Math.min(energy, 1.4) * 0.8);
        context.globalAlpha = 0.45 + point.depth * 0.48;
        context.fillStyle = energy > 0.16 ? accent : color;
        if (energy > 0.2) {
          context.shadowColor = accent;
          context.shadowBlur = 6 + energy * 8;
        }
        context.beginPath();
        context.arc(point.x, point.y, radius, 0, Math.PI * 2);
        context.fill();
        context.shadowBlur = 0;
      }

      if (!reducedMotion && timestamp - lastAutoFire > 1280) {
        fireFromNode(Math.floor(Math.random() * NODE_COUNT), 0.95);
        lastAutoFire = timestamp;
      }

      // Pulses race between nearby cell bodies, leaving a short luminous trail.
      for (let i = signals.length - 1; i >= 0; i--) {
        const signal = signals[i];
        signal.progress += delta * signal.speed;
        if (signal.progress >= 1) {
          signals.splice(i, 1);
          continue;
        }
        const edge = NETWORK.edges[signal.edge];
        const start = projected[signal.direction === 1 ? edge.from : edge.to];
        const end = projected[signal.direction === 1 ? edge.to : edge.from];
        const t = signal.progress;
        const trailT = Math.max(0, t - 0.16);
        const x = start.x + (end.x - start.x) * t;
        const y = start.y + (end.y - start.y) * t;
        context.globalAlpha = 0.78;
        context.strokeStyle = accent;
        context.lineWidth = 1.1;
        context.shadowColor = accent;
        context.shadowBlur = 10;
        context.beginPath();
        context.moveTo(start.x + (end.x - start.x) * trailT, start.y + (end.y - start.y) * trailT);
        context.lineTo(x, y);
        context.stroke();
        context.fillStyle = color;
        context.beginPath();
        context.arc(x, y, 2.2 + Math.sin(t * Math.PI) * 1.2, 0, Math.PI * 2);
        context.fill();
        context.shadowBlur = 0;
      }
      context.globalAlpha = 1;

      if (!reducedMotion || signals.length > 0 || hoverNode >= 0) schedule();
    };

    resize();
    canvas.addEventListener('pointermove', onPointerMove, { passive: true });
    canvas.addEventListener('pointerleave', onPointerLeave, { passive: true });
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('keydown', onKeyDown);
    canvas.addEventListener('focus', onFocus);
    canvas.addEventListener('blur', onBlur);
    motionQuery?.addEventListener('change', schedule);
    window.addEventListener('resize', resize);
    schedule();
    return () => {
      window.cancelAnimationFrame(frame);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('keydown', onKeyDown);
      canvas.removeEventListener('focus', onFocus);
      canvas.removeEventListener('blur', onBlur);
      motionQuery?.removeEventListener('change', schedule);
      window.removeEventListener('resize', resize);
    };
  }, [color, accent]);

  if (Platform.OS !== 'web') {
    return <View accessibilityLabel="Interactive neural network illustration" style={{ width: '100%', aspectRatio: 1, borderRadius: 300, backgroundColor: `${accent}14` }} />;
  }

  // A DOM ref lets the animation draw into the canvas without rendering hundreds of React nodes.
  // eslint-disable-next-line react-hooks/refs
  const canvasElement = createElement('canvas', {
    ref: canvasRef,
    role: 'button',
    tabIndex: 0,
    'aria-label': 'Neural network. Move the pointer to wake neurons, or click, tap, Enter, or Space to fire a signal.',
    'aria-keyshortcuts': 'Enter Space',
    style: { position: 'absolute', inset: 0, display: 'block', width: '100%', height: '100%', touchAction: 'pan-y', outline: 'none', cursor: 'crosshair' },
  }) as any;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {canvasElement}
    </View>
  );
}
