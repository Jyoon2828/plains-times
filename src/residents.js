import {NPC_STOPS,segments,snap,pathfind,dist} from './world.js';

// Residents stand beside the walking lane. Their road anchor is kept separate
// from their illustrated feet so a route never targets the resident's body.
const OFFSETS={owl:[-60,55],farmer:[62,-36],grower:[29,66],neighbor:[0,-72],worker:[-30,80],curator:[29,-66],traveler:[35,-63]};
export const TALK_RANGE=185;
export const BODY_GAP_X=104,BODY_GAP_Y=128,FEET_GAP=54;
export function placeResidents(list){return list.map(n=>{const original=NPC_STOPS[n.id],offset=OFFSETS[n.id]||[0,-72];const point=n.id==='neighbor'?{x:1035,y:738}:{x:original.x+offset[0],y:original.y+offset[1]};return {...n,...point,anchor:snap(point)};});}
export function standingClear(p,n){return Math.abs(p.x-n.x)>=BODY_GAP_X||Math.abs(p.y-n.y)>=BODY_GAP_Y;}
export function clearOfResidents(p,list){return list.every(n=>standingClear(p,n));}
function meetingClear(p,resident,list){
 const distance=dist(p,resident);
 return clearOfResidents(p,list)&&list.every(n=>n.id===resident.id||dist(p,n)>=distance+8);
}
const roadPoints=segments.flatMap(([a,b])=>{const length=Math.hypot(b[0]-a[0],b[1]-a[1]),count=Math.max(1,Math.ceil(length/8));return Array.from({length:count+1},(_,i)=>({x:a[0]+(b[0]-a[0])*i/count,y:a[1]+(b[1]-a[1])*i/count}));});
const routeLength=(start,route)=>route.reduce((s,p,i)=>s+dist(i?route[i-1]:start,p),0);
export function safeStandingPoint(p,list){
 const origin=snap(p);if(clearOfResidents(origin,list))return origin;
 const clear=roadPoints.filter(q=>clearOfResidents(q,list));
 return clear.sort((a,b)=>dist(origin,a)-dist(origin,b))[0]||origin;
}
export function meetingRoute(start,resident,list){
 if(dist(start,resident)<=TALK_RANGE&&meetingClear(start,resident,list))return {destination:{x:start.x,y:start.y},route:[]};
 let best=null;
 for(const candidate of roadPoints){
  const distance=dist(candidate,resident);
  if(distance>TALK_RANGE||!meetingClear(candidate,resident,list))continue;
  const route=pathfind(start,candidate);if(!route.length&&dist(start,candidate)>1)continue;
  const score=routeLength(start,route)+distance*.12;
  if(!best||score<best.score)best={destination:candidate,route,score};
 }
 return best;
}
// This is a small physical feet guard. The roadside placement leaves enough
// room to pass; broad sprite rectangles are used only when stopping to talk.
export function guardResidentFeet(before,after,list){
 if(list.some(n=>dist(after,n)<FEET_GAP&&dist(after,n)<dist(before,n)))Object.assign(after,before);
 return after;
}
