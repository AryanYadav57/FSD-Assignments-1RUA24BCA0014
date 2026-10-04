import * as THREE from 'three';

type GameSpec = { version: 2; title: string; objective: string; instructions: string; palette: { sky: string; ground: string; accent: string; highlight: string }; module: string };
type Hooks = { update?: (dt: number, game: any) => void; reset?: (game: any) => void; dispose?: () => void; qaAction?: () => unknown; qaSnapshot?: () => unknown };

const MAX_DT = 1 / 30;
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

function makeRuntime(THREERef: typeof THREE) {
  const toVector3 = (value: any) => {
    if (value instanceof THREERef.Vector3) return value;
    const component = (axis: 'x' | 'y' | 'z') => Number.isFinite(Number(value?.[axis])) ? Number(value[axis]) : 0;
    return new THREERef.Vector3(component('x'), component('y'), component('z'));
  };

  function start(spec: GameSpec) {
    const root = document.getElementById('game')!;
    const canvas = document.getElementById('view') as HTMLCanvasElement;
    const ctx = new THREERef.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    const maxDpr = Math.min(window.devicePixelRatio || 1, 1.5);
    ctx.setPixelRatio(maxDpr);
    ctx.outputColorSpace = THREERef.SRGBColorSpace;
    ctx.toneMapping = THREERef.ACESFilmicToneMapping;
    ctx.toneMappingExposure = 1.05;
    ctx.shadowMap.enabled = true;
    ctx.shadowMap.type = THREERef.PCFSoftShadowMap;
    const scene = new THREERef.Scene();
    scene.background = new THREERef.Color(spec.palette.sky);
    scene.fog = new THREERef.Fog(spec.palette.sky, 18, 78);
    const camera = new THREERef.PerspectiveCamera(70, 1, 0.08, 150);
    camera.position.set(0, 1.65, 5);
    // Keeping the camera in the scene graph lets first-person view models
    // (weapon meshes, cockpit details) inherit its transform and render.
    scene.add(camera);
    const keys = new Set<string>(), pressed = new Set<string>(), updates: ((dt:number)=>void)[] = [];
    const physicsWorlds: { addBox: (object: THREE.Object3D) => unknown }[] = [];
    const physicsBoxes: THREE.Object3D[] = [];
    const raycaster = new THREERef.Raycaster();
    const pointer = new THREE.Vector2();
    const pointerDelta = { x: 0, y: 0 };
    const activeTweens: any[] = [];
    const particleLimit = 512;
    const particlePositions = new Float32Array(particleLimit * 3);
    particlePositions.fill(1000000);
    const particleColors = new Float32Array(particleLimit * 3);
    const particleSlots: { velocity: THREE.Vector3; life: number; maxLife: number }[] = [];
    for (let i = 0; i < particleLimit; i++) particleSlots.push({ velocity: new THREERef.Vector3(), life: 0, maxLife: 1 });
    let particleCursor = 0;
    let audioContext: AudioContext | undefined;
    let state = 'menu', raf = 0, elapsed = 0, score = 0, actionCount = 0, hooks: Hooks | void, pointerLocked = false, lastFrameAt = performance.now(), lastError = '';
    const overlay = document.getElementById('overlay')!, button = document.getElementById('primary')!, title = document.getElementById('heading')!, copy = document.getElementById('copy')!, kicker = document.getElementById('kicker')!;
    const uiScore = document.getElementById('score')!, uiHint = document.getElementById('hint')!, uiStatus = document.getElementById('status')!, errorBox = document.getElementById('error')!;
    const crosshair = document.getElementById('crosshair')!, ammoPanel = document.getElementById('ammoPanel')!, ammoCount = document.getElementById('ammoCount')!, ammoReserve = document.getElementById('ammoReserve')!;
    let hitMarkerTimer = 0, ignoreFirstLockedMouseMove = false;
    const particleGeometry = new THREERef.BufferGeometry();
    particleGeometry.setAttribute('position', new THREERef.BufferAttribute(particlePositions, 3).setUsage(THREERef.DynamicDrawUsage));
    particleGeometry.setAttribute('color', new THREERef.BufferAttribute(particleColors, 3).setUsage(THREERef.DynamicDrawUsage));
    const particleCloud = new THREERef.Points(particleGeometry, new THREERef.PointsMaterial({ size: .11, vertexColors: true, transparent: true, opacity: .9, depthWrite: false, blending: THREERef.AdditiveBlending, sizeAttenuation: true }));
    particleCloud.frustumCulled = false;
    scene.add(particleCloud);
    const report = (kind: string, message = '') => {
      if (kind === 'error') lastError = message;
      (window as any).__SPAWN_GAME_QA__ = { ready: true, state, elapsed, score, actionCount, kind, message: lastError || message };
      if (kind === 'error') { errorBox.textContent = message; errorBox.style.display = 'block'; }
    };
    const getVisualStats = () => {
      let meshes = 0, triangles = 0, lights = 0;
      scene.traverse((object: any) => {
        if (!object.visible) return;
        let ancestor = object, isViewModel = false;
        while (ancestor) { if (ancestor === camera) { isViewModel = true; break; } ancestor = ancestor.parent; }
        if (isViewModel) return;
        if (object.isLight) lights++;
        if (object.isMesh && object.geometry) {
          const count = Number(object.geometry.attributes?.position?.count) || 0;
          if (count > 0) { meshes++; triangles += object.geometry.index ? object.geometry.index.count / 3 : count / 3; }
        }
      });
      return { meshes, triangles: Math.floor(triangles), lights };
    };
    const sync = () => { overlay.hidden = state === 'playing'; };
    const show = (eyebrow: string, headline: string, body: string, action: string) => { kicker.textContent = eyebrow; title.textContent = headline; copy.textContent = body; button.textContent = action; sync(); };
    const resize = () => { const rect = root.getBoundingClientRect(); const w = Math.max(1, rect.width), h = Math.max(1, rect.height); ctx.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); };
    const updateScore = (value: number) => { score = Math.max(0, Math.floor(value)); uiScore.textContent = String(score); };
    const updateTweens = (dt: number) => { for (let i = activeTweens.length - 1; i >= 0; i--) { const t = activeTweens[i]; t.elapsed += dt; const p = clamp(t.elapsed / t.duration, 0, 1); const eased = t.ease === 'outCubic' ? 1 - (1 - p) ** 3 : t.ease === 'inOut' ? p < .5 ? 2 * p * p : 1 - ((-2 * p + 2) ** 2) / 2 : p; for (const key of Object.keys(t.to)) t.target[key] = t.from[key] + (t.to[key] - t.from[key]) * eased; t.onUpdate?.(eased); if (p === 1) { activeTweens.splice(i, 1); t.resolve?.(); } } };
    const input = {
      down: (key: string) => keys.has(key) || keys.has(key.startsWith('Key') ? key.slice(3).toLowerCase() : key),
      pressed: (key: string) => pressed.has(key) || pressed.has(key.startsWith('Key') ? key.slice(3).toLowerCase() : key),
      pointer, look: pointerDelta,
      get locked() { return pointerLocked; },
      capture: () => canvas.requestPointerLock?.(),
      raycast: (objects: THREE.Object3D[]) => { raycaster.setFromCamera(pointer, camera); return raycaster.intersectObjects(objects, true); },
      onFire: (fn: () => void) => { (game._onFire ||= []).push(fn); },
    };
    const game: any = {
      THREE: THREERef, scene, camera, renderer: ctx, canvas, input, palette: spec.palette,
      get time() { return elapsed; }, get score() { return score; }, get state() { return state; },
      setScore: updateScore,
      setStatus: (text: string) => { uiStatus.textContent = String(text).slice(0, 100); },
      hud: {
        showCrosshair: (visible = true) => { crosshair.hidden = !visible; },
        setAmmo: (magazine: number, reserve: number) => { ammoCount.textContent = String(Math.max(0, Math.floor(magazine))); ammoReserve.textContent = String(Math.max(0, Math.floor(reserve))); ammoPanel.hidden = false; },
        hitMarker: () => { crosshair.classList.add('hit'); window.clearTimeout(hitMarkerTimer); hitMarkerTimer = window.setTimeout(() => crosshair.classList.remove('hit'), 125); },
      },
      onUpdate: (fn: (dt: number) => void) => { updates.push(fn); return () => { const i = updates.indexOf(fn); if (i >= 0) updates.splice(i, 1); }; },
      win: (message = 'You completed the objective.') => end(true, message),
      lose: (message = 'The run is over.') => end(false, message),
      pause: () => { if (state === 'playing') { state = 'paused'; show('PAUSED', spec.title, 'Your run is waiting. Press Escape to continue.', 'Resume'); report('state'); } },
      resume: () => { if (state === 'paused') { state = 'playing'; lastFrameAt = performance.now(); sync(); report('state'); } },
      restart: () => restartGame(),
      audio: { play: (name = 'hit', frequency = 360) => { try { audioContext ??= new AudioContext(); if (audioContext.state === 'suspended') void audioContext.resume(); const ac = audioContext, osc = ac.createOscillator(), gain = ac.createGain(); const base = ({ hit: 300, win: 660, lose: 145, jump: 440, coin: 790, hurt: 110, shoot: 210 } as any)[name] ?? frequency; osc.type = name === 'hurt' || name === 'lose' ? 'triangle' : 'sine'; osc.frequency.setValueAtTime(base, ac.currentTime); osc.frequency.exponentialRampToValueAtTime(Math.max(45, base * .68), ac.currentTime + .11); gain.gain.setValueAtTime(.03, ac.currentTime); gain.gain.exponentialRampToValueAtTime(.001, ac.currentTime + .12); osc.connect(gain).connect(ac.destination); osc.start(); osc.stop(ac.currentTime + .13); } catch {} } },
      particles: {
        burst: (origin: THREE.Vector3, { count = 14, color = spec.palette.highlight, speed = 2.2, lifetime = .55 } = {}) => {
          const tint = new THREERef.Color(color), total = clamp(Math.floor(count), 1, 64), life = clamp(lifetime, .08, 3);
          for (let n = 0; n < total; n++) {
            const i = particleCursor++ % particleLimit, p = particleSlots[i], offset = i * 3;
            particlePositions[offset] = origin.x; particlePositions[offset + 1] = origin.y; particlePositions[offset + 2] = origin.z;
            particleColors[offset] = tint.r; particleColors[offset + 1] = tint.g; particleColors[offset + 2] = tint.b;
            const y = Math.random() * 2 - 1, angle = Math.random() * Math.PI * 2, ring = Math.sqrt(1 - y * y), velocity = speed * (.35 + Math.random() * .65);
            p.velocity.set(Math.cos(angle) * ring * velocity, y * velocity, Math.sin(angle) * ring * velocity); p.life = p.maxLife = life * (.65 + Math.random() * .7);
          }
          particleGeometry.attributes.position.needsUpdate = true; particleGeometry.attributes.color.needsUpdate = true;
        },
        clear: () => { for (const p of particleSlots) p.life = 0; particlePositions.fill(1000000); particleGeometry.attributes.position.needsUpdate = true; },
      },
      models: {
        ground: (size = 80, color = spec.palette.ground) => { const mesh = new THREERef.Mesh(new THREERef.PlaneGeometry(size, size), new THREERef.MeshStandardMaterial({ color, roughness: .96 })); mesh.rotation.x = -Math.PI / 2; mesh.receiveShadow = true; return mesh; },
        box: (w = 1, h = 1, d = 1, color = spec.palette.accent) => { const mesh = new THREERef.Mesh(new THREERef.BoxGeometry(w, h, d), new THREERef.MeshStandardMaterial({ color, roughness: .78 })); mesh.castShadow = true; mesh.receiveShadow = true; return mesh; },
        sphere: (radius = .5, color = spec.palette.highlight) => { const mesh = new THREERef.Mesh(new THREERef.SphereGeometry(radius, 18, 14), new THREERef.MeshStandardMaterial({ color, roughness: .62 })); mesh.castShadow = true; return mesh; },
        capsule: (radius = .35, length = .8, color = spec.palette.accent) => { const mesh = new THREERef.Mesh(new THREERef.CapsuleGeometry(radius, length, 4, 8), new THREERef.MeshStandardMaterial({ color, roughness: .72 })); mesh.castShadow = true; return mesh; },
        tree: (height = 3, foliage = '#58624d', trunk = '#514035') => { const group = new THREERef.Group(); const stem = new THREERef.Mesh(new THREERef.CylinderGeometry(.14, .22, height * .43, 7), new THREERef.MeshStandardMaterial({ color: trunk, roughness: 1 })); stem.position.y = height * .21; stem.castShadow = true; group.add(stem); for (let i = 0; i < 3; i++) { const crown = new THREERef.Mesh(new THREERef.ConeGeometry(height * (.24 - i * .025), height * .43, 7), new THREERef.MeshStandardMaterial({ color: foliage, roughness: .92 })); crown.position.y = height * (.43 + i * .2); crown.castShadow = true; group.add(crown); } return group; },
        crate: (size = 1, color = '#76563d') => { const group = new THREERef.Group(), box = new THREERef.Mesh(new THREERef.BoxGeometry(size, size, size), new THREERef.MeshStandardMaterial({ color, roughness: .88 })); box.position.y = size / 2; box.castShadow = true; box.receiveShadow = true; group.add(box); for (const x of [-.29, .29]) { const slat = new THREERef.Mesh(new THREERef.BoxGeometry(size * .08, size * 1.03, size * 1.02), new THREERef.MeshStandardMaterial({ color: '#a17c55', roughness: .75 })); slat.position.set(size * x, size / 2, 0); slat.castShadow = true; group.add(slat); } return group; },
        rock: (radius = .7, color = '#66645c') => { const mesh = new THREERef.Mesh(new THREERef.DodecahedronGeometry(radius, 0), new THREERef.MeshStandardMaterial({ color, roughness: 1, flatShading: true })); mesh.scale.set(1.2, .72, .92); mesh.castShadow = true; mesh.receiveShadow = true; return mesh; },
        coin: (radius = .42, color = spec.palette.highlight) => { const mesh = new THREERef.Mesh(new THREERef.TorusGeometry(radius, radius * .2, 8, 20), new THREERef.MeshStandardMaterial({ color, metalness: .72, roughness: .24, emissive: color, emissiveIntensity: .15 })); mesh.castShadow = true; return mesh; },
        character: (color = spec.palette.accent) => { const group = new THREERef.Group(), bodyMesh = new THREERef.Mesh(new THREERef.CapsuleGeometry(.33, .55, 4, 8), new THREERef.MeshStandardMaterial({ color, roughness: .78 })), head = new THREERef.Mesh(new THREERef.SphereGeometry(.24, 14, 10), new THREERef.MeshStandardMaterial({ color: '#c9b69a', roughness: .72 })); bodyMesh.position.y = .92; head.position.y = 1.52; group.add(bodyMesh, head); group.userData.parts = { body: bodyMesh, head }; group.userData.animate = (time: number, speed = 1) => { bodyMesh.position.y = .92 + Math.sin(time * 9) * .035 * speed; }; return group; },
      },
      lights: {
        moody: (color = 0xffd5a0, intensity = 2.1) => { scene.add(new THREERef.HemisphereLight(0x9cb7d8, 0x24201e, 1.35)); const key = new THREERef.DirectionalLight(color, intensity); key.position.set(-8, 13, 6); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.camera.left = -24; key.shadow.camera.right = 24; key.shadow.camera.top = 24; key.shadow.camera.bottom = -24; scene.add(key); return key; },
        fill: (color = 0x7896bb, intensity = .75) => { const light = new THREERef.DirectionalLight(color, intensity); light.position.set(7, 7, -9); scene.add(light); return light; },
      },
      physics: {
        createWorld: ({ gravity = 22, floorY = 0 } = {}) => {
          const boxes: THREE.Box3[] = [], bodies: any[] = [];
          const world = {
            addBox: (object: THREE.Object3D) => { const box = new THREERef.Box3().setFromObject(object); boxes.push(box); return () => { const i = boxes.indexOf(box); if (i >= 0) boxes.splice(i, 1); }; },
            addBody: ({ position = { x: 0, y: 0, z: 0 }, radius = .38, height = 1.7 }: { position?: { x?: number; y?: number; z?: number } | THREE.Vector3; radius?: number; height?: number }) => {
              // Normalize plain coordinate objects so reset hooks can safely use
              // Vector3 methods such as `position.set()`.
              const vector = toVector3(position).clone();
              const body = { position: vector, radius, height, velocity: new THREERef.Vector3(), grounded: false };
              bodies.push(body);
              return body;
            },
            step: (dt: number) => { for (const body of bodies) { body.velocity.y -= gravity * dt; body.position.y += body.velocity.y * dt; if (body.position.y < floorY) { body.position.y = floorY; body.velocity.y = 0; body.grounded = true; } else body.grounded = false; for (const axis of ['x', 'z'] as const) { const other: 'x' | 'z' = axis === 'x' ? 'z' : 'x'; body.position[axis] += body.velocity[axis] * dt; for (const box of boxes) { if (body.position.y + body.height < box.min.y || body.position.y > box.max.y) continue; if (body.position[other] + body.radius <= box.min[other] || body.position[other] - body.radius >= box.max[other]) continue; const nearest = clamp(body.position[axis], box.min[axis], box.max[axis]); if (Math.abs(body.position[axis] - nearest) < body.radius) body.position[axis] = body.position[axis] < (box.min[axis] + box.max[axis]) / 2 ? box.min[axis] - body.radius : box.max[axis] + body.radius; } } } },
            hits: (a: THREE.Vector3, b: THREE.Vector3, radius = .8) => a.distanceTo(b) < radius,
          };
          physicsWorlds.push(world);
          for (const object of physicsBoxes) world.addBox(object);
          return world;
        },
        createBox: (...args: any[]) => {
          let object: THREE.Object3D;
          if (args[0] instanceof THREERef.Object3D) {
            object = args[0];
          } else {
            let position: any = { x: 0, y: 0, z: 0 }, size: any = { x: 1, y: 1, z: 1 }, color: any = spec.palette.ground;
            if (args[0] && typeof args[0] === 'object') {
              const config = args[0];
              position = config.position ?? config.center ?? config;
              size = config.size ?? config.dimensions ?? config;
              color = config.color ?? color;
            } else if (typeof args[0] === 'number') {
              [position.x, position.y, position.z] = args.slice(0, 3);
              [size.x, size.y, size.z] = args.slice(3, 6);
              color = args[6] ?? color;
            }
            const width = Number(size.x ?? size.width ?? size.w ?? 1) || 1;
            const height = Number(size.y ?? size.height ?? size.h ?? 1) || 1;
            const depth = Number(size.z ?? size.depth ?? size.d ?? 1) || 1;
            object = game.models.box(width, height, depth, color);
            object.position.set(Number(position.x) || 0, Number(position.y) || 0, Number(position.z) || 0);
          }
          if (!scene.children.includes(object)) scene.add(object);
          if (!physicsBoxes.includes(object)) physicsBoxes.push(object);
          for (const world of physicsWorlds) world.addBox(object);
          return object;
        },
      },
      controls: {
        firstPerson: (body: { position: THREE.Vector3; velocity: THREE.Vector3 }, world: { step: (dt: number) => void }, { speed = 4.2, sensitivity = .0022, eyeHeight = 1.55 } = {}) => {
          body.position = toVector3(body.position);
          body.velocity = toVector3(body.velocity);
          let yaw = 0, pitch = 0;
          const update = (dt: number) => { yaw -= input.look.x * sensitivity; pitch = clamp(pitch - input.look.y * sensitivity, -1.05, .52); const forward = Number(input.down('KeyW') || input.down('ArrowUp')) - Number(input.down('KeyS') || input.down('ArrowDown')); const side = Number(input.down('KeyD') || input.down('ArrowRight')) - Number(input.down('KeyA') || input.down('ArrowLeft')); const length = Math.hypot(forward, side) || 1; body.velocity.x = (Math.sin(yaw) * forward + Math.cos(yaw) * side) / length * speed; body.velocity.z = (-Math.cos(yaw) * forward + Math.sin(yaw) * side) / length * speed; world.step(dt); camera.position.set(body.position.x, body.position.y + eyeHeight, body.position.z); camera.rotation.order = 'YXZ'; camera.rotation.y = yaw; camera.rotation.x = pitch; };
          const reset = () => { yaw = 0; pitch = 0; pointerDelta.x = 0; pointerDelta.y = 0; camera.rotation.order = 'YXZ'; camera.rotation.set(0, 0, 0); };
          updates.push(update); return { update, reset, get yaw() { return yaw; }, get pitch() { return pitch; } };
        },
        vehicle: (vehicle: THREE.Object3D, { maxSpeed = 18, reverseSpeed = 5, acceleration = 12, drag = 5, turnRate = 1.8 } = {}) => {
          let speed = 0;
          const update = (dt: number) => {
            const throttle = Number(input.down('KeyW') || input.down('ArrowUp')) - Number(input.down('KeyS') || input.down('ArrowDown'));
            const steering = Number(input.down('KeyD') || input.down('ArrowRight')) - Number(input.down('KeyA') || input.down('ArrowLeft'));
            speed = throttle ? clamp(speed + throttle * acceleration * dt, -reverseSpeed, maxSpeed) : speed * Math.max(0, 1 - drag * dt);
            vehicle.rotation.y += steering * turnRate * dt * (.22 + Math.min(1, Math.abs(speed) / Math.max(1, maxSpeed)) * .78) * Math.sign(speed || 1);
            vehicle.position.x += Math.sin(vehicle.rotation.y) * speed * dt;
            vehicle.position.z -= Math.cos(vehicle.rotation.y) * speed * dt;
          };
          updates.push(update);
          return { get speed() { return speed; }, reset: () => { speed = 0; } };
        },
        thirdPerson: (target: THREE.Object3D, { distance = 6, height = 2.6, lookHeight = 1.1, smooth = 7 } = {}) => updates.push((dt) => { const offset = new THREERef.Vector3(0, height, distance).applyAxisAngle(new THREERef.Vector3(0, 1, 0), target.rotation.y); camera.position.lerp(target.position.clone().add(offset), 1 - Math.exp(-smooth * dt)); camera.lookAt(target.position.x, target.position.y + lookHeight, target.position.z); }),
      },
      states: {
        create: <T extends string>(initial: T, transitions: Partial<Record<T, readonly T[]>> = {}) => {
          let current = initial;
          const listeners = new Set<(next: T, previous: T) => void>();
          return {
            get value() { return current; },
            is: (...values: T[]) => values.includes(current),
            set: (next: T) => { if (next === current) return true; const allowed = transitions[current]; if (allowed && !allowed.includes(next)) return false; const previous = current; current = next; for (const listener of listeners) listener(next, previous); return true; },
            onChange: (listener: (next: T, previous: T) => void) => { listeners.add(listener); return () => listeners.delete(listener); },
          };
        },
      },
      helpers: {
        follow: (target: THREE.Object3D, offset = new THREE.Vector3(0, 2.5, 6), smooth = 8) => updates.push((dt) => { const wanted = target.position.clone().add(offset); camera.position.lerp(wanted, 1 - Math.exp(-smooth * dt)); camera.lookAt(target.position); }),
        look: (target: THREE.Object3D) => camera.lookAt(target.position),
        clamp,
      },
      tweens: { to: (target: Record<string, number>, to: Record<string, number>, { duration = .35, ease = 'outCubic', onUpdate }: { duration?: number; ease?: string; onUpdate?: (progress: number) => void } = {}) => new Promise<void>((resolve) => { const from: Record<string, number> = {}; for (const key of Object.keys(to)) from[key] = target[key] ?? 0; activeTweens.push({ target, from, to, duration: Math.max(.001, duration), elapsed: 0, ease, onUpdate, resolve }); }) },
      onEnd: (fn: (won:boolean)=>void) => { (game._onEnd ||= []).push(fn); },
    };
    // Compatibility aliases for early generated games that interpreted the
    // original prompt's shorthand as top-level control helpers.
    game.vehicle = (...args: any[]) => game.controls.vehicle(...args);
    game.thirdPerson = (...args: any[]) => game.controls.thirdPerson(...args);
    function end(won: boolean, message: string) { if (state !== 'playing') return; state = won ? 'won' : 'over'; show(won ? 'EXTRACTION COMPLETE' : 'RUN ENDED', won ? 'You made it out.' : 'The zone is lost.', `${message}  Score: ${score}`, 'Play again'); for (const fn of game._onEnd || []) fn(won); report('state'); }
    function dispose() { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('keydown', onDown); window.removeEventListener('keyup', onUp); window.removeEventListener('blur', onBlur); document.removeEventListener('visibilitychange', onVisibility); document.removeEventListener('pointerlockchange', onLock); document.removeEventListener('mousemove', onMouseMove); canvas.removeEventListener('click', onClick); document.exitPointerLock?.(); try { hooks?.dispose?.(); } catch {} scene.traverse((o: any) => { o.geometry?.dispose?.(); const ms = Array.isArray(o.material) ? o.material : [o.material]; ms.filter(Boolean).forEach((m: any) => { Object.values(m).forEach((x: any) => x?.isTexture && x.dispose()); m.dispose?.(); }); }); ctx.dispose(); audioContext?.close().catch(() => {}); }
    function rollbackFailedModuleSetup(snapshot: { children: Set<THREE.Object3D>; updates: number; worlds: number; boxes: number; tweens: number; fireCallbacks: number; endCallbacks: number }) {
      updates.splice(snapshot.updates);
      physicsWorlds.splice(snapshot.worlds);
      physicsBoxes.splice(snapshot.boxes);
      activeTweens.splice(snapshot.tweens);
      if (Array.isArray(game._onFire)) game._onFire.splice(snapshot.fireCallbacks);
      if (Array.isArray(game._onEnd)) game._onEnd.splice(snapshot.endCallbacks);
      for (const object of [...scene.children]) {
        if (snapshot.children.has(object)) continue;
        scene.remove(object);
        object.traverse((child: any) => {
          child.geometry?.dispose?.();
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          for (const material of materials.filter(Boolean)) {
            for (const value of Object.values(material)) (value as any)?.isTexture && (value as any).dispose?.();
            material.dispose?.();
          }
        });
      }
      game.particles.clear();
      camera.position.set(0, 1.65, 5);
      camera.rotation.set(0, 0, 0);
      camera.rotation.order = 'XYZ';
      updateScore(0);
    }
    // Reset is handled without reloading so the player shell and engine stay stable.
    function restartGame() {
      if (!hooks) { begin(); return; }
      if (state !== 'menu') { state = 'playing'; elapsed = 0; updateScore(0); keys.clear(); pressed.clear(); lastError = ''; errorBox.style.display = 'none'; try { hooks?.reset?.(game); } catch (e) { report('error', String(e)); } show('', '', '', ''); lastFrameAt = performance.now(); report('state'); } else begin();
    }
    function begin() {
      state = 'playing'; elapsed = 0; updateScore(0); lastError = ''; errorBox.style.display = 'none';
      const setup = { children: new Set(scene.children), updates: updates.length, worlds: physicsWorlds.length, boxes: physicsBoxes.length, tweens: activeTweens.length, fireCallbacks: game._onFire?.length ?? 0, endCallbacks: game._onEnd?.length ?? 0 };
      try {
        const result = new Function('game', `'use strict';\n${spec.module}`)(game);
        if (!result || typeof result.update !== 'function') throw new Error('Game module must return an update(dt, game) hook.');
        hooks = result as Hooks;
      } catch (e) {
        rollbackFailedModuleSetup(setup);
        hooks = undefined;
        state = 'over';
        report('error', e instanceof Error ? e.message : String(e));
        return;
      }
      show('', '', '', ''); lastFrameAt = performance.now(); report('state');
    }
    function onDown(e: KeyboardEvent) { const code = e.code || e.key; if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(code)) e.preventDefault(); if (!keys.has(code)) pressed.add(code); keys.add(code); keys.add(e.key.toLowerCase()); if (state === 'menu' && (code === 'Enter' || code === 'Space')) begin(); else if (state === 'playing' && code === 'Escape') game.pause(); else if (state === 'paused' && code === 'Escape') game.resume(); else if ((state === 'over' || state === 'won') && (code === 'Enter' || code === 'Space' || code === 'KeyR')) restartGame(); else if (state === 'playing' && code === 'KeyR') restartGame(); else if (state === 'playing' && code === 'Space') fire(); }
    function onUp(e: KeyboardEvent) { keys.delete(e.code); keys.delete(e.key.toLowerCase()); }
    function onBlur() { keys.clear(); pressed.clear(); if (state === 'playing') game.pause(); }
    function onVisibility() { if (document.hidden) onBlur(); else lastFrameAt = performance.now(); }
    function onLock() { pointerLocked = document.pointerLockElement === canvas; pointerDelta.x = 0; pointerDelta.y = 0; ignoreFirstLockedMouseMove = pointerLocked; }
    function onMouseMove(e: MouseEvent) { if (pointerLocked) { if (ignoreFirstLockedMouseMove) { ignoreFirstLockedMouseMove = false; return; } pointerDelta.x = clamp(e.movementX, -120, 120); pointerDelta.y = clamp(e.movementY, -120, 120); pointer.x = 0; pointer.y = 0; } }
    function fire() { actionCount++; for (const fn of (game._onFire || [])) fn(); report('action'); }
    function onClick() { if (state === 'menu') begin(); else if (state === 'playing') { if (!pointerLocked) canvas.requestPointerLock?.(); pointer.set(0, 0); fire(); } }
    button.addEventListener('click', () => state === 'paused' ? game.resume() : state === 'menu' ? begin() : restartGame());
    window.addEventListener('resize', resize); window.addEventListener('keydown', onDown); window.addEventListener('keyup', onUp); window.addEventListener('blur', onBlur); document.addEventListener('visibilitychange', onVisibility); document.addEventListener('pointerlockchange', onLock);
    document.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('click', onClick);
    const tick = (now = performance.now()) => { raf = requestAnimationFrame(tick); const dt = Math.min(MAX_DT, Math.max(0, (now - lastFrameAt) / 1000)); lastFrameAt = now; if (state === 'playing') { elapsed += dt; try { hooks?.update?.(dt, game); for (const update of updates) update(dt); updateTweens(dt); for (let i = 0; i < particleLimit; i++) { const p = particleSlots[i]; if (p.life <= 0) continue; p.life -= dt; const offset = i * 3; particlePositions[offset] += p.velocity.x * dt; particlePositions[offset + 1] += p.velocity.y * dt; particlePositions[offset + 2] += p.velocity.z * dt; p.velocity.y -= 2.4 * dt; if (p.life <= 0) particlePositions[offset] = particlePositions[offset + 1] = particlePositions[offset + 2] = 1000000; } particleGeometry.attributes.position.needsUpdate = true; pressed.clear(); } catch (e) { report('error', e instanceof Error ? e.message : String(e)); game.lose('The game encountered an error.'); } pointerDelta.x = 0; pointerDelta.y = 0; } ctx.render(scene, camera); let custom = null; try { custom = hooks?.qaSnapshot?.() ?? null; } catch {} (window as any).__SPAWN_GAME_QA__ = { ready: true, state, elapsed, score, actionCount, kind: 'frame', message: lastError, camera: { x: camera.position.x, y: camera.position.y, z: camera.position.z }, visual: getVisualStats(), custom }; };
    resize(); document.getElementById('gameTitle')!.textContent = spec.title; uiHint.textContent = spec.instructions; show('READY TO PLAY', spec.title, `${spec.objective} ${spec.instructions}`, 'Start game'); report('ready'); raf = requestAnimationFrame(tick);
    const snapshot = () => {
      let custom = null;
      try { custom = hooks?.qaSnapshot?.() ?? null; } catch {}
      return { ready: true, state, elapsed, score, actionCount, kind: 'frame', message: lastError, camera: { x: camera.position.x, y: camera.position.y, z: camera.position.z }, visual: getVisualStats(), custom };
    };
    return { dispose, game, scene, camera, renderer: ctx, qaAction: () => hooks?.qaAction?.(), snapshot };
  }
  return { start, THREE: THREERef };
}

export const SpawnThreeRuntime = makeRuntime(THREE);


