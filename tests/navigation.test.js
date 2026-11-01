import test from 'node:test';
import assert from 'node:assert/strict';
import {ROADS,NPC_STOPS,snap,pathfind,advance,walkable,segmentWalkable,moveOnRoad,dist} from '../src/world.js';

test('actual roof, factory, river and field positions are not walkable',()=>{
 for(const p of [{x:715,y:552},{x:463,y:488},{x:1115,y:493},{x:348,y:445},{x:925,y:237},{x:1000,y:600},{x:670,y:445},{x:270,y:270}]){
  assert.equal(walkable(p.x,p.y),false,JSON.stringify(p));
 }
});
test('every resident route stays continuously on the exact road graph',()=>{
 const origin=snap({x:531,y:619});
 for(const [id,p] of Object.entries(NPC_STOPS)){
  const route=pathfind(origin,p);assert.ok(route.length,id);
  let previous=origin;
  for(const next of route){assert.ok(segmentWalkable(previous,next),`${id}: ${JSON.stringify(previous)} → ${JSON.stringify(next)}`);previous=next;}
  assert.ok(dist(previous,p)<.001,id);
 }
});
test('snap projects to a road rather than a grid square, and paths keep off-center starts',()=>{
 const road=ROADS[2],a=road[5],b=road[6],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy);
 const center={x:(a[0]+b[0])/2,y:(a[1]+b[1])/2};
 const p={x:center.x-dy/len*6,y:center.y+dx/len*6};
 assert.ok(walkable(p.x,p.y));assert.ok(dist(snap(p),center)<.001);
 const route=pathfind(p,NPC_STOPS.farmer);
 assert.ok(dist(route[0],center)<.001);
 const original={...p};advance(p,route,1);assert.ok(Math.abs(dist(original,p)-1)<.001);
});
test('large manual inputs stay continuously on roads instead of tunneling through buildings',()=>{
 const positions=[],start={...NPC_STOPS.owl};
 const player=new Proxy(start,{set(target,key,value){target[key]=value;if(key==='y')positions.push({...target});return true;}});
 moveOnRoad(player,300,-160);
 let previous={...NPC_STOPS.owl};
 for(const next of positions){assert.ok(segmentWalkable(previous,next),JSON.stringify({previous,next}));previous=next;}
 assert.ok(positions.length>100);assert.ok(walkable(start.x,start.y));
 const bridge={x:660,y:496};assert.equal(segmentWalkable(bridge,{x:732,y:711}),false);
});
test('centerline routing goes around the factory instead of cutting through its roof',()=>{
 const start={...NPC_STOPS.owl},route=pathfind(start,NPC_STOPS.grower);
 assert.ok(route.some(p=>p.x===535&&p.y===546));
 assert.ok(route.some(p=>p.x===790&&p.y===441));
 let previous=start;for(const next of route){assert.ok(segmentWalkable(previous,next));previous=next;}
});
test('holding a horizontal direction follows a sloped road without leaving it',()=>{
 const p={x:649,y:663},start={...p};
 for(let i=0;i<80;i++){
  const before={...p};moveOnRoad(p,4,0);
  assert.ok(walkable(p.x,p.y));assert.ok(segmentWalkable(before,p));
  assert.ok(p.x>=before.x-EPSILON);
 }
 assert.ok(p.x-start.x>200,JSON.stringify(p));
 assert.ok(p.y-start.y>70,JSON.stringify(p));
});
test('pushing perpendicularly into a road edge stops instead of drifting along it',()=>{
 const a={x:622,y:650},b={x:676,y:676},length=dist(a,b);
 const normal={x:-(b.y-a.y)/length,y:(b.x-a.x)/length};
 const p={x:(a.x+b.x)/2+normal.x*9,y:(a.y+b.y)/2+normal.y*9},start={...p};
 for(let i=0;i<40;i++)moveOnRoad(p,normal.x*4,normal.y*4);
 assert.ok(walkable(p.x,p.y));assert.ok(dist(start,p)<.001,JSON.stringify(p));
});
const EPSILON=1e-7;

test('all eight input directions can follow a matching road through its bend or junction',()=>{
 const q=Math.SQRT1_2;
 const cases=[
  ['right',{x:523,y:565},1,0],['left',{x:790,y:441},-1,0],
  ['up',{x:790,y:733},0,-1],['down',{x:584,y:316},0,1],
  ['up-right',{x:660,y:496},q,-q],['down-left',{x:724,y:469},-q,q],
  ['down-right',{x:622,y:650},q,q],['up-left',{x:849,y:762},-q,-q],
 ];
 for(const [name,start,dx,dy] of cases){
  const p={...start};
  for(let i=0;i<60;i++){
   const before={...p};moveOnRoad(p,dx*3,dy*3);
   assert.ok(segmentWalkable(before,p),name);
   assert.ok((p.x-before.x)*dx+(p.y-before.y)*dy>=-EPSILON,name+' moved against input');
  }
  assert.ok(dist(start,p)>150,name+': '+JSON.stringify(p));
 }
});
test('tiny joystick steps keep moving around a bend without accumulating curb offset',()=>{
 const start={x:523,y:565},fine={...start},coarse={...start};
 for(let i=0;i<1200;i++)moveOnRoad(fine,.15,0);
 for(let i=0;i<60;i++)moveOnRoad(coarse,3,0);
 assert.ok(dist(start,fine)>150);assert.ok(dist(fine,coarse)<3,JSON.stringify({fine,coarse}));
});
