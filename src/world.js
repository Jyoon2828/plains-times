import {WIDTH,HEIGHT} from './data.js';
export const ROADS=[
[[0,530],[150,560],[300,570],[415,558],[480,535],[535,505],[590,470],[680,440],[770,400],[850,355],[930,320],[1018,327],[1060,305],[1080,260],[1110,200]],
[[590,470],[550,410],[540,355],[570,310],[578,260],[600,210],[670,163],[760,122],[940,95],[1100,140]],
[[535,505],[510,555],[525,615],[568,640],[650,695],[780,770],[900,830],[1040,920],[1160,980]],
[[850,355],[900,400],[950,452],[980,495],[990,555],[1080,600],[1150,660],[1230,720],[1300,760],[1280,840],[1202,927],[1160,980]],
[[650,695],[760,690],[890,660],[990,555]],
[[20,410],[150,445],[280,475],[415,500],[480,535]],
[[160,700],[210,730],[280,780],[330,830],[400,870],[580,900],[650,875],[720,835],[780,770]],
[[1360,380],[1380,470],[1360,580],[1360,670],[1320,800],[1280,1000]],
[[1300,530],[1470,560]],
[[270,769],[193,724],[160,700]],
[[540,355],[445,328],[380,326]],
[[1018,327],[1056,274]],
[[1230,720],[1251,740]],
[[760,690],[715,681]],
[[1202,927],[1175,872]],
[[1251,740],[1300,760]],
[[650,695],[568,720],[445,735],[330,760],[280,780]],
[[1160,980],[1280,1000]],
[[300,570],[330,650],[280,700],[210,730]],
];
const STEP=16,COLS=Math.ceil(WIDTH/STEP),ROWS=Math.ceil(HEIGHT/STEP);
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
function distanceSegment(x,y,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy||1)));return Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy)}
export const segments=ROADS.flatMap(p=>p.slice(1).map((b,i)=>[p[i],b]));
const grid=new Uint8Array(COLS*ROWS);
for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){const x=c*STEP+STEP/2,y=r*STEP+STEP/2;if(x<8||x>WIDTH-8||y<8||y>HEIGHT-8)continue;if(segments.some(([a,b])=>distanceSegment(x,y,a,b)<24))grid[r*COLS+c]=1;}
const cell=p=>({c:Math.max(0,Math.min(COLS-1,Math.floor(p.x/STEP))),r:Math.max(0,Math.min(ROWS-1,Math.floor(p.y/STEP)))});
const point=i=>({x:i%COLS*STEP+STEP/2,y:Math.floor(i/COLS)*STEP+STEP/2});
export function walkable(x,y){const {c,r}=cell({x,y});return x>0&&y>0&&x<WIDTH&&y<HEIGHT&&!!grid[r*COLS+c]}
export function snap(p){let best=-1,d=Infinity;for(let i=0;i<grid.length;i++)if(grid[i]){const v=point(i),n=(v.x-p.x)**2+(v.y-p.y)**2;if(n<d){d=n;best=i}}return point(best)}
export function pathfind(start,end){const a=cell(snap(start)),b=cell(snap(end)),si=a.r*COLS+a.c,gi=b.r*COLS+b.c;const open=new Set([si]),came=new Map(),g=new Map([[si,0]]),f=new Map([[si,dist(point(si),point(gi))]]);while(open.size){let cur=-1,low=Infinity;for(const i of open)if(f.get(i)<low){cur=i;low=f.get(i)}if(cur===gi){let out=[point(cur)];while(came.has(cur)){cur=came.get(cur);out.push(point(cur))}return out.reverse().slice(1)}open.delete(cur);const c=cur%COLS,r=Math.floor(cur/COLS);for(const [dc,dr]of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){const nc=c+dc,nr=r+dr;if(nc<0||nr<0||nc>=COLS||nr>=ROWS)continue;const ni=nr*COLS+nc;if(!grid[ni]||(dc&&dr&&(!grid[r*COLS+nc]||!grid[nr*COLS+c])))continue;const ng=g.get(cur)+Math.hypot(dc,dr)*STEP;if(ng<(g.get(ni)??Infinity)){came.set(ni,cur);g.set(ni,ng);f.set(ni,ng+dist(point(ni),point(gi)));open.add(ni)}}}return []}
export function advance(player,path,amount){while(path.length&&amount>0){const next=path[0],d=dist(player,next);if(d<=amount){player.x=next.x;player.y=next.y;amount-=d;path.shift()}else{player.x+=(next.x-player.x)/d*amount;player.y+=(next.y-player.y)/d*amount;amount=0}}return player}
export {dist};
