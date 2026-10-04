import type { GameModuleV2 } from '../v2';

/** Authored fixture for runtime/browser QA and as the first 3D reference game. */
export const zombieShowcase: GameModuleV2 = {
  version: 2,
  title: 'Last Light: Quarantine',
  objective: 'Clear the courtyard and survive until extraction. Eliminate 12 infected.',
  instructions: 'WASD move · mouse aim · Space or click fire · Esc pause · R restart',
  palette: { sky: '#151a1d', ground: '#3c3933', accent: '#744b43', highlight: '#efbd83' },
  module: `
const T=game.THREE, scene=game.scene;
scene.background=new T.Color('#151a1d'); scene.fog=new T.Fog('#151a1d',16,58);
game.lights.moody(0xffc68a,2.0); game.lights.fill(0x7186a0,.9);
const floor=game.models.ground(70,'#514b40'); floor.position.y=-.04; scene.add(floor);
const world=game.physics.createWorld({gravity:22,floorY:0}), obstacles=[];
function wall(x,y,z,w,h,d,color){const m=game.models.box(w,h,d,color);m.position.set(x,y+h/2,z);scene.add(m);world.addBox(m);obstacles.push(m);return m;}
wall(0,0,-17,35,6,.8,'#40332e'); wall(-17,0,0,.8,6,35,'#343638'); wall(17,0,0,.8,6,35,'#343638');
wall(-7,0,-8,7,2.5,1.2,'#68513e'); wall(8,0,-10,6,3,1.1,'#51463b'); wall(-9,0,4,5,2.1,1.2,'#62483e'); wall(8,0,5,6,2.2,1.2,'#575047');
for(let i=0;i<9;i++){const lamp=new T.PointLight(i%2?0xc18f63:0x7893a8, i%2?12:8, 13, 2);lamp.position.set(-14+i*3.5,4.8,-12+(i%3)*10);scene.add(lamp);const bulb=game.models.sphere(.11,i%2?'#ffd29b':'#b2d6ef');bulb.position.copy(lamp.position);scene.add(bulb);}
const body=world.addBody({position:new T.Vector3(0,0,5),radius:.4,height:1.8});
const look=game.controls.firstPerson(body,world,{speed:4.4,sensitivity:.0022,eyeHeight:1.62});
const infected=[]; let kills=0, health=100, attackClock=0, spawnClock=0, ended=false;
function makeInfected(index){const g=new T.Group();g.position.set([-10,0,10][index%3],0,-8-Math.floor(index/3)*5);const torso=game.models.capsule(.34,.62,index%3?'#63705d':'#766e58');torso.position.y=1.05;g.add(torso);const head=game.models.sphere(.28,'#9a8d73');head.position.y=1.72;g.add(head);for(const s of [-1,1]){const arm=game.models.box(.17,.66,.2,'#4a5146');arm.position.set(s*.43,1.12,.03);arm.rotation.z=s*.15;g.add(arm);const eye=game.models.sphere(.045,'#e87055');eye.position.set(s*.11,1.77,-.24);g.add(eye);}scene.add(g);infected.push({root:g,hp:2,hit:0,id:index});}
for(let i=0;i<5;i++)makeInfected(i);
function fire(){if(ended)return;const hits=game.input.raycast([...obstacles,...infected.map(z=>z.root)]);if(!hits.length)return;game.particles.burst(hits[0].point,{count:7,color:'#efbd83',speed:1.6,lifetime:.28});let n=hits[0].object;while(n&&n.parent!==scene)n=n.parent;const target=infected.find(z=>z.root===n);if(!target||hits[0].distance>24)return;target.hp--;target.hit=.16;game.audio.play('hit',target.hp?230:520);if(target.hp<=0){scene.remove(target.root);infected.splice(infected.indexOf(target),1);kills++;game.setScore(kills);if(kills>=12){ended=true;game.win('Twelve infected down. The extraction beacon is yours.');return;}if(infected.length<4)makeInfected(kills+infected.length);}}
game.input.onFire(fire);
return {update(dt){if(ended)return;attackClock+=dt;spawnClock+=dt;for(let i=infected.length-1;i>=0;i--){const z=infected[i],dx=body.position.x-z.root.position.x,dz=body.position.z-z.root.position.z,dist=Math.hypot(dx,dz);if(z.hit>0){z.hit-=dt;z.root.children[0].material.emissive.set('#572019');}else z.root.children[0].material.emissive.set('#000000');if(dist>1.35){z.root.position.x+=dx/dist*.64*dt;z.root.position.z+=dz/dist*.64*dt;z.root.rotation.y=Math.atan2(dx,dz);z.root.children[1].position.y=1.72+Math.sin(game.time*5+z.id)*.045;}else if(attackClock>.75){attackClock=0;health=Math.max(0,health-14);game.audio.play('hurt',110);if(health<=0){ended=true;game.lose('You were overrun. Hold the courtyard longer on your next run.');}}}game.setStatus('HEALTH '+health+'%  ·  INFECTED '+kills+'/12');if(spawnClock>7&&infected.length<5){spawnClock=0;makeInfected(kills+infected.length+2);}},qaAction(){fire();fire();return kills;},qaSnapshot(){return {kills,health,zombies:infected.length,targetHp:infected.find(z=>Math.abs(z.root.position.x-body.position.x)<1)?.hp??0};},reset(){ended=false;kills=0;health=100;attackClock=0;spawnClock=0;game.particles.clear();game.setScore(0);game.setStatus('HEALTH 100%  ·  INFECTED 0/12');look.reset();body.position.set(0,0,5);body.velocity.set(0,0,0);for(const z of infected)scene.remove(z.root);infected.length=0;for(let i=0;i<5;i++)makeInfected(i);}};
`,
};
