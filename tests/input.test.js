import test from 'node:test';
import assert from 'node:assert/strict';
import {joystickVector} from '../src/input.js';
import {movementSteps,moveSpeed} from '../src/motion.js';
test('small center touches are idle while a clear joystick direction scales smoothly',()=>{
 for(const p of [[0,0],[2,-3],[8,0]])assert.deepEqual(joystickVector(...p),{x:0,y:0});
 const small=joystickVector(12,0),large=joystickVector(30,0);assert.ok(small.x>0&&small.x<large.x);assert.equal(large.x,1);
 assert.ok(Math.abs(Math.hypot(...Object.values(joystickVector(100,100)))-1)<.0001);
});
test('slow and fast frame rates cover the same distance with small physics steps',()=>{
 function travel(frameTime,frames){let speed=0,distance=0;for(let i=0;i<frames;i++)for(const dt of movementSteps(frameTime)){assert.ok(dt<=1/60+.0001);speed=moveSpeed(speed,true,dt);distance+=speed*dt;}return distance;}
 assert.ok(Math.abs(travel(1/60,60)-travel(.1,10))<.001);
 assert.ok(Math.abs(travel(1/60,60)-travel(.05,20))<.001);
 assert.ok(Math.abs(travel(1/60,60)-travel(.2,5))<.001);
 assert.ok(Math.abs(travel(1/60,60)-travel(1,1))<.001);
 assert.equal(movementSteps(NaN).length,0);assert.ok(movementSteps(20).reduce((a,b)=>a+b,0)<=1.00001);
});
