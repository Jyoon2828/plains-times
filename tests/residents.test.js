import test from 'node:test';
import assert from 'node:assert/strict';
import {NPCS} from '../src/data.js';
import {fresh} from '../src/state.js';
import {segments,snap,walkable,dist,segmentWalkable,advance} from '../src/world.js';
import {placeResidents,standingClear,clearOfResidents,safeStandingPoint,meetingRoute,guardResidentFeet,TALK_RANGE,FEET_GAP} from '../src/residents.js';
const residents=placeResidents(NPCS);
test('resident feet stand away from the road lane and every route can pass them',()=>{
 for(const resident of residents){assert.ok(dist(resident,snap(resident))>60,resident.id);assert.equal(walkable(resident.x,resident.y),false);}
 for(const [a,b] of segments){const p={x:a[0],y:a[1]},before={...p};guardResidentFeet(before,Object.assign(p,{x:b[0],y:b[1]}),residents);assert.deepEqual(p,{x:b[0],y:b[1]});}
});
test('all approaches stop with clear bodies and labels before opening a resident',()=>{
 const starts=[fresh(),...residents.map(n=>n.anchor)];
 for(const start of starts)for(const n of residents){
  const origin=safeStandingPoint(start,residents),result=meetingRoute(origin,n,residents);assert.ok(result,n.id);
  assert.ok(standingClear(result.destination,n),n.id);assert.ok(clearOfResidents(result.destination,residents));assert.ok(dist(result.destination,n)<=TALK_RANGE);
  for(const other of residents)if(other.id!==n.id)assert.ok(dist(result.destination,other)>=dist(result.destination,n)+8,n.id+' remains the nearest resident');
  let last=origin;for(const next of result.route){assert.ok(segmentWalkable(last,next),n.id);last=next;}
  const p={...origin};advance(p,result.route,100000);assert.ok(dist(p,result.destination)<.001);
 }
});
test('fresh and legacy overlapping positions are restored onto a clear road location',()=>{
 for(const start of [fresh(),...residents,...residents.map(n=>n.anchor)]){
  const p=safeStandingPoint(start,residents);assert.ok(walkable(p.x,p.y));assert.ok(clearOfResidents(p,residents));assert.ok(dist(p,snap(start))<220);
 }
});
test('direct control never steps onto resident feet',()=>{
 const n=residents[0],before={x:n.x+FEET_GAP+3,y:n.y},after={x:n.x+FEET_GAP-3,y:n.y};guardResidentFeet(before,after,residents);assert.deepEqual(after,before);
});
