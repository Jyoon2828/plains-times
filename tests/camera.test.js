import test from 'node:test';
import assert from 'node:assert/strict';
import {WIDTH,HEIGHT} from '../src/data.js';
import {viewScale,cameraFrame} from '../src/camera.js';
test('wide village view fills the viewport without bars and walking stays closer',()=>{
 for(const [w,h] of [[1280,655],[1909,846],[1920,1015],[1024,703],[390,700],[3440,1440]]){
  const wide=viewScale(w,h,true),close=viewScale(w,h,false);
  assert.ok(WIDTH*wide>=w-.001&&HEIGHT*wide>=h-.001);assert.ok(close>wide);
  assert.ok(Math.abs(wide-Math.max(w/WIDTH,h/HEIGHT))<.00001);
 }
});
test('walking camera zooms gradually without exposing the edge of the world',()=>{
 const w=1280,h=655,p={x:24,y:24},start={x:0,y:0,zoom:viewScale(w,h,true)};
 const first=cameraFrame(start,p,w,h,{dt:1/60});
 assert.ok(first.zoom>start.zoom&&first.zoom<viewScale(w,h,false));
 let c=first;for(let i=0;i<200;i++)c=cameraFrame(c,p,w,h,{dt:1/60});
 assert.ok(c.x<=0&&c.x>=w-WIDTH*c.zoom);assert.ok(c.y<=0&&c.y>=h-HEIGHT*c.zoom);
});
test('reduced motion and overview switch settle immediately when requested',()=>{
 const c=cameraFrame({x:-1000,y:-800,zoom:2},{x:1300,y:900},1280,655,{overview:true,reducedMotion:true});
 assert.equal(c.zoom,viewScale(1280,655,true));assert.ok(c.y<=0&&c.y>=655-HEIGHT*c.zoom);
 assert.ok(Math.abs(c.x)<.001);
});
test('viewport resize never reveals empty background while zoom is settling',()=>{
 const c=cameraFrame({x:20,y:0,zoom:.5},{x:400,y:500},1909,846,{overview:false,dt:1/60});
 assert.ok(WIDTH*c.zoom>=1909&&HEIGHT*c.zoom>=846);
 assert.ok(c.x<=0&&c.x+WIDTH*c.zoom>=1909-.001);
 assert.ok(c.y<=0&&c.y+HEIGHT*c.zoom>=846-.001);
});
