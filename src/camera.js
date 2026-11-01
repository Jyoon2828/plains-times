import {WIDTH,HEIGHT} from './data.js';

const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
export function viewScale(width,height,overview=false){
 const w=Math.max(1,width),h=Math.max(1,height);
 return overview?Math.min(w/WIDTH,h/HEIGHT):clamp(Math.max(w/760,h/420),1.6,2.6);
}
export function cameraBounds(value,viewport,world){
 return world<=viewport?(viewport-world)/2:clamp(value,viewport-world,0);
}
export function cameraFrame(previous,player,width,height,{overview=false,dialogue=false,dt=1/60,immediate=false,reducedMotion=false}={}){
 const target=viewScale(width,height,overview),t=immediate||reducedMotion?1:1-Math.exp(-Math.max(0,Math.min(.1,dt))*5);
 const zoom=previous.zoom+(target-previous.zoom)*t;
 const tx=cameraBounds(width*.5-player.x*zoom,width,WIDTH*zoom);
 const ty=cameraBounds(height*(dialogue?.48:.58)-player.y*zoom,height,HEIGHT*zoom);
 const follow=immediate||reducedMotion?1:1-Math.exp(-Math.max(0,Math.min(.1,dt))*7);
 return {zoom,x:cameraBounds(previous.x+(tx-previous.x)*follow,width,WIDTH*zoom),y:cameraBounds(previous.y+(ty-previous.y)*follow,height,HEIGHT*zoom)};
}
