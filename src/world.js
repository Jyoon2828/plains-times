import {WIDTH,HEIGHT} from './data.js';

// Feet follow the visible paved roads in both village illustrations. In
// particular there are no shortcuts through the factory, houses or rice fields.
// Junctions are repeated exactly, so the graph joins only where roads meet.
export const ROADS=[
 [[8,507],[80,533],[160,552],[245,569],[325,581],[399,584],[442,580],[490,562],[535,546],[597,522],[660,496],[724,469],[790,441],[850,416],[919,390],[985,367],[1040,344],[1066,330],[1073,319]],
 [[748,125],[704,162],[661,197],[622,230],[596,262],[584,290],[584,316],[591,340],[609,359],[640,379],[684,402],[735,425],[790,441]],
 [[535,546],[523,565],[520,584],[526,600],[546,615],[571,628],[622,650],[676,676],[732,705],[790,733],[849,762],[909,793],[970,823],[1030,855],[1090,887],[1150,920],[1210,954],[1272,988]],
 [[790,733],[787,765],[762,791],[728,817],[687,843],[643,871],[598,897],[551,924],[527,941]],
 [[8,720],[76,749],[142,777],[209,806],[277,836],[346,866],[414,896],[477,924],[527,947],[550,962]],
 [[527,941],[527,947]],
];
const ROAD_HALF_WIDTH=9;
const EPS=1e-7;
export const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const asPoint=a=>({x:a[0],y:a[1]});
export const segments=ROADS.flatMap(p=>p.slice(1).map((b,i)=>[p[i],b]));
function projection(p,a,b){
 const dx=b[0]-a[0],dy=b[1]-a[1],den=dx*dx+dy*dy;
 const t=Math.max(0,Math.min(1,((p.x-a[0])*dx+(p.y-a[1])*dy)/(den||1)));
 const point={x:a[0]+t*dx,y:a[1]+t*dy};
 return {point,t,distance:dist(p,point)};
}
function nearest(p){
 const safe={x:Number.isFinite(p?.x)?p.x:WIDTH/2,y:Number.isFinite(p?.y)?p.y:HEIGHT/2};
 let best=null;
 for(let i=0;i<segments.length;i++){
  const [a,b]=segments[i],hit=projection(safe,a,b);
  if(!best||hit.distance<best.distance)best={...hit,index:i};
 }
 return best;
}
export function snap(p){return {...nearest(p).point};}
export function walkable(x,y){return Number.isFinite(x)&&Number.isFinite(y)&&x>0&&y>0&&x<WIDTH&&y<HEIGHT&&nearest({x,y}).distance<=ROAD_HALF_WIDTH+EPS;}

// Sample a swept feet segment, not just its endpoint: a large frame delta can
// never tunnel across a hedge or jump between nearby road bends.
export function segmentWalkable(a,b){
 if(!walkable(a.x,a.y)||!walkable(b.x,b.y))return false;
 const steps=Math.max(1,Math.ceil(dist(a,b)/2));
 for(let i=1;i<steps;i++)if(!walkable(a.x+(b.x-a.x)*i/steps,a.y+(b.y-a.y)*i/steps))return false;
 return true;
}
export function moveOnRoad(player,dx,dy){
 if(!Number.isFinite(dx)||!Number.isFinite(dy))return player;
 if(!walkable(player.x,player.y))Object.assign(player,snap(player));
 const amount=Math.hypot(dx,dy);if(amount<EPS)return player;
 const steps=Math.max(1,Math.ceil(amount/2)),sx=dx/steps,sy=dy/steps;
 for(let i=0;i<steps;i++){
  const requested=Math.hypot(sx,sy),lookahead=14;let guided=null,best=-Infinity;
  // Steer toward the road ahead before reaching its curb. Keeping the old
  // lateral offset while sliding made bends impossible to follow; repeatedly
  // switching between free movement and curb sliding also flickered the gait.
  // Only local capsules are considered, and every actual step is swept-tested.
  for(const [a,b] of segments){
   const hit=projection(player,a,b);if(hit.distance>ROAD_HALF_WIDTH+EPS)continue;
   const length=Math.hypot(b[0]-a[0],b[1]-a[1]);if(length<EPS)continue;
   const ux=(b[0]-a[0])/length,uy=(b[1]-a[1])/length;
   const forward=sx*ux+sy*uy,alignment=Math.abs(forward)/requested;
   // Allow a cardinal key to follow an angled street, while a perpendicular
   // push into a house/field cannot create arbitrary sideways movement.
   if(alignment<.35)continue;
   const ahead=Math.max(0,Math.min(1,hit.t+Math.sign(forward)*lookahead/length));
   const target={x:a[0]+ahead*(b[0]-a[0]),y:a[1]+ahead*(b[1]-a[1])};
   const distance=dist(player,target);if(distance<EPS)continue;
   const tx=(target.x-player.x)/distance,ty=(target.y-player.y)/distance;
   const intent=(tx*sx+ty*sy)/requested;if(intent<=.05)continue;
   const step=Math.min(requested,distance);
   const candidate={x:player.x+tx*step,y:player.y+ty*step};
   if(!segmentWalkable(player,candidate))continue;
   const score=alignment*.7+intent*.3-hit.distance*.005;
   if(score>best){best=score;guided=candidate;}
  }
  if(guided){Object.assign(player,guided);continue;}
  const direct={x:player.x+sx,y:player.y+sy};
  if(segmentWalkable(player,direct))Object.assign(player,direct);
 }
 return player;
}

// The pathfinder follows exact centerline segments. A wide raster corridor can
// connect roads across a roof or cut a corner; this graph has no such edges.
const nodes=[],nodeKeys=new Map(),base=[];
function nodeAt(a){const key=a.join(',');if(nodeKeys.has(key))return nodeKeys.get(key);const id=nodes.length;nodes.push(asPoint(a));base.push([]);nodeKeys.set(key,id);return id;}
const edges=segments.map(([a,b])=>{
 const ai=nodeAt(a),bi=nodeAt(b),length=dist(nodes[ai],nodes[bi]);
 base[ai].push({to:bi,length});base[bi].push({to:ai,length});
 return {a:ai,b:bi};
});
export function pathfind(start,end){
 const from=nearest(start),to=nearest(end);
 if(dist(start,to.point)<EPS)return [];
 const points=nodes.map(p=>({...p})),graph=base.map(es=>es.map(e=>({...e})));
 function attach(hit){
  const id=points.length;points.push(hit.point);graph.push([]);
  const edge=edges[hit.index];
  for(const n of [edge.a,edge.b]){const length=dist(hit.point,points[n]);graph[id].push({to:n,length});graph[n].push({to:id,length});}
  return id;
 }
 const source=attach(from),goal=attach(to);
 if(from.index===to.index){const length=dist(from.point,to.point);graph[source].push({to:goal,length});graph[goal].push({to:source,length});}
 const costs=new Map([[source,0]]),previous=new Map(),open=new Set([source]);
 while(open.size){
  let current=-1,score=Infinity;
  for(const id of open){const value=costs.get(id)+dist(points[id],points[goal]);if(value<score){score=value;current=id;}}
  if(current===goal){
   const ids=[goal];while(previous.has(current)){current=previous.get(current);ids.push(current);}
   const line=ids.reverse().map(i=>({...points[i]}));
   // Walking from an off-center position to its own projection is inside the
   // same capsule, and is retained as a real movement rather than a teleport.
   if(dist(start,line[0])<EPS)line.shift();
   return line.filter((p,i,a)=>i===0||dist(p,a[i-1])>EPS);
  }
  open.delete(current);
  for(const edge of graph[current]){
   const cost=costs.get(current)+edge.length;
   if(cost<(costs.get(edge.to)??Infinity)-EPS){costs.set(edge.to,cost);previous.set(edge.to,current);open.add(edge.to);}
  }
 }
 return [];
}
export function advance(player,path,amount){
 amount=Number.isFinite(amount)?Math.max(0,amount):0;
 while(path.length&&amount>0){
  const next=path[0],d=dist(player,next);
  if(d<EPS){path.shift();continue;}
  if(d<=amount){player.x=next.x;player.y=next.y;amount-=d;path.shift();}
  else{player.x+=(next.x-player.x)/d*amount;player.y+=(next.y-player.y)/d*amount;amount=0;}
 }
 return player;
}

// Meet residents at a shared, visible roadside location in both eras.
export const NPC_STOPS=Object.fromEntries(Object.entries({
 owl:{x:571,y:628},farmer:{x:591,y:340},grower:{x:1040,y:344},
 neighbor:{x:399,y:584},worker:{x:849,y:762},
 curator:{x:246,y:822},traveler:{x:1210,y:954},
}).map(([id,p])=>[id,snap(p)]));
