import test from 'node:test';
import assert from 'node:assert/strict';
import {NPCS,QUESTS} from '../src/data.js';
import {pathfind,snap,advance,walkable,dist} from '../src/world.js';
import {fresh,mark,ready,recordComparison,complete,currentQuest,restore} from '../src/state.js';
test('every mission NPC and evidence is reachable from the entrance',()=>{const origin=snap(fresh());for(const p of [...NPCS,...QUESTS.map(q=>q.clue)]){const route=pathfind(origin,p);assert.ok(route.length,JSON.stringify(p));assert.ok(route.every(p=>walkable(p.x,p.y)));assert.ok(dist(route.at(-1),snap(p))<1)}});
test('walking advances along roads and reaches the target without teleporting',()=>{const player=snap(fresh()),target=snap(NPCS[1]),route=pathfind(player,target),before={...player};advance(player,route,10);assert.ok(dist(player,before)<=10.001);assert.ok(dist(player,target)>20);advance(player,route,10000);assert.equal(route.length,0);assert.ok(dist(player,target)<.001)});
test('both eras are needed and each mission awards completion once',()=>{const s=fresh();for(const q of QUESTS){assert.equal(currentQuest(s).id,q.id);assert.equal(complete(s,q),false);mark(s,q.id,'seen','past');mark(s,q.id,'seen','past');assert.equal(s.progress[q.id].seen.length,1);assert.equal(ready(s,q),false);mark(s,q.id,'seen','now');assert.equal(ready(s,q),true);assert.equal(complete(s,q),false);assert.equal(recordComparison(s,q),true);assert.equal(complete(s,q),true);assert.equal(complete(s,q),false)}assert.equal(s.completed.length,QUESTS.length);assert.equal(currentQuest(s),null)});
test('progress survives reload; corrupt saves and invalid avatars are rejected',()=>{const s=fresh(3,'탐정');mark(s,QUESTS[0].id,'seen','past');const r=restore(JSON.stringify(s));assert.equal(r.name,'탐정');assert.equal(r.avatar,3);assert.deepEqual(r.progress.rice.seen,['past']);assert.equal(restore('not json'),null);assert.equal(restore(JSON.stringify({...s,avatar:20})),null)});
test('comparison cannot be completed from one time period or legacy quiz data',()=>{
 const s=fresh(2,'새탐정'),q=QUESTS[0];mark(s,q.id,'seen','past');assert.equal(recordComparison(s,q),false);assert.equal(complete(s,q),false);
 const old={...s,version:2,intro:true,completed:['rice','grow','homes','jobs','culture','travel'],ending:true,progress:{rice:{seen:['past','now'],met:['past','now']}}};
 const r=restore(JSON.stringify(old));assert.equal(r.avatar,2);assert.equal(r.name,'새탐정');assert.equal(r.intro,true);assert.deepEqual(r.completed,[]);assert.deepEqual(r.progress.rice.seen,[]);assert.equal(r.ending,false);
});
test('a forged completed list cannot restore a missing comparison',()=>{
 const s=fresh();s.completed=['rice'];s.progress.rice.seen=['past','now'];assert.deepEqual(restore(JSON.stringify(s)).completed,[]);
});
