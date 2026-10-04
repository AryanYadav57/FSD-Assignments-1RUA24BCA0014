import { buildRuntimeHtml, type GameModuleV1 } from '../src/runtime/v1';
import { buildRuntimeHtmlV2, type GameModuleV2 } from '../src/runtime/v2';
import { buildRacerFoundation } from '../src/runtime/v2/racer-foundation';
import { buildSurvivalFoundation } from '../src/runtime/v2/survival-foundation';
import { zombieShowcase } from '../src/runtime/v2/zombie-showcase';
import { runBrowserQa } from '../src/services/browser-qa';

const twoDimensionalFixture: GameModuleV1 = {
  version: 1,
  title: 'Runtime QA Fixture',
  objective: 'Keep the game document responsive and ready for play.',
  instructions: 'WASD / arrows to move · Space to act · Esc to pause',
  palette: { sky: '#111820', ground: '#292e32', accent: '#704843', highlight: '#dfb17b' },
  module: `return { update(){}, render(ctx,engine){ const {width,height}=engine.viewport(); ctx.fillStyle=engine.palette.sky; ctx.fillRect(0,0,width,height); ctx.fillStyle=engine.palette.highlight; ctx.fillRect(width/2-8,height/2-8,16,16); } };`,
};

const generatedVehicleCompatibilityFixture: GameModuleV2 = {
  version: 2,
  title: 'Vehicle Controls Compatibility',
  objective: 'Drive the vehicle around the test scene.',
  instructions: 'WASD or arrow keys to drive · Space for action · Esc to pause',
  palette: { sky: '#111820', ground: '#292e32', accent: '#704843', highlight: '#dfb17b' },
  module: `const world=game.physics.createWorld({floorY:0});game.physics.createBox({position:{x:0,y:-.5,z:0},size:{x:12,y:1,z:12},color:'#292e32'});const car=game.models.box(1,0.5,1.8,'#704843');car.position.y=.4;game.scene.add(car);game.physics.createBox(4,-.4,0,1,1,1,'#704843');game.vehicle(car);game.thirdPerson(car,{distance:6,height:3});return{update(dt){world.step(dt)},qaAction(){game.setScore(game.score+1);return true},qaSnapshot(){return{score:game.score}},reset(){car.position.set(0,.4,0);game.setScore(0)}};`,
};

const customProgressFixture: GameModuleV2 = {
  version: 2,
  title: 'Custom Progress Snapshot',
  objective: 'Move the progress marker forward. ',
  instructions: 'WASD or arrows to move · Space for action · Esc to pause',
  palette: { sky: '#111820', ground: '#292e32', accent: '#704843', highlight: '#dfb17b' },
  // This intentionally leaves game.score unchanged: QA must read the module's
  // live qaSnapshot after the action rather than a stale RAF-published copy.
  module: `let playerProgress=0;const marker=game.models.box(.5,.5,.5,'#dfb17b');game.scene.add(marker);return{update(){},qaAction(){playerProgress+=1;marker.position.x=playerProgress;return true},qaSnapshot(){return{playerProgress}},reset(){playerProgress=0;marker.position.x=0}};`,
};

const authoredRacerFixture = buildRacerFoundation({ title: 'QA Circuit', theme: 'night-city', laps: 1, rivalCount: 2, difficulty: 'standard' });
const authoredSurvivalFixture = buildSurvivalFoundation('3D zombie shooter survival');

async function main() {
  const cases: [string, string, 1 | 2, boolean?][] = [
    ['Canvas 2D v1 fixture', buildRuntimeHtml(twoDimensionalFixture), 1],
    ['Generated vehicle helper compatibility', await buildRuntimeHtmlV2(generatedVehicleCompatibilityFixture), 2],
    ['Live custom progress snapshot', await buildRuntimeHtmlV2(customProgressFixture), 2],
    ['Authored 3D racer foundation', await buildRuntimeHtmlV2(authoredRacerFixture), 2, true],
    ['Authored 3D zombie survival foundation', await buildRuntimeHtmlV2(authoredSurvivalFixture), 2, true],
    ['Three.js 3D showcase', await buildRuntimeHtmlV2(zombieShowcase), 2],
  ];
  let failed = false;
  for (const [name, html, version, requireVisualScene] of cases) {
    const result = await runBrowserQa(html, 20_000, version, requireVisualScene);
    console.log(`${result.passed ? 'PASS' : 'FAIL'} ${name}: ${result.diagnostics}`);
    failed ||= !result.passed;
  }
  if (failed) process.exitCode = 1;
}

void main();
