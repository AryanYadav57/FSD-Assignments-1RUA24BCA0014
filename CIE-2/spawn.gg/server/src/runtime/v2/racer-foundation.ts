import type { GameModuleV2 } from '../v2';

export type RacerTheme = 'night-city' | 'coast' | 'canyon' | 'forest';
export type RacerBlueprint = {
  title: string;
  theme: RacerTheme;
  laps: number;
  rivalCount: number;
  difficulty: 'relaxed' | 'standard' | 'challenging';
};

const themes: Record<RacerTheme, { sky: string; ground: string; road: string; accent: string; highlight: string; scenery: string }> = {
  'night-city': { sky: '#101522', ground: '#202b2b', road: '#373b43', accent: '#ed496f', highlight: '#53d9e8', scenery: '#38434f' },
  coast: { sky: '#a8d4d6', ground: '#687c55', road: '#45494a', accent: '#dc6547', highlight: '#f0cf79', scenery: '#d2b77d' },
  canyon: { sky: '#d6a17d', ground: '#73543f', road: '#393535', accent: '#e07948', highlight: '#f2cc82', scenery: '#986649' },
  forest: { sky: '#a5b9a5', ground: '#425b45', road: '#383e3b', accent: '#a64f43', highlight: '#d5ca7e', scenery: '#536b50' },
};

export function fallbackRacerBlueprint(prompt: string): RacerBlueprint {
  const lower = prompt.toLowerCase();
  const theme: RacerTheme = /coast|beach|ocean|island|sunset/i.test(lower) ? 'coast'
    : /canyon|desert|sand|dune/i.test(lower) ? 'canyon'
      : /forest|jungle|wood/i.test(lower) ? 'forest' : 'night-city';
  const title = /coast/i.test(lower) ? 'Coastline Sprint'
    : /canyon|desert/i.test(lower) ? 'Canyon Rush'
      : /forest|jungle/i.test(lower) ? 'Pine Run Rally' : 'Midnight Circuit';
  return { title, theme, laps: 2, rivalCount: 3, difficulty: 'standard' };
}

export function normalizeRacerBlueprint(value: unknown, originalPrompt: string): RacerBlueprint {
  const fallback = fallbackRacerBlueprint(originalPrompt);
  if (!value || typeof value !== 'object') return fallback;
  const candidate = value as Record<string, unknown>;
  const theme = ['night-city', 'coast', 'canyon', 'forest'].includes(String(candidate.theme))
    ? candidate.theme as RacerTheme : fallback.theme;
  const difficulty = ['relaxed', 'standard', 'challenging'].includes(String(candidate.difficulty))
    ? candidate.difficulty as RacerBlueprint['difficulty'] : fallback.difficulty;
  const laps = Number(candidate.laps);
  const rivalCount = Number(candidate.rivalCount);
  const title = typeof candidate.title === 'string' ? candidate.title.trim().replace(/[<>]/g, '').slice(0, 48) : '';
  return {
    title: title || fallback.title,
    theme,
    laps: Number.isFinite(laps) ? Math.round(Math.max(1, Math.min(4, laps))) : fallback.laps,
    rivalCount: Number.isFinite(rivalCount) ? Math.round(Math.max(1, Math.min(4, rivalCount))) : fallback.rivalCount,
    difficulty,
  };
}

/** The model supplies safe, bounded race choices; this authored loop owns play. */
export function buildRacerFoundation(blueprint: RacerBlueprint): GameModuleV2 {
  const theme = themes[blueprint.theme];
  const objective = `Complete ${blueprint.laps} ${blueprint.laps === 1 ? 'lap' : 'laps'} and reach the finish.`;
  return {
    version: 2,
    title: blueprint.title,
    objective,
    instructions: 'W / ↑ accelerate · S / ↓ brake · A/D or ←/→ steer · Space boost · Esc pause · R restart',
    palette: { sky: theme.sky, ground: theme.ground, accent: theme.accent, highlight: theme.highlight },
    module: `
const T=game.THREE, scene=game.scene;
const tune=${JSON.stringify({ laps: blueprint.laps, rivals: blueprint.rivalCount, difficulty: blueprint.difficulty, theme })};
scene.background=new T.Color(tune.theme.sky);scene.fog=new T.Fog(tune.theme.sky,48,118);
game.lights.moody(0xffffff,1.45);game.lights.fill(0x9ebbd0,.8);
const ground=game.models.ground(260,tune.theme.ground);ground.position.y=-.42;scene.add(ground);
const circle=(radius,color,y)=>{const mesh=new T.Mesh(new T.CircleGeometry(radius,128),new T.MeshStandardMaterial({color,roughness:.95}));mesh.rotation.x=-Math.PI/2;mesh.position.y=y;scene.add(mesh);return mesh;};
circle(8.95,tune.theme.ground,-.39);
const road=new T.Mesh(new T.RingGeometry(9,16,160),new T.MeshStandardMaterial({color:tune.theme.road,roughness:.84}));road.rotation.x=-Math.PI/2;road.position.y=-.31;scene.add(road);
const torus=(radius,tube,color,y)=>{const mesh=new T.Mesh(new T.TorusGeometry(radius,tube,8,160),new T.MeshStandardMaterial({color,roughness:.68,metalness:.12}));mesh.rotation.x=Math.PI/2;mesh.position.y=y;scene.add(mesh);return mesh;};
torus(9.12,.22,tune.theme.accent,-.05);torus(15.88,.22,tune.theme.highlight,-.05);
const dashMat=new T.MeshStandardMaterial({color:'#d5d4cd',roughness:.8});
for(let i=0;i<64;i++){const a=i*Math.PI*2/64,m=new T.Mesh(new T.BoxGeometry(.11,.025,.8),dashMat);m.position.set(Math.sin(a)*12.5,-.27,Math.cos(a)*12.5);m.rotation.y=a-Math.PI/2;scene.add(m);}
const startLine=new T.Mesh(new T.BoxGeometry(6.7,.035,.2),new T.MeshStandardMaterial({color:'#f0eee5',roughness:.8}));startLine.position.set(0,-.26,12.5);scene.add(startLine);
const sceneryMat=new T.MeshStandardMaterial({color:tune.theme.scenery,roughness:.9});
for(let i=0;i<36;i++){const a=i*Math.PI*2/36,r=20+(i%3)*3,h=3+(i*7%11),w=1.5+(i%4)*.42,d=1.6+(i%3)*.5;const b=new T.Mesh(new T.BoxGeometry(w,h,d),sceneryMat);b.position.set(Math.sin(a)*r,h/2-.35,Math.cos(a)*r);b.rotation.y=-a*.45;scene.add(b);if(i%4===0){const glow=new T.PointLight(tune.theme.highlight,3,8,2);glow.position.set(b.position.x,h*.72,b.position.z);scene.add(glow);}}
function makeCar(color,trim){const root=new T.Group(),paint=new T.MeshStandardMaterial({color,roughness:.38,metalness:.26}),glass=new T.MeshStandardMaterial({color:'#c3d4d6',roughness:.2,metalness:.18}),rubber=new T.MeshStandardMaterial({color:'#171a1c',roughness:.95});const add=(geo,mat,x,y,z)=>{const m=new T.Mesh(geo,mat);m.position.set(x,y,z);root.add(m);return m;};add(new T.BoxGeometry(1.38,.4,2.25),paint,0,.43,0);add(new T.BoxGeometry(.94,.48,.96),glass,0,.82,.12);add(new T.BoxGeometry(1.28,.13,.44),paint,0,.35,-.86);for(const x of [-.66,.66])for(const z of [-.7,.7]){const w=add(new T.CylinderGeometry(.22,.22,.17,14),rubber,x,.23,z);w.rotation.z=Math.PI/2;}return root;}
const player=makeCar(tune.theme.accent,tune.theme.highlight);scene.add(player);
const rivalColors=['#dfb15e','#687f9b','#728c70','#ad7b9b'],rivals=[];
for(let i=0;i<tune.rivals;i++){const car=makeCar(rivalColors[i%rivalColors.length],tune.theme.highlight);scene.add(car);rivals.push({car,progress:-(i+1)*10,speed:0});}
const radius=12.5,circumference=Math.PI*2*radius,finishDistance=circumference*tune.laps;
const difficultyScale=tune.difficulty==='relaxed'?.74:tune.difficulty==='challenging'?1.06:.88;
const maxSpeed=25,acceleration=tune.difficulty==='relaxed'?18:14;
let progress=0,speed=0,lane=0,boost=100,boostClock=0,finished=false,collisions=0,collisionCooldown=0;
function placeCar(car,distance,offset){const a=distance/radius,r=radius+offset;car.position.set(Math.sin(a)*r,.02,Math.cos(a)*r);car.rotation.y=a-Math.PI/2;}
function stepPlayer(dt,throttle,steering,boosting){if(finished)return;if(boosting&&boost>0)boostClock=Math.max(boostClock,.55);boostClock=Math.max(0,boostClock-dt);const boostPower=boostClock>0&&boost>0?10:0;if(boostClock>0)boost=Math.max(0,boost-dt*30);else boost=Math.min(100,boost+dt*9);if(throttle>0)speed=Math.min(maxSpeed+boostPower,speed+acceleration*throttle*dt+boostPower*dt);else if(throttle<0)speed=Math.max(0,speed-23*Math.abs(throttle)*dt);else speed=Math.max(0,speed-2.7*dt);lane=Math.max(-2.75,Math.min(2.75,lane+steering*Math.max(1.4,speed*.23)*dt));if(speed>0){progress+=speed*dt;placeCar(player,progress,lane);}game.setScore(Math.floor(progress));if(progress>=finishDistance){finished=true;game.setStatus('FINISH · '+Math.floor(progress)+' m');game.win('You completed '+tune.laps+' laps. Great driving!');}}
game.input.onFire(()=>{if(boost>0)boostClock=Math.max(boostClock,.55);});
function updateCamera(dt,snap=false){const a=progress/radius,tx=Math.cos(a),tz=-Math.sin(a),wanted=new T.Vector3(player.position.x-tx*10.5,6.4,player.position.z-tz*10.5),lookAt=new T.Vector3(player.position.x+tx*4,player.position.y+.42,player.position.z+tz*4);if(snap)game.camera.position.copy(wanted);else game.camera.position.lerp(wanted,1-Math.exp(-4.5*dt));game.camera.lookAt(lookAt);}
function update(dt){if(finished)return;collisionCooldown=Math.max(0,collisionCooldown-dt);const input=game.input,throttle=Number(input.down('KeyW')||input.down('ArrowUp'))-Number(input.down('KeyS')||input.down('ArrowDown')),steering=Number(input.down('KeyD')||input.down('ArrowRight'))-Number(input.down('KeyA')||input.down('ArrowLeft'));stepPlayer(dt,throttle,steering,input.down('Space'));for(let i=0;i<rivals.length;i++){const r=rivals[i];r.progress+=r.speed*dt;placeCar(r.car,r.progress,-1.65+i*1.08);}for(let i=0;i<rivals.length;i++){const r=rivals[i],gap=Math.abs(r.progress-progress);if(collisionCooldown===0&&gap<1.5&&Math.abs(lane-(-1.65+i*1.08))<.65&&speed>2){speed*=.76;collisions++;collisionCooldown=.85;}}const lap=Math.min(tune.laps,Math.floor(progress/circumference)+1);game.setStatus('LAP '+lap+'/'+tune.laps+'  ·  SPEED '+Math.round(speed*8)+' km/h  ·  BOOST '+Math.round(boost)+'%  ·  CONTACTS '+collisions);updateCamera(dt);}
for(const r of rivals)r.speed=13.2*difficultyScale;
placeCar(player,0,0);for(let i=0;i<rivals.length;i++)placeCar(rivals[i].car,rivals[i].progress,-1.65+i*1.08);updateCamera(0,true);
game.setStatus('LAP 1/'+tune.laps+'  ·  W / ↑ TO DRIVE  ·  SPACE BOOST');
return{update,qaAction(){stepPlayer(.75,1,0,true);return progress;},qaSnapshot(){return{archetype:'racer',playerProgress:progress,lap:Math.floor(progress/circumference),speed,lane,boost,rivals:rivals.length,contacts:collisions,finished};},reset(){progress=0;speed=0;lane=0;boost=100;boostClock=0;finished=false;collisions=0;collisionCooldown=0;for(let i=0;i<rivals.length;i++){rivals[i].progress=-(i+1)*10;placeCar(rivals[i].car,rivals[i].progress,-1.65+i*1.08);}placeCar(player,0,0);updateCamera(0,true);game.setScore(0);game.setStatus('LAP 1/'+tune.laps+'  ·  W / ↑ TO DRIVE  ·  SPACE BOOST');}};
`,
  };
}
