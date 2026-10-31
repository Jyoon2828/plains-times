import {WALK_ATLASES} from './walk-atlases.js';

// Normalize each source frame to a stable ground line. The generated sheet's
// transparent margins never become a visible hop when the feet alternate.
export function layoutFrame(frame,baseline=96,height=89){
 const [sx,sy,sw,sh]=frame;
 const scale=height/sh;
 return {sx,sy,sw,sh,dx:40-sw*scale/2,dy:baseline-height,dw:sw*scale,dh:height};
}
export function createWalker(host){
 const canvas=document.createElement('canvas');
 canvas.width=160;canvas.height=200;canvas.setAttribute('aria-hidden','true');
 const ctx=canvas.getContext('2d');
 const cache=new Map();let selected=0,loaded=false,lastGait={frame:0,row:0,flip:false,bob:0};
 function sheet(index){
  if(cache.has(index))return cache.get(index);
  const entry={image:new Image(),loaded:false};cache.set(index,entry);
  entry.image.onload=()=>{entry.loaded=true;if(index===selected){loaded=true;host.classList.add('walk-ready');render(lastGait);}};
  entry.image.onerror=()=>{if(index===selected){loaded=false;host.classList.remove('walk-ready');}};
  entry.image.src=WALK_ATLASES[index].src;
  return entry;
 }
 function select(index){
  selected=index;loaded=false;
  if(!host.contains(canvas))host.append(canvas);
  lastGait={frame:0,row:0,flip:false,bob:0};
  const entry=sheet(index);loaded=entry.loaded;
  host.classList.toggle('walk-ready',loaded);render(lastGait);
 }
 function render(gait){
  lastGait=gait;
  const spec=WALK_ATLASES[selected];if(!spec||!loaded)return;
  const frame=spec.frames[gait.row*4+gait.frame],box=layoutFrame(frame);
  host.classList.add('walk-ready');
  ctx.setTransform(2,0,0,2,0,0);ctx.clearRect(0,0,80,100);
  ctx.save();
  if(gait.flip){ctx.translate(80,0);ctx.scale(-1,1);}
  ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
  ctx.drawImage(cache.get(selected).image,box.sx,box.sy,box.sw,box.sh,box.dx,box.dy+(gait.bob||0),box.dw,box.dh);
  ctx.restore();
 }
 return {select,render};
}
