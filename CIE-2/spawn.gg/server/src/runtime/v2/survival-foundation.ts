import type { GameModuleV2 } from '../v2';

type SurvivalPalette = { sky: string; ground: string; accent: string; highlight: string; cover: string; wall: string };

const settings: Record<string, SurvivalPalette> = {
  city: { sky: '#171b20', ground: '#45433f', accent: '#76554a', highlight: '#f0b678', cover: '#54473e', wall: '#35383a' },
  forest: { sky: '#18201c', ground: '#384338', accent: '#5d5140', highlight: '#d7b878', cover: '#4b4638', wall: '#333b34' },
  quarantine: { sky: '#171d20', ground: '#414747', accent: '#76524b', highlight: '#dca678', cover: '#4b5050', wall: '#343a3b' },
};

function pickSetting(prompt: string): { setting: keyof typeof settings; title: string } {
  const text = prompt.toLowerCase();
  if (/forest|woods|woodland|jungle|overgrown/i.test(text)) return { setting: 'forest', title: 'The Overgrown' };
  if (/lab|facility|quarantine|research|experiment/i.test(text)) return { setting: 'quarantine', title: 'Quarantine: Last Shift' };
  return { setting: 'city', title: /night|midnight|dark/i.test(text) ? 'Zombie Nightfall' : 'Zombie Night Survival' };
}

/** Authored survival loop for zombie prompts: reliable scene, controls, combat, health and restart. */
export function buildSurvivalFoundation(prompt: string): GameModuleV2 {
  const choice = pickSetting(prompt);
  const palette = settings[choice.setting];
  return {
    version: 2,
    title: choice.title,
    objective: 'Eliminate 12 infected and survive the courtyard. Keep moving; close enemies drain your health.',
    instructions: 'WASD move · mouse look · Space or click shoot · F reload · Esc pause · R restart',
    palette: { sky: palette.sky, ground: palette.ground, accent: palette.accent, highlight: palette.highlight },
    module: `
const T=game.THREE, scene=game.scene, tune=${JSON.stringify(palette)};
scene.background=new T.Color(tune.sky);scene.fog=new T.Fog(tune.sky,25,74);
game.lights.moody(0xffd2a0,2.35);game.lights.fill(0x91a8b0,1.05);
const floor=game.models.ground(84,tune.ground);floor.position.y=-.06;scene.add(floor);
const grid=new T.GridHelper(84,42,'#66645b','#55564f');grid.position.y=-.045;grid.material.transparent=true;grid.material.opacity=.18;scene.add(grid);
const world=game.physics.createWorld({gravity:22,floorY:0}),solids=[];
function block(x,z,w,h,d,color=tune.wall){const m=game.models.box(w,h,d,color);m.position.set(x,h/2,z);scene.add(m);world.addBox(m);solids.push(m);return m;}
// A bounded courtyard gives the player a readable horizon and clear sightlines.
block(0,-21,44,7,.8,'#303438');block(-22,0,.8,7,43,'#303438');block(22,0,.8,7,43,'#303438');
block(-8,-8,7,2.4,1.2,tune.cover);block(8,-10,6,2.8,1.2,tune.cover);block(-9,5,5,2,1.2,tune.cover);block(9,5,6,2.2,1.2,tune.cover);
block(-2,-14,2.8,1.5,1,tune.accent);block(14,1,1.3,2.5,1.3,tune.accent);block(-15,-5,1.2,2,1.2,tune.accent);
for(let i=0;i<10;i++){
  const x=-18+i*4,z=i%2?-16:16;
  const post=game.models.box(.16,4.6,.16,'#25292b');post.position.set(x,2.3,z);scene.add(post);
  const lamp=new T.PointLight(i%2?0xd49a61:0x8ba8b5,i%2?18:11,14,2);lamp.position.set(x,4.35,z);scene.add(lamp);
  const bulb=game.models.sphere(.13,i%2?'#ffd09a':'#b5d5de');bulb.position.copy(lamp.position);scene.add(bulb);
}
for(let i=0;i<16;i++){
  const rock=game.models.rock(.25+(i%4)*.09,i%3?'#55524b':'#665348');rock.position.set(((i*17)%37)-18,.12,((i*23)%37)-18);rock.rotation.set(i*.31,i*.7,i*.18);scene.add(rock);
}
const body=world.addBody({position:new T.Vector3(0,0,5),radius:.42,height:1.8});
 const look=game.controls.firstPerson(body,world,{speed:4.8,sensitivity:.0022,eyeHeight:1.62});
const weapon=new T.Group();weapon.position.set(.36,-.18,-.65);weapon.scale.setScalar(.66);weapon.rotation.set(-.035,-.025,0);game.camera.add(weapon);
const gunMetal=new T.MeshStandardMaterial({color:'#424a4c',metalness:.58,roughness:.36}),gunEdge=new T.MeshStandardMaterial({color:'#929a99',metalness:.62,roughness:.3}),gunGrip=new T.MeshStandardMaterial({color:'#302b27',roughness:.8}),gunSight=new T.MeshStandardMaterial({color:tune.highlight,emissive:tune.highlight,emissiveIntensity:.28});
function gunPart(geometry,material,x,y,z){const part=new T.Mesh(geometry,material);part.position.set(x,y,z);part.castShadow=false;part.receiveShadow=false;weapon.add(part);return part;}
gunPart(new T.BoxGeometry(.19,.15,.48),gunMetal,0,0,0);
gunPart(new T.BoxGeometry(.13,.035,.37),gunEdge,0,.095,-.015);
gunPart(new T.BoxGeometry(.11,.23,.16),gunGrip,.025,-.17,.045).rotation.x=-.16;
gunPart(new T.BoxGeometry(.11,.17,.11),gunGrip,0,-.15,-.055);
const barrel=gunPart(new T.CylinderGeometry(.035,.045,.34,12),gunEdge,0,.015,-.39);barrel.rotation.x=Math.PI/2;
gunPart(new T.BoxGeometry(.15,.08,.22),gunMetal,0,.005,.31);
gunPart(new T.BoxGeometry(.085,.055,.105),gunEdge,0,.117,-.06);
gunPart(new T.BoxGeometry(.035,.022,.055),gunSight,0,.15,-.065);
game.hud.showCrosshair(true);game.hud.setAmmo(12,48);
const infected=[];let kills=0,health=100,attackClock=0,spawnClock=0,ended=false;
function makeInfected(index){
 const g=new T.Group();
 // Keep one target directly ahead for a clear first shot; others approach from the flanks.
 const spots=[[0,-8],[-11,-5],[11,-6],[-13,10],[13,11],[0,-16]];const p=spots[index%spots.length];
 g.position.set(p[0],0,p[1]);
 const cloth=game.models.capsule(.34,.62,index%2?'#626e61':'#756452');cloth.position.y=1.04;g.add(cloth);
 const head=game.models.sphere(.27,'#a5967d');head.position.y=1.72;g.add(head);
 for(const s of [-1,1]){const arm=game.models.box(.16,.64,.2,'#4c554b');arm.position.set(s*.42,1.1,.02);arm.rotation.z=s*.16;g.add(arm);const eye=game.models.sphere(.045,'#e47757');eye.position.set(s*.105,1.77,-.235);g.add(eye);}
 const shadow=new T.Mesh(new T.CircleGeometry(.46,18),new T.MeshBasicMaterial({color:'#101315',transparent:true,opacity:.55}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.015;g.add(shadow);
 scene.add(g);infected.push({root:g,hp:2,hit:0,id:index});
}
for(let i=0;i<5;i++)makeInfected(i);
let magazine=12,reserve=48,reloading=false,reloadClock=0,recoil=0;
function fire(){
 if(ended||reloading)return;if(magazine<=0){game.audio.play('hit',125);return;}
 magazine--;recoil=Math.min(.13,recoil+.065);game.hud.setAmmo(magazine,reserve);game.audio.play('shoot');
 const hits=game.input.raycast([...solids,...infected.map(z=>z.root)]);if(!hits.length)return;
 game.particles.burst(hits[0].point,{count:10,color:tune.highlight,speed:1.8,lifetime:.34});
 let node=hits[0].object;while(node&&node.parent!==scene)node=node.parent;
 const target=infected.find(z=>z.root===node);if(!target||hits[0].distance>28)return;game.hud.hitMarker();
 target.hp--;target.hit=.2;game.audio.play('hit',target.hp?230:520);
 if(target.hp<=0){scene.remove(target.root);infected.splice(infected.indexOf(target),1);kills++;game.setScore(kills);game.particles.burst(target.root.position.clone().add(new T.Vector3(0,1,0)),{count:18,color:'#d57556',speed:2.4,lifetime:.48});
  if(kills>=12){ended=true;game.win('The courtyard is clear. Extraction is on the way.');return;}
  if(infected.length<5)makeInfected(kills+infected.length+1);
 }
}
game.input.onFire(fire);
function update(dt){
 if(ended)return;attackClock+=dt;spawnClock+=dt;recoil=Math.max(0,recoil-dt*.42);weapon.position.z=-.65+recoil;
 if(game.input.pressed('KeyF')&&!reloading&&magazine<12&&reserve>0){reloading=true;reloadClock=1.05;game.setStatus('RELOADING · '+magazine+' / '+reserve);}
 if(reloading){reloadClock-=dt;const motion=Math.sin(Math.max(0,1-reloadClock/1.05)*Math.PI);weapon.position.y=-.18-motion*.12;weapon.rotation.z=motion*.2;if(reloadClock<=0){const loaded=Math.min(12-magazine,reserve);magazine+=loaded;reserve-=loaded;reloading=false;weapon.position.y=-.18;weapon.rotation.z=0;game.hud.setAmmo(magazine,reserve);}}
 for(let i=infected.length-1;i>=0;i--){const z=infected[i],dx=body.position.x-z.root.position.x,dz=body.position.z-z.root.position.z,dist=Math.hypot(dx,dz)||.001;
  if(z.hit>0){z.hit-=dt;z.root.children[0].material.emissive.set('#6c291d');}else z.root.children[0].material.emissive.set('#000000');
  if(dist>1.4){z.root.position.x+=dx/dist*.72*dt;z.root.position.z+=dz/dist*.72*dt;z.root.rotation.y=Math.atan2(dx,dz);z.root.children[1].position.y=1.72+Math.sin(game.time*5+z.id)*.055;}
  else if(attackClock>.8){attackClock=0;health=Math.max(0,health-13);game.audio.play('hurt',110);if(health<=0){ended=true;game.lose('The infected reached you. Restart and keep moving.');}}
 }
 if(spawnClock>7&&infected.length<5){spawnClock=0;makeInfected(kills+infected.length+2);}
 game.setStatus('HEALTH '+health+'%  ·  INFECTED '+kills+'/12  ·  '+infected.length+' NEARBY');
}
game.setStatus('HEALTH 100%  ·  INFECTED 0/12  ·  MOVE TO SURVIVE');
 return{update,qaAction(){fire();fire();return kills;},qaSnapshot(){return{archetype:'survival',kills,health,zombies:infected.length,ammo:magazine,reserve,targetHp:infected.find(z=>Math.abs(z.root.position.x-body.position.x)<1&&Math.abs(z.root.position.z-(body.position.z-13))<3)?.hp??0};},reset(){ended=false;kills=0;health=100;attackClock=0;spawnClock=0;magazine=12;reserve=48;reloading=false;reloadClock=0;recoil=0;weapon.position.set(.36,-.18,-.65);weapon.rotation.set(-.035,-.025,0);look.reset();game.hud.setAmmo(magazine,reserve);game.particles.clear();game.setScore(0);game.setStatus('HEALTH 100%  ·  INFECTED 0/12  ·  MOVE TO SURVIVE');body.position.set(0,0,5);body.velocity.set(0,0,0);for(const z of infected)scene.remove(z.root);infected.length=0;for(let i=0;i<5;i++)makeInfected(i);}};
`,
  };
}
