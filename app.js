/* 들빛마을 bundle v4.0.0 · 03b97b83a7b7 · node scripts/build.mjs */
;(()=>{
 'use strict';
 try{
// src/data.js
const __mod1=(()=>{

const WIDTH=1536,HEIGHT=1024;
const AVATARS=[{name:'숲빛 탐정',color:'#518d76'},{name:'노을 탐정',color:'#cc9276'},{name:'하늘 탐정',color:'#6095aa'},{name:'햇살 탐정',color:'#b8a15d'}];
const NPCS=[
{id:'owl',name:'부엉 박사',role:'시간여행 연구소',art:7,x:568,y:640,hello:'후후, 이 마을에는 시간이 남긴 이야기가 많단다. 천천히 둘러보렴.'},
{id:'farmer',name:'들녘 할아버지',role:'벼농사 이야기',art:4,x:558,y:345,hello:'넓고 평평한 들에서는 논과 밭을 볼 수 있지. 물이 어디에서 오는지도 살펴보렴.'},
{id:'grower',name:'초록 이모',role:'채소와 과일 이야기',art:5,x:1018,y:327,hello:'우리 마을에서는 여러 가지 채소와 과일도 기른단다. 이웃한 밭과 비교해 보겠니?'},
{id:'neighbor',name:'다정 선생님',role:'마을과 주거 이야기',art:6,x:379,y:555,hello:'사람들이 모여 사는 마을에는 어떤 집과 시설이 있는지 찾아보렴.'},
{id:'worker',name:'만들기 대장',role:'일터 이야기',art:5,x:834,y:727,hello:'농사를 짓는 사람도, 물건을 만드는 사람도 있지. 마을에는 여러 이웃이 살아.'},
{id:'curator',name:'이야기 선생님',role:'장보기와 문화 이야기',art:6,x:270,y:769,hello:'사람들이 만나고 문화를 즐기는 곳에도 마을의 이야기가 숨어 있단다.'},
{id:'traveler',name:'길잡이 아저씨',role:'교통 이야기',art:4,x:1202,y:927,hello:'사람과 물건이 오가는 길을 살펴보렴. 다른 지역과 이어지는 길도 있단다.'}
];
const PREVIOUS_QUESTS=[
{id:'rice',title:'논에 물이 오는 길',npc:'farmer',clue:{x:445,y:328,past:'논 옆 물길',now:'논과 농기계',pastIcon:'💧',nowIcon:'🌾'},past:['어서 오렴! 저 넓은 논을 보겠니? 평평한 들에서 벼를 기르고 있단다.','벼농사에는 물이 필요해. 하천이나 저수지의 물을 물길로 보내 이용하기도 하지. 저기 반짝이는 물길을 조사해 보렴.'],now:['다시 만났구나! 이곳에서는 지금도 벼농사를 짓고 있어.','논의 위치와 물길은 남아 있지? 농기계를 이용하는 모습도 볼 수 있단다. 논 옆 단서를 조사해 보렴.'],observations:{past:'논 가까이 물길이 이어져 있어요. 농사에 필요한 물을 보내는 길이에요.',now:'논과 물길이 남아 있어요. 지금은 농기계를 이용하여 농사짓기도 해요.'},question:'들이 펼쳐진 지역에서 논이 하천이나 저수지 가까이에 있는 까닭은?',choices:['벼농사에 필요한 물을 이용하기 좋아서','모든 사람이 물고기를 잡기 때문에','논에는 물이 전혀 필요하지 않아서'],answer:0,reason:'벼농사에 물이 필요하므로 하천이나 저수지의 물을 이용할 수 있는 곳에 논을 만들기도 해요.',summary:'넓고 평평한 들에서는 하천·저수지의 물을 이용해 벼농사를 짓기도 해요.',sticker:'🌾'},
{id:'grow',title:'초록 지붕 안의 비밀',npc:'grower',clue:{x:1056,y:274,past:'야외의 밭',now:'비닐하우스',pastIcon:'🥬',nowIcon:'🍓'},past:['우리 밭에서는 채소를 기르고 있어. 날씨와 계절을 살피며 농사짓지.','밭 가까이 가서 무엇을 기르는지 살펴보렴. 이 들에서는 벼만 기르는 게 아니란다.'],now:['밭 옆에 비닐하우스가 여러 채로 늘었지? 반짝이는 둥근 지붕을 살펴보렴.','안에서 온도 같은 재배 환경을 조절하며 채소와 과일을 기르기도 해. 가까이 가서 단서를 찾아보렴.'],observations:{past:'야외의 밭에 여러 작물이 자라고 작은 농업 시설도 있어요. 논과 밭의 모습이 서로 달라요.',now:'밭 옆에 비닐하우스가 여러 채 보여요. 안의 재배 환경을 조절하며 작물을 기르기도 해요.'},question:'비닐하우스를 이용하는 생활 모습으로 알맞은 것은?',choices:['물이 없어도 모든 작물이 자라요','재배 환경을 조절하며 채소와 과일을 길러요','들이 모두 바다로 바뀌어요'],answer:1,reason:'비닐하우스는 재배 환경을 조절하는 데 도움이 돼요. 들에는 논·밭과 여러 농업 시설을 볼 수 있어요.',summary:'논뿐 아니라 밭과 비닐하우스에서도 여러 작물을 재배해요.',sticker:'🍓'},
{id:'homes',title:'새로운 이웃이 왔어요',npc:'neighbor',clue:{x:1251,y:740,past:'낮은 주택이 있는 마을',now:'아파트와 주거지',pastIcon:'🏡',nowIcon:'🏢'},past:['안녕, 탐정! 논밭 가까이에 낮은 주택과 학교, 작은 가게가 있구나. 수십 년 전에도 생활에 필요한 시설이 있었어.','강 건너편이 아니라 이쪽 길을 따라 남동쪽 주거 마을까지 가 보렴. 어떤 모습인지 기억해 둬.'],now:['사람들이 모여 살면서 집과 아파트가 늘어난 곳도 있어.','다른 일을 하는 이웃들도 함께 살아. 단서를 찾은 뒤 과거의 집들과 비교해 보렴.'],observations:{past:'낮은 주택과 학교, 작은 가게가 있는 마을이에요. 주변에는 논밭과 도로가 있어요.',now:'집과 아파트, 놀이터가 보여요. 많은 사람이 함께 살 수 있는 주거 시설이 생겼어요.'},question:'두 시대의 주거지를 비교한 기록으로 알맞은 것은?',choices:['현재에는 집이 모두 사라졌어요','들이 있는 지역에서는 농부만 살 수 있어요','사람들이 모여 살며 주거 시설이 늘어났어요'],answer:2,reason:'들이 펼쳐진 지역에도 많은 사람이 모여 살며 집과 아파트 같은 주거 시설이 늘어나는 곳이 있어요.',summary:'사람들이 모여 살면서 집·아파트 등 주거 시설이 늘어난 곳도 있어요.',sticker:'🏡'},
{id:'jobs',title:'마을에는 어떤 일터가?',npc:'worker',clue:{x:715,y:681,past:'작은 작업장',now:'공장 앞마당',pastIcon:'🧺',nowIcon:'⚙'},past:['반가워! 이곳에는 작은 작업장과 농산물을 보관하는 창고가 있어. 농사에 쓸 물건을 만들기도 해.','작업장 앞 단서를 살펴보렴. 이웃들이 어떤 일을 하며 살아가는지 생각해 봐.'],now:['공장과 회사 같은 일터가 생긴 곳도 있어. 나도 여러 물건을 만드는 일을 한단다.','그렇다고 농사가 모두 없어진 건 아니야. 마을에 여러 생활 모습이 함께 있는지 살펴보렴.'],observations:{past:'작은 작업장과 창고가 있어요. 농사에 쓸 물건을 만들거나 농산물을 보관해요.',now:'공장과 주변의 일터가 보여요. 논밭에서 농사짓는 모습도 여전히 남아 있어요.'},question:'현재 이 마을 주민들의 일하는 모습을 설명하면?',choices:['농사뿐 아니라 여러 일을 하며 살아가요','들이 있으므로 모두 같은 일을 해요','공장이 생기면 농사는 반드시 없어져요'],answer:0,reason:'농업과 함께 제조업 등 다양한 일을 하는 모습이 나타날 수 있어요. 지역의 생활 모습은 다양해요.',summary:'회사·공장 등 일터가 생기며 주민들이 하는 일이 다양해지기도 해요.',sticker:'⚙'},
{id:'culture',title:'함께 만나고 즐기는 곳',npc:'curator',clue:{x:193,y:724,past:'작은 장터',now:'문화 시설 앞',pastIcon:'🛒',nowIcon:'🎨'},past:['이곳에는 작은 가게와 장터가 있어. 물건을 사고팔고 이웃끼리 이야기도 나누지.','장터 앞 반짝이는 곳에서 사람들이 이 장소를 어떻게 이용하는지 살펴보렴.'],now:['상점이 늘고 박물관, 미술관, 경기장 같은 시설이 생긴 곳도 있어.','사람들이 모여 사는 지역에서 쇼핑하고 문화를 즐기는 모습도 찾아볼 수 있지. 시설 앞 단서를 살펴보렴.'],observations:{past:'작은 가게와 장터에서 물건을 사고팔아요. 이웃이 만나는 생활 공간이에요.',now:'박물관과 운동 경기를 할 수 있는 경기장이 보여요. 전시를 보고 운동하며 여가를 즐길 수 있어요.'},question:'박물관·미술관 같은 문화 시설에서 할 수 있는 일은?',choices:['농사에 필요한 물만 보내기','전시를 보고 다양한 문화를 즐기기','교통 시설을 모두 없애기'],answer:1,reason:'사람들이 모여 사는 지역에는 상업 시설과 문화 시설이 생기며 여러 생활 모습이 나타나기도 해요.',summary:'상점과 문화 시설 등이 생기며 장보기와 문화생활의 모습도 다양해져요.',sticker:'🎨'},
{id:'travel',title:'우리 마을과 다른 지역을 잇는 길',npc:'traveler',clue:{x:1175,y:872,past:'도로와 버스 정류장',now:'기차역과 교통 시설',pastIcon:'👣',nowIcon:'🚉'},past:['탐정이구나! 수십 년 전에도 도로를 따라 사람과 물건이 오갔어. 마을에는 버스를 기다리는 곳도 있지.','길 옆 단서에서 옛 마을의 교통 모습을 살펴보렴.'],now:['도로가 늘고 다리나 기차역 같은 교통 시설이 생기는 지역도 있어.','이 가상 마을의 길과 주변 시설을 보며, 사람과 물건이 이동하는 모습을 상상해 보렴.'],observations:{past:'마을을 잇는 도로와 작은 버스 정류장이 있어요. 사람과 물건이 길을 따라 오가요.',now:'도로와 기차역, 철길이 보여요. 사람과 물건이 다른 지역으로 이동할 때 이용해요.'},question:'도로와 기차역 등 교통 시설이 생기면 어떤 변화가 있을까요?',choices:['모든 주민이 같은 일을 해요','모든 논밭이 사라져요','다른 지역으로 사람과 물건이 이동하기 편리해질 수 있어요'],answer:2,reason:'교통 시설은 사람과 물건이 여러 지역을 오가는 데 도움이 돼요. 변화 모습은 지역마다 달라요.',summary:'교통 시설이 늘며 다른 지역과의 이동이 편리해지는 곳도 있어요.',sticker:'🚉'}
];
const QUESTS=[
 {...PREVIOUS_QUESTS[0],title:'농사짓는 방법이 달라졌어요',lab:'rice',summary:'손으로 모를 심는 사진과 기계 모내기 영상을 비교하고, 직접 관찰한 모습을 근거로 농사 방법을 설명해요.'},
 {...PREVIOUS_QUESTS[2],id:'maps',title:'들이 있던 곳은 어떻게 바뀌었을까?',lab:'maps',summary:'대전 갑천 주변의 1970년·2021년 항공사진을 같은 범위에서 비교하고, 달라진 곳과 남아 있는 모습을 찾아요.'}
];
const MAP_LABELS=[{x:280,y:205,past:'넓은 들과 논',now:'넓은 들과 논'},{x:834,y:220,past:'채소밭',now:'밭과 비닐하우스'},{x:211,y:510,past:'주택과 가게',now:'주거 마을'},{x:780,y:570,past:'작은 작업장',now:'공장과 일터'},{x:1172,y:570,past:'낮은 주택과 학교',now:'아파트와 주거지'},{x:175,y:668,past:'가게와 장터',now:'상점·문화·체육 시설'},{x:1450,y:420,past:'하천',now:'하천'}];

return Object.freeze({WIDTH, HEIGHT, AVATARS, NPCS, QUESTS, MAP_LABELS});
})();

// src/world.js
const __mod2=(()=>{
const {WIDTH, HEIGHT}=__mod1;

const ROADS=[
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
const segments=ROADS.flatMap(p=>p.slice(1).map((b,i)=>[p[i],b]));
const grid=new Uint8Array(COLS*ROWS);
for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){const x=c*STEP+STEP/2,y=r*STEP+STEP/2;if(x<8||x>WIDTH-8||y<8||y>HEIGHT-8)continue;if(segments.some(([a,b])=>distanceSegment(x,y,a,b)<24))grid[r*COLS+c]=1;}
const cell=p=>({c:Math.max(0,Math.min(COLS-1,Math.floor(p.x/STEP))),r:Math.max(0,Math.min(ROWS-1,Math.floor(p.y/STEP)))});
const point=i=>({x:i%COLS*STEP+STEP/2,y:Math.floor(i/COLS)*STEP+STEP/2});
function walkable(x,y){const {c,r}=cell({x,y});return x>0&&y>0&&x<WIDTH&&y<HEIGHT&&!!grid[r*COLS+c]}
function snap(p){let best=-1,d=Infinity;for(let i=0;i<grid.length;i++)if(grid[i]){const v=point(i),n=(v.x-p.x)**2+(v.y-p.y)**2;if(n<d){d=n;best=i}}return point(best)}
function pathfind(start,end){const a=cell(snap(start)),b=cell(snap(end)),si=a.r*COLS+a.c,gi=b.r*COLS+b.c;const open=new Set([si]),came=new Map(),g=new Map([[si,0]]),f=new Map([[si,dist(point(si),point(gi))]]);while(open.size){let cur=-1,low=Infinity;for(const i of open)if(f.get(i)<low){cur=i;low=f.get(i)}if(cur===gi){let out=[point(cur)];while(came.has(cur)){cur=came.get(cur);out.push(point(cur))}return out.reverse().slice(1)}open.delete(cur);const c=cur%COLS,r=Math.floor(cur/COLS);for(const [dc,dr]of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){const nc=c+dc,nr=r+dr;if(nc<0||nr<0||nc>=COLS||nr>=ROWS)continue;const ni=nr*COLS+nc;if(!grid[ni]||(dc&&dr&&(!grid[r*COLS+nc]||!grid[nr*COLS+c])))continue;const ng=g.get(cur)+Math.hypot(dc,dr)*STEP;if(ng<(g.get(ni)??Infinity)){came.set(ni,cur);g.set(ni,ng);f.set(ni,ng+dist(point(ni),point(gi)));open.add(ni)}}}return []}
function advance(player,path,amount){while(path.length&&amount>0){const next=path[0],d=dist(player,next);if(d<=amount){player.x=next.x;player.y=next.y;amount-=d;path.shift()}else{player.x+=(next.x-player.x)/d*amount;player.y+=(next.y-player.y)/d*amount;amount=0}}return player}


return Object.freeze({snap, pathfind, walkable, advance, dist});
})();

// src/state.js
const __mod3=(()=>{
const {QUESTS, AVATARS}=__mod1;

const SAVE_KEY='plains-detective-rpg-v2';
function fresh(avatar=0,name=''){return {version:3,avatar,name:name.trim().slice(0,10)||AVATARS[avatar].name,era:'past',x:531,y:619,intro:false,progress:Object.fromEntries(QUESTS.map(q=>[q.id,{met:[],seen:[],compared:false}])),completed:[],ending:false,helpSeen:false}}
function restore(raw){try{
 const s=JSON.parse(raw);if(![2,3].includes(s.version)||!Number.isInteger(s.avatar)||s.avatar<0||s.avatar>3||typeof s.name!=='string'||!['past','now'].includes(s.era)||!Array.isArray(s.completed))return null;
 const n=fresh(s.avatar,s.name);n.era=s.era;n.x=Number.isFinite(s.x)?s.x:n.x;n.y=Number.isFinite(s.y)?s.y:n.y;n.intro=!!s.intro;
 // Old fictional clue/quiz completion is not evidence from actual source materials.
 if(s.version===2)return n;
 for(const q of QUESTS){const p=s.progress?.[q.id];n.progress[q.id]={met:['past','now'].filter(e=>p?.met?.includes(e)),seen:['past','now'].filter(e=>p?.seen?.includes(e)),compared:!!p?.compared};}
 n.completed=QUESTS.filter(q=>s.completed.includes(q.id)&&ready(n,q)&&n.progress[q.id].compared).map(q=>q.id);n.ending=!!s.ending&&n.completed.length===QUESTS.length;return n;
}catch{return null}}
function currentQuest(s){return QUESTS.find(q=>!s.completed.includes(q.id))||null}
function mark(s,id,field,era){if(!s.progress[id]||!['met','seen'].includes(field)||!['past','now'].includes(era))return;if(!s.progress[id][field].includes(era))s.progress[id][field].push(era)}
function ready(s,q){return !!s.progress[q.id]&&s.progress[q.id].seen.includes('past')&&s.progress[q.id].seen.includes('now')}
function recordComparison(s,q){if(!ready(s,q))return false;s.progress[q.id].compared=true;return true;}
function complete(s,q){if(!ready(s,q)||!s.progress[q.id].compared||s.completed.includes(q.id))return false;s.completed.push(q.id);return true}

return Object.freeze({SAVE_KEY, fresh, restore, currentQuest, mark, ready, recordComparison, complete});
})();

// src/motion.js
const __mod4=(()=>{

/**
 * Four-frame, three-direction walking atlas state.
 *
 * Rows: 0 = front/down, 1 = right (mirror for left), 2 = back/up.
 * Columns: 0..3 = one complete alternating-foot walking cycle.
 * Pass actual movement after collision/path resolution, not requested movement.
 *
 * let gait = createGait();
 * gait = updateGait(gait, player.x - previous.x, player.y - previous.y, dt);
 * // atlas column = gait.frame; row = gait.row; mirror = gait.flip
 *
 * Functions do not touch the DOM and do not mutate their arguments.
 */

const finite = (value, fallback = 0) => Number.isFinite(value) ? value : fallback;
const EPSILON = 0.001;
const TURN_RATIO = 1.35;

function createGait(options = {}) {
  const cycleLength = Math.max(8, finite(options.cycleLength, 76));
  const bobAmplitude = Math.max(0, Math.min(2, finite(options.bobAmplitude, 0.8)));
  return {
    cycleLength,
    bobAmplitude,
    distance: 0,
    frame: 0,
    row: 0,
    flip: false,
    moving: false,
    bob: 0,
  };
}

function updateGait(gait, dx, dy, dt = 1 / 60) {
  // dt remains part of the API so callers can use the same frame inputs as
  // movement. Phase intentionally follows distance, independent of frame rate.
  const next = { ...gait };
  dx = finite(dx);
  dy = finite(dy);
  if (!Number.isFinite(dt) || dt < 0) {
    dx = 0;
    dy = 0;
  }
  const travelled = Math.hypot(dx, dy);
  if (travelled < EPSILON) {
    return { ...next, distance: 0, frame: 0, moving: false, bob: 0 };
  }

  const horizontal = Math.abs(dx);
  const vertical = Math.abs(dy);
  const wasHorizontal = next.row === 1;
  // A 45-degree path keeps its existing axis. Switching axes requires clear
  // dominance, avoiding front/side flicker at tiny A* staircase corners.
  const useHorizontal = wasHorizontal
    ? !(vertical > horizontal * TURN_RATIO)
    : horizontal > vertical * TURN_RATIO;

  if (useHorizontal) {
    next.row = 1;
    next.flip = dx < 0;
  } else {
    next.row = dy < 0 ? 2 : 0;
    next.flip = false;
  }

  next.distance = (finite(gait.distance) + travelled) % next.cycleLength;
  const phase = next.distance / next.cycleLength;
  next.frame = Math.min(3, Math.floor(phase * 4));
  next.moving = true;
  next.bob = -next.bobAmplitude * Math.abs(Math.sin(phase * Math.PI * 2));
  return next;
}

/** Smooth start/stop speed in world units per second. */
function moveSpeed(currentSpeed, wantsMove, dt, options = {}) {
  const maxSpeed = Math.max(0, finite(options.maxSpeed, 165));
  const acceleration = Math.max(0, finite(options.acceleration, 1150));
  const deceleration = Math.max(0, finite(options.deceleration, 1600));
  const elapsed = Math.max(0, Math.min(0.1, finite(dt)));
  const current = Math.max(0, Math.min(maxSpeed, finite(currentSpeed)));
  const target = wantsMove ? maxSpeed : 0;
  const delta = (wantsMove ? acceleration : deceleration) * elapsed;
  return target > current
    ? Math.min(target, current + delta)
    : Math.max(target, current - delta);
}

return Object.freeze({createGait, updateGait, moveSpeed});
})();

// src/walk-atlases.js
const __mod6=(()=>{

const WALK_ATLASES = [
  {
    "src": "assets/walk/mint.png",
    "width": 1254,
    "height": 1254,
    "frames": [
      [
        64,
        22,
        235,
        389
      ],
      [
        375,
        22,
        235,
        392
      ],
      [
        671,
        22,
        235,
        389
      ],
      [
        984,
        20,
        233,
        394
      ],
      [
        36,
        427,
        259,
        409
      ],
      [
        352,
        429,
        262,
        407
      ],
      [
        662,
        428,
        254,
        408
      ],
      [
        965,
        429,
        261,
        407
      ],
      [
        43,
        836,
        238,
        385
      ],
      [
        352,
        836,
        237,
        387
      ],
      [
        665,
        836,
        238,
        384
      ],
      [
        975,
        836,
        236,
        389
      ]
    ]
  },
  {
    "src": "assets/walk/coral.png",
    "width": 1254,
    "height": 1254,
    "frames": [
      [
        45,
        16,
        241,
        399
      ],
      [
        357,
        16,
        242,
        402
      ],
      [
        667,
        16,
        238,
        399
      ],
      [
        982,
        16,
        242,
        401
      ],
      [
        56,
        434,
        231,
        391
      ],
      [
        362,
        435,
        235,
        392
      ],
      [
        677,
        433,
        229,
        392
      ],
      [
        995,
        435,
        231,
        392
      ],
      [
        52,
        839,
        239,
        386
      ],
      [
        368,
        839,
        232,
        389
      ],
      [
        672,
        838,
        241,
        387
      ],
      [
        988,
        842,
        237,
        388
      ]
    ]
  },
  {
    "src": "assets/walk/blue.png",
    "width": 1254,
    "height": 1254,
    "frames": [
      [
        76,
        10,
        210,
        407
      ],
      [
        379,
        10,
        207,
        407
      ],
      [
        677,
        10,
        208,
        405
      ],
      [
        989,
        9,
        210,
        407
      ],
      [
        78,
        425,
        217,
        411
      ],
      [
        382,
        426,
        241,
        410
      ],
      [
        686,
        425,
        212,
        402
      ],
      [
        996,
        425,
        232,
        401
      ],
      [
        69,
        836,
        207,
        403
      ],
      [
        378,
        836,
        207,
        405
      ],
      [
        680,
        836,
        207,
        403
      ],
      [
        996,
        836,
        204,
        406
      ]
    ]
  },
  {
    "src": "assets/walk/yellow.png",
    "width": 1254,
    "height": 1254,
    "frames": [
      [
        37,
        21,
        260,
        397
      ],
      [
        336,
        20,
        269,
        398
      ],
      [
        640,
        21,
        263,
        397
      ],
      [
        949,
        21,
        281,
        397
      ],
      [
        46,
        418,
        243,
        418
      ],
      [
        351,
        418,
        249,
        405
      ],
      [
        672,
        418,
        234,
        406
      ],
      [
        967,
        418,
        256,
        406
      ],
      [
        41,
        836,
        264,
        387
      ],
      [
        345,
        836,
        264,
        384
      ],
      [
        645,
        836,
        265,
        389
      ],
      [
        956,
        836,
        277,
        385
      ]
    ]
  }
];

return Object.freeze({WALK_ATLASES});
})();

// src/walker.js
const __mod5=(()=>{
const {WALK_ATLASES}=__mod6;


// Normalize each source frame to a stable ground line. The generated sheet's
// transparent margins never become a visible hop when the feet alternate.
function layoutFrame(frame,baseline=96,height=89){
 const [sx,sy,sw,sh]=frame;
 const scale=height/sh;
 return {sx,sy,sw,sh,dx:40-sw*scale/2,dy:baseline-height,dw:sw*scale,dh:height};
}
function createWalker(host){
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

return Object.freeze({createWalker});
})();

// src/photos.js
const __mod7=(()=>{

const PHOTOS = {
  "rice": {
    "id": "rice",
    "filename": "rice.jpg",
    "title": "경북 성주의 논",
    "caption": "논에 벼가 줄지어 자라고 있어요. 벼농사에 필요한 물은 어디에서 올까요?",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Korean_Rice_Paddy_Field.jpg",
    "originalFileUrl": "https://upload.wikimedia.org/wikipedia/commons/c/ca/Korean_Rice_Paddy_Field.jpg",
    "author": "Salamander724",
    "license": "Public domain",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Template:PD-self",
    "photographedAt": "2013-07-01 09:07:23",
    "referenceNotice": "실제 사례 참고 사진입니다. 게임 속 가상 마을이나 게임의 과거·현재 장면을 촬영한 사진이 아닙니다.",
    "changes": "크기 축소 및 JPEG 저장. 원본의 장면·구도는 바꾸지 않았습니다.",
    "width": 1200,
    "height": 900,
    "creditLine": "Salamander724 / Wikimedia Commons / Public domain",
    "src": "assets/photos/rice.jpg"
  },
  "grow": {
    "id": "grow",
    "filename": "grow.jpg",
    "title": "우리나라의 비닐하우스",
    "caption": "비닐하우스 안에서 작물이 자라고 있어요. 지붕과 벽이 재배 환경에 어떤 도움을 줄까요?",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:2020-05-09_13.17.37_tomato_greenhouse.jpg",
    "originalFileUrl": "https://upload.wikimedia.org/wikipedia/commons/7/71/2020-05-09_13.17.37_tomato_greenhouse.jpg",
    "author": "Choi Kwang-mo",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "photographedAt": "2020-05-09 13:17:37",
    "referenceNotice": "실제 사례 참고 사진입니다. 게임 속 가상 마을이나 게임의 과거·현재 장면을 촬영한 사진이 아닙니다.",
    "changes": "크기 축소 및 JPEG 저장. 원본의 장면·구도는 바꾸지 않았습니다.",
    "width": 1200,
    "height": 900,
    "creditLine": "Choi Kwang-mo / Wikimedia Commons / CC0",
    "src": "assets/photos/grow.jpg"
  },
  "homes": {
    "id": "homes",
    "filename": "homes.jpg",
    "title": "인천 송도의 아파트와 학교",
    "caption": "여러 아파트와 학교가 가까이 있어요. 많은 사람이 함께 살며 필요한 시설을 찾아보세요.",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:South_Korea,_Incheon,_Songdo_(04),_apartment_blocks_and_school.jpg",
    "originalFileUrl": "https://upload.wikimedia.org/wikipedia/commons/d/dc/South_Korea%2C_Incheon%2C_Songdo_%2804%29%2C_apartment_blocks_and_school.jpg",
    "author": "Vincent van Zeijst",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "photographedAt": "9 July 2023",
    "referenceNotice": "실제 사례 참고 사진입니다. 게임 속 가상 마을이나 게임의 과거·현재 장면을 촬영한 사진이 아닙니다.",
    "changes": "크기 축소 및 JPEG 저장. 원본의 장면·구도는 바꾸지 않았습니다.",
    "width": 1200,
    "height": 900,
    "creditLine": "Vincent van Zeijst / Wikimedia Commons / CC BY-SA 4.0",
    "src": "assets/photos/homes.jpg"
  },
  "jobs": {
    "id": "jobs",
    "filename": "jobs.jpg",
    "title": "광주의 자동차 공장",
    "caption": "공장에는 물건을 만드는 건물과 시설이 있어요. 이곳에서 사람들이 어떤 일을 할지 생각해 보세요.",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Kia_Motors_South_Korea_factory.jpg",
    "originalFileUrl": "https://upload.wikimedia.org/wikipedia/commons/9/97/Kia_Motors_South_Korea_factory.jpg",
    "author": "Kgw5360",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "photographedAt": "2016-06-05 15:34:33",
    "referenceNotice": "실제 사례 참고 사진입니다. 게임 속 가상 마을이나 게임의 과거·현재 장면을 촬영한 사진이 아닙니다.",
    "changes": "크기 축소 및 JPEG 저장. 원본의 장면·구도는 바꾸지 않았습니다.",
    "width": 1200,
    "height": 799,
    "creditLine": "Kgw5360 / Wikimedia Commons / CC BY-SA 4.0",
    "src": "assets/photos/jobs.jpg"
  },
  "culture": {
    "id": "culture",
    "filename": "culture.jpg",
    "title": "서울 국립중앙박물관",
    "caption": "박물관에서는 전시를 보며 문화를 즐길 수 있어요. 우리 지역의 문화 시설도 떠올려 보세요.",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:National_Museum_of_Korea_exterior.jpg",
    "originalFileUrl": "https://upload.wikimedia.org/wikipedia/commons/1/13/National_Museum_of_Korea_exterior.jpg",
    "author": "Tristan Surtel",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "photographedAt": "2019-07-31 11:15:47",
    "referenceNotice": "실제 사례 참고 사진입니다. 게임 속 가상 마을이나 게임의 과거·현재 장면을 촬영한 사진이 아닙니다.",
    "changes": "크기 축소 및 JPEG 저장. 원본의 장면·구도는 바꾸지 않았습니다.",
    "width": 1200,
    "height": 798,
    "creditLine": "Tristan Surtel / Wikimedia Commons / CC BY-SA 4.0",
    "src": "assets/photos/culture.jpg"
  },
  "travel": {
    "id": "travel",
    "filename": "travel.jpg",
    "title": "서울역에 정차한 KTX",
    "caption": "기차와 승강장, 철길을 살펴보세요. 교통 시설은 사람과 물건이 다른 지역으로 이동하는 데 도움을 줘요.",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:KTX-I_in_Seoul_Station.jpg",
    "originalFileUrl": "https://upload.wikimedia.org/wikipedia/commons/3/33/KTX-I_in_Seoul_Station.jpg",
    "author": "U-ichiro Murakami",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "photographedAt": "23 December 2011 12:37:00",
    "referenceNotice": "실제 사례 참고 사진입니다. 게임 속 가상 마을이나 게임의 과거·현재 장면을 촬영한 사진이 아닙니다.",
    "changes": "크기 축소 및 JPEG 저장. 원본의 장면·구도는 바꾸지 않았습니다.",
    "width": 1200,
    "height": 800,
    "creditLine": "U-ichiro Murakami / Wikimedia Commons / CC BY-SA 2.0",
    "src": "assets/photos/travel.jpg"
  }
};

return Object.freeze({PHOTOS});
})();

// src/research-data.js
const __mod9=(()=>{
const {PHOTOS}=__mod7;
// Actual evidence is kept separate from the illustrated fictional village.

const LABS={
 rice:{id:'rice',title:'논에서 일하는 모습',tag:'🌾 농사 방법 조사',question:'두 자료에서 농사 도구와 일하는 모습은 무엇이 같고 다를까요?',guide:['사진 속 사람들의 손과 도구를 자세히 살펴봐요.','영상을 멈추고 기계가 하는 일을 찾아봐요.','자료에서 직접 본 것과 그것을 보고 생각한 것을 나누어 적어요.'],notice:'서로 다른 지역과 시기의 농사 사례예요. 같은 마을의 과거·현재를 촬영한 자료는 아니에요.',compare:true,sources:[]},
 maps:{id:'maps',title:'대전의 땅은 어떻게 달라졌을까?',tag:'🗺️ 항공사진 비교 조사',question:'같은 장소에서 땅을 이용하는 모습이 어떻게 달라졌을까요?',guide:['하천이나 길을 기준으로 두 사진에서 같은 장소를 찾아요.','달라진 곳과 비슷하게 남아 있는 곳에 단서를 표시해요.','사진에서 확인한 모습과 변화에 대한 생각을 나누어 적어요.'],notice:'항공사진은 하늘에서 찍은 실제 사진이에요. 1970년·2021년의 같은 장소를 비교해요. 건물 용도·인구수는 사진만으로 확정할 수 없어요.',compare:true,sources:[]},
 grow:{id:'grow',title:'비닐하우스 안으로!',tag:'🍅 재배 시설 조사',question:'온실 안에서 작물이 자라도록 돕는 시설을 찾을 수 있나요?',guide:['작물 주변에 어떤 시설이 있는지 사진에서 찾아봐요.','영상에서 물을 주거나 온도를 조절하는 모습을 살펴봐요.','찾은 시설이 어떤 도움을 줄지 근거와 함께 생각해 봐요.'],notice:'서로 다른 농장의 실제 사례예요. 모든 비닐하우스에 같은 시설이 있는 것은 아니에요.',compare:true,sources:[]}
};

LABS.maps.sources=[1970,2021].map(year=>({
 id:'aerial-'+year,kind:'image',src:'assets/research/daejeon-'+year+'.jpg',title:year+'년 항공사진',date:year+'년 자료',place:'대전 갑천 주변 · 도룡동·만년동 일대',caption:'하늘에서 내려다보고 찍은 사진이에요. 북쪽은 위쪽이며, 두 사진은 같은 범위(가로 3.6km · 세로 2.55km)예요.',sourceUrl:'https://gis.daejeon.go.kr/ispmap.do?menu_cde=menu004',sourceName:'대전광역시 공간정보포털',credit:'대전광역시 · 연도별 항공사진. 같은 범위 자르기·크기 조절. 연도는 원출처 레이어 표기 기준.'
}));
LABS.rice.sources=[{
 id:'hand-1989',kind:'image',src:'assets/research/rice-hand-1989.jpg',title:'손으로 모를 심는 모습',date:'1989년 5월 19일 기록',place:'경기도 김포',caption:'사진을 확대해서 손과 도구, 논의 모습을 관찰해요.',sourceUrl:'https://www.ehistory.go.kr/view/photo?mediadtl=105207&mediagbn=PG&mediaid=12634&mediasrcgbn=PT',sourceName:'e영상역사관 기록 사진',credit:'문화체육관광부 e영상역사관 · 공공누리 제4유형 · 사진 원본 그대로. 단서 표시는 별도 화면 요소.'
},{
 id:'machine-2022',kind:'video',src:'assets/research/rice-machine-2022.mp4',poster:'assets/research/rice-machine-2022.jpg',title:'기계로 모를 심는 모습',date:'2022년 제작',place:'국내 벼농사 사례 · 상세 촬영지 미표기',caption:'25초 관찰 영상 · 무음 발췌. 사람과 기계가 하는 일을 살펴봐요.',sourceUrl:'https://www.nongsaro.go.kr/portal/ps/psb/psby/vodPlay.ps?menuId=PS65513&mvpClipNo=3&mvpNo=823',sourceName:'농촌진흥청 농사로',credit:'농촌진흥청 · 국립식량과학원 협조. 「벼 드문모 심기 재배기술 - 3. 모내기」. 공공누리 제2유형 · 발췌·무음·재압축.'
}];
LABS.grow.sources=[{
 id:'greenhouse-photo',kind:'image',src:PHOTOS.grow.src,title:'비닐하우스 내부 사진',date:'2020년 5월 9일 촬영',place:'대한민국 · 상세 촬영지 미표기',caption:'작물이 자라는 곳 주변의 시설을 찾아 표시해요.',sourceUrl:PHOTOS.grow.sourceUrl,sourceName:'Wikimedia Commons 원문',credit:PHOTOS.grow.creditLine+' · 크기 축소.'
},{
 id:'greenhouse-2017',kind:'video',src:'assets/research/greenhouse-2017.mp4',poster:'assets/research/greenhouse-2017.jpg',title:'온실을 관리하는 모습',date:'2017년 제작',place:'우리나라 온실 사례 · 일부 장면: 충남 부여',caption:'23초 관찰 영상 · 여러 구간 발췌·연결 편집·무음 처리. 작물 곁의 측정 장치, 물 공급 관, 온실 통로를 살펴봐요.',sourceUrl:'https://www.nongsaro.go.kr/portal/ps/psb/psby/vodPlay.ps?menuId=PS65513&mvpNo=1285',sourceName:'농촌진흥청 농사로',credit:'농촌진흥청 · 국립농업과학원 협조. 「ICT융복합 스마트팜 장비 표준화」. 공공누리 제2유형 · 발췌·무음·재압축.'
}];

LABS.rice.reference=false;LABS.maps.reference=false;LABS.grow.reference=true;

return Object.freeze({LABS});
})();

// src/research-model.js
const __mod10=(()=>{

const RESEARCH_KEY='deulbit-evidence-v2';
const clean=(value,max=1600)=>typeof value==='string'?value.slice(0,max):'';
const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const eraNames=['past','now'];
function createPin(x,y,label=''){
 if(!Number.isFinite(x)||!Number.isFinite(y))return null;
 return {x:Math.max(0,Math.min(1,x)),y:Math.max(0,Math.min(1,y)),label:clean(label,100)};
}
function blankRecord(){return {past:{collected:false,observation:'',pins:[]},now:{collected:false,observation:'',pins:[]},comparison:'',unchanged:'',referenceNote:'',completed:false,updatedAt:null};}
function freshResearch(labs){return {version:2,labs:Object.fromEntries(Object.values(labs).map(lab=>[lab.id,blankRecord()]))};}
function restoreResearch(raw,labs){
 const next=freshResearch(labs);let saved;
 try{saved=typeof raw==='string'?JSON.parse(raw):raw;}catch{return next;}
 if(saved?.version!==2||!saved.labs||typeof saved.labs!=='object')return next;
 for(const lab of Object.values(labs)){
  const old=saved.labs[lab.id];if(!old||typeof old!=='object')continue;
  const record=next.labs[lab.id];
  for(const era of eraNames){
   record[era].observation=clean(old[era]?.observation);
   record[era].collected=!!old[era]?.collected&&!!record[era].observation.trim()&&!lab.reference;
   if(Array.isArray(old[era]?.pins))record[era].pins=old[era].pins.slice(0,12).map(pin=>createPin(pin?.x,pin?.y,pin?.label)).filter(Boolean);
  }
  record.comparison=clean(old.comparison);record.unchanged=clean(old.unchanged);record.referenceNote=clean(old.referenceNote);
  record.completed=!lab.reference&&!!old.completed&&readyToCompare(record)&&!!record.comparison.trim();
  record.updatedAt=typeof old.updatedAt==='string'&&!Number.isNaN(Date.parse(old.updatedAt))?old.updatedAt:null;
 }
 return next;
}
function readyToCompare(record){return eraNames.every(era=>record?.[era]?.collected&&record[era].observation.trim());}
function collectEvidence(record,era,{observation,pins=[],mediaReady=false}={},now=new Date().toISOString()){
 if(!eraNames.includes(era)||!mediaReady||!clean(observation).trim())return false;
 const text=clean(observation).trim();
 if(record[era].observation!==text)record.completed=false;
 record[era]={collected:true,observation:text,pins:Array.isArray(pins)?pins.slice(0,12).map(pin=>createPin(pin?.x,pin?.y,pin?.label)).filter(Boolean):[]};
 record.updatedAt=now;return true;
}
function finishComparison(record,comparison,unchanged='',now=new Date().toISOString()){
 if(!readyToCompare(record)||!clean(comparison).trim())return false;
 record.comparison=clean(comparison).trim();record.unchanged=clean(unchanged).trim();record.completed=true;record.updatedAt=now;return true;
}
function pointOnImage(rect,clientX,clientY){
 if(!rect||rect.width<=0||rect.height<=0)return null;
 const x=(clientX-rect.left)/rect.width,y=(clientY-rect.top)/rect.height;
 return x<0||x>1||y<0||y>1?null:createPin(x,y);
}
function pinVisibleInSwipe(pin,sourceIndex,percent){const boundary=Math.max(0,Math.min(100,percent))/100;return sourceIndex===0?pin.x<boundary:pin.x>=boundary;}
function hasEvidence(record){return !!record&&(record.past.collected||record.now.collected);}
function imageFor(media,key){const encoded=media[key];return typeof encoded==='string'&&/^data:image\/(png|jpeg|webp|gif);base64,[a-z0-9+/=\s]+$/i.test(encoded)?encoded:'';}
function buildResearchHTML(labs,store,name='',media={}){
 const esc=escapeHTML;
 const sourcesHTML=(lab,record)=>lab.sources.map((source,index)=>{
  const era=eraNames[index];if(!lab.reference&&(!era||!record[era].collected))return '';
  const image=imageFor(media,lab.id+'/'+source.id),pins=lab.reference?[]:record[era].pins;
  return `<figure>${image?`<div class="photo"><img src="${image}" alt="${esc(source.title)}">${source.kind==='image'?pins.map((pin,pinIndex)=>`<b class="pin" style="left:${pin.x*100}%;top:${pin.y*100}%">${pinIndex+1}</b>`).join(''):''}</div>`:''}<figcaption><span class="tag">${lab.reference?'현재 농업의 참고 사례':index===0?'과거 단서':'최근 단서'}</span><strong>${esc(source.title)}</strong><br>${esc(source.date)} · ${esc(source.place)}<br>${esc(source.caption)}</figcaption>${!lab.reference?`<section class="evidence"><h3>내가 직접 본 것</h3><p>${esc(record[era].observation)}</p></section>`:''}${pins.length?`<ol>${pins.map(pin=>`<li>${esc(pin.label||'표시한 단서')}</li>`).join('')}</ol>`:''}<p class="credit">${source.kind==='video'?'영상의 대표 사진입니다. 전체 영상은 원문에서 볼 수 있어요.<br>':''}${esc(source.credit||source.sourceName)}<br><a href="${esc(source.sourceUrl)}">${esc(source.sourceName||'자료 원문')} ↗</a></p></figure>`;
 }).join('');
 const html=Object.values(labs).filter(lab=>lab.reference?!!store.labs[lab.id]?.referenceNote.trim():hasEvidence(store.labs[lab.id])).map(lab=>{
  const record=store.labs[lab.id];
  return `<article><p class="tag">${esc(lab.tag)} · ${lab.reference?'농업 참고 기록':record.completed?'비교 단서 카드 완성':'단서 수집 중'}</p><h2>${esc(lab.title)}</h2><p class="question">${esc(lab.question)}</p><div class="photos">${sourcesHTML(lab,record)}</div>${lab.reference?`<section class="notes"><h3>참고 자료를 보고 남긴 메모</h3><p>${esc(record.referenceNote)}</p></section>`:`<section class="notes"><h3>달라진 모습과 그 근거</h3><p>${esc(record.comparison||'두 시기의 단서를 더 모아 비교할 거예요.')}</p>${record.unchanged?`<h3>비슷하게 남아 있는 모습</h3><p>${esc(record.unchanged)}</p>`:''}</section>`}<p class="notice">${esc(lab.notice||'')}</p></article>`;
 }).join('');
 return `<!doctype html><html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(name||'들빛마을 탐정')}의 단서 카드 수첩</title><style>*{box-sizing:border-box}body{margin:0;background:#edf2e6;color:#284a43;font-family:"Malgun Gothic",system-ui,sans-serif;line-height:1.7}main{max-width:1080px;margin:32px auto;padding:30px;background:#fffaf0;border-radius:24px}header{padding:10px 0 20px;border-bottom:3px solid #a7c5ac}h1{font-size:32px;margin:5px 0}article{padding:25px 0;border-bottom:1px solid #d2dfc8;break-inside:avoid}.tag,.credit,.notice{font-size:12px;color:#617a68}.tag{display:block}h2{margin:0;font-size:25px}.question{font-weight:bold}.photos{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}figure{margin:0;padding:12px;background:#fff;border:1px solid #d4dfcd;border-radius:14px}.photo{position:relative;line-height:0}.photo img{width:100%;height:auto}.pin{position:absolute;transform:translate(-50%,-50%);background:#f8cf6b;border:2px solid #fff;color:#304b41;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;font-size:13px;line-height:1}.notes,.evidence{margin-top:18px;padding:15px;background:#edf2e3;border-radius:12px}h3{font-size:16px;margin:0}.notes p,.evidence p{white-space:pre-wrap;overflow-wrap:anywhere;font-size:16px}a{color:#267a65}footer{font-size:12px;color:#617a68;margin-top:25px}@media(max-width:650px){main{padding:18px;margin:12px}.photos{grid-template-columns:1fr}}@media print{body{background:white}main{margin:0;padding:0;max-width:none}a{overflow-wrap:anywhere}}</style></head><body><main><header><p class="tag">들빛마을 · 시간여행 탐정단</p><h1>${esc(name||'이름 없는 탐정')}의 단서 카드 수첩</h1><p>주민을 만나 실제 자료를 조사하고, 과거와 최근의 단서를 모았어요.</p></header>${html||'<p>모은 단서가 아직 없어요. 마을에서 주민을 만나 보세요.</p>'}<footer>들빛마을은 학습용 가상 마을입니다. 실제 자료의 지역과 연도는 각 자료에 표시했습니다. 다른 지역의 사례는 동일 장소의 시계열 변화로 단정하지 않습니다.</footer></main></body></html>`;
}

return Object.freeze({RESEARCH_KEY, escapeHTML, restoreResearch, createPin, pointOnImage, pinVisibleInSwipe, hasEvidence, readyToCompare, collectEvidence, finishComparison, buildResearchHTML});
})();

// src/research.js
const __mod8=(()=>{
const {LABS}=__mod9;
const {RESEARCH_KEY, escapeHTML, restoreResearch, createPin, pointOnImage, pinVisibleInSwipe, hasEvidence, readyToCompare, collectEvidence, finishComparison, buildResearchHTML}=__mod10;



function createResearch({mount=document.body,getName=()=>'',onCollected=()=>{},onCompared=()=>{},onTravel=()=>{},onClose=()=>{}}={}){
 const esc=escapeHTML,eras=['past','now'];let raw=null;try{raw=localStorage.getItem(RESEARCH_KEY);}catch{}
 let store=restoreResearch(raw,LABS),active=null,context={},draft=null,zoom=1,mode='split',swipe=50,selected=null,resizeObserver=null,resizeFallback=null,syncing=false,lastFocus=null,viewToken=0,loaded=new Set(),closed=true,pinGuardUntil=0,readyDownload=null;
 const dialog=document.createElement('dialog');dialog.className='research-dialog evidence-dialog';dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-label','주민과 실제 자료 조사');mount.append(dialog);
 const $=selector=>dialog.querySelector(selector),$$=selector=>[...dialog.querySelectorAll(selector)],record=()=>store.labs[active],lab=()=>LABS[active];
 const eraLabel=era=>era==='past'?'과거':'최근';
 function status(text){const node=$('.research-status');if(node)node.textContent=text;}
 function persist(){try{localStorage.setItem(RESEARCH_KEY,JSON.stringify(store));return true;}catch{status('기기 저장 공간이 부족해요. 단서 수첩을 내려받아 보관해요.');return false;}}
 function isOpen(){return dialog.hasAttribute('open');}
 function pause(){ $$('video').forEach(video=>{try{video.pause();}catch{}}); }
 function stopViews(){pause();resizeObserver?.disconnect();resizeObserver=null;if(resizeFallback){window.removeEventListener('resize',resizeFallback);resizeFallback=null;}}
 function prepare(){
  if(isOpen())return;lastFocus=document.activeElement;closed=false;
  try{if(typeof dialog.showModal==='function')dialog.showModal();else throw new Error('dialog fallback');}
  catch{dialog.setAttribute('open','');dialog.classList.add('research-dialog-fallback');}
 }
 function header(title){return `<header class="research-header"><div class="research-seal" aria-hidden="true">🔎</div><div><span class="research-eyebrow">들빛마을 시간 탐정단 · 실제 자료</span><h2>${esc(title)}</h2></div><button class="research-notebook-button" data-action="notebook">▤ 단서 수첩</button><button class="research-close" data-action="close" aria-label="자료를 닫고 마을로 돌아가기">✕</button></header>`;}
 function npcFooter(message){
  const npc=context.npc||{name:'부엉 박사',role:'시간여행 탐정단',art:7},art=Number.isInteger(npc.art)&&npc.art>=0&&npc.art<=7?npc.art:7;
  return `<footer class="research-npc-footer"><div class="research-npc-portrait"><span class="sprite cast-${art}" aria-hidden="true"></span></div><div class="research-npc-bubble"><div><b>${esc(npc.name||'부엉 박사')}</b><span>${esc(npc.role||'들빛마을 주민')}</span></div><p>${esc(message)}</p></div></footer>`;
 }
 function bindCommon(){
  $('[data-action="close"]').onclick=close;
  $('[data-action="notebook"]').onclick=openNotebook;
  $$('[data-action="back-village"]').forEach(button=>button.onclick=close);
  $$('[data-action="travel"]').forEach(button=>button.onclick=()=>{const era=button.dataset.era;close();onTravel(era);});
  $$('[data-action="compare"]').forEach(button=>button.onclick=()=>openCompare(active,{npc:context.npc}));
 }
 function enter(id,nextContext){
  if(!LABS[id])return false;pinGuardUntil=Date.now()+450;stopViews();prepare();active=id;context=nextContext;zoom=1;mode='split';swipe=50;selected=null;viewToken++;loaded=new Set();return true;
 }
 function sourceFoot(source){return `<div class="research-source-meta"><div><b>${esc(source.place||'지역 정보 미표기')}</b><span>${esc(source.date||'시기 정보 미표기')}</span></div><a href="${esc(source.sourceUrl||'#')}" target="_blank" rel="noopener noreferrer">${esc(source.sourceName||'자료 원문')} ↗</a><details class="research-source-details"><summary>자료 설명·출처 정보</summary><div><p>${esc(source.caption||'')}</p><small>${esc(source.credit||'')}</small></div></details></div>`;}
 function sourceView(source,index,{overlay=false,canPin=false}={}){
  if(!source)return `<section class="research-source research-locked-source"><span>🔒</span><h3>${index===0?'과거':'최근'} 단서를 더 모아야 해요.</h3><p>마을로 돌아가 다른 시대의 같은 주민을 만나세요.</p></section>`;
  const title=overlay?source.date+' ↔ '+lab().sources[1].date:source.title;
  const titleHTML=`<div class="research-source-title"><span class="source-dot dot-${index}"></span><b>${esc(title)}</b></div>`;
  const error=`<div class="research-media-error" hidden>자료를 불러오지 못했어요.<br>단서를 수집하려면 사진·영상이 열려야 해요.<br><a href="${esc(source.sourceUrl||'#')}" target="_blank" rel="noopener noreferrer">자료 원문 열기 ↗</a></div>`;
  const collectedNote=context.type==='compare'&&!overlay?`<div class="research-collected-note"><b>${eraLabel(eras[index])}에 내가 찾은 단서</b><p>${esc(record()[eras[index]].observation)}</p></div>`:'';
  if(source.kind==='video')return `<section class="research-source is-video" data-source="${esc(source.id)}">${titleHTML}<div class="research-video-wrap"><video controls playsinline preload="metadata" ${source.poster?`poster="${esc(source.poster)}"`:''} aria-label="${esc(source.title)}"><source src="${esc(source.src||'')}" type="video/mp4"></video>${error}</div><p class="research-video-tip">▷ 재생하고, 멈춰서 자세히 살펴봐요.</p>${sourceFoot(source)}${collectedNote}</section>`;
  return `<section class="research-source" data-source="${esc(source.id)}">${titleHTML}<div class="research-source-window" tabindex="0" aria-label="${esc(source.title)}${canPin?'. 사진에서 단서를 찾은 곳을 누르세요.':''}"><div class="research-scroll-space"><div class="research-photo-plane ${canPin?'can-pin':''}" data-source-index="${index}" data-can-pin="${canPin}"><img src="${esc(source.src||'')}" alt="${esc(source.title)}" draggable="false">${overlay?`<img class="research-overlay-image" src="${esc(lab().sources[1]?.src||'')}" alt="${esc(lab().sources[1]?.title||'최근 자료')}" draggable="false"><span class="research-swipe-line" aria-hidden="true"></span>`:''}<div class="research-pins"></div></div></div>${error}</div>${sourceFoot(source)}${collectedNote}</section>`;
 }
 function toolbar(showImages,canSwipe=false){return `<div class="research-toolbar"><p>${context.type==='encounter'&&context.canCollect&&showImages?'사진·지도에서 단서를 찾은 곳에 표시할 수 있어요.':showImages?'크게 보거나 움직여서 자세히 살펴봐요.':'영상을 재생하고 멈추며 자세히 살펴봐요.'}</p><div class="research-view-buttons" ${showImages?'':'hidden'}>${canSwipe?`<button data-action="split" class="${mode==='split'?'active':''}">나란히</button><button data-action="swipe" class="${mode==='swipe'?'active':''}">겹쳐 보기</button>`:''}<button data-action="zoom-out" aria-label="사진 축소">−</button><span class="research-zoom-label">${Math.round(zoom*100)}%</span><button data-action="zoom-in" aria-label="사진 확대">＋</button><button data-action="reset-view" aria-label="사진 크기와 위치 처음으로">↺</button></div></div>`;}
 function pinEditor(){return `<section class="research-pin-editor"><h3>📍 사진에 표시한 단서 <span class="research-pin-count"></span></h3><div class="research-pin-list"></div><div class="research-selected-pin" hidden><label for="research-pin-label">무엇을 찾았나요?</label><input id="research-pin-label" maxlength="100" placeholder="표시한 곳을 설명해요"><button data-action="remove-pin" class="research-delete-pin">이 표시 지우기</button></div></section>`;}
 function sourceForEra(era){return lab().sources[era==='past'?0:1];}
 function openEncounter(id,{era='past',npc,canCollect=true}={}){
  if(LABS[id]?.reference)return openReference(id,{npc});
  if(!enter(id,{type:'encounter',era:eras.includes(era)?era:'past',npc,canCollect:!!canCollect}))return;
  const entry=record()[context.era];draft={observation:entry.observation,pins:entry.pins.map(pin=>({...pin}))};renderEncounter();
 }
 function renderEncounter(){
  viewToken++;loaded=new Set();const source=sourceForEra(context.era),isImage=source?.kind!=='video',entry=record()[context.era],review=!context.canCollect;
  dialog.innerHTML=header(lab().title)+`<div class="research-body encounter-body"><section class="research-viewer"><div class="research-question"><span>${context.era==='past'?'과거 단서':'최근 단서'}</span><h3>${esc(source?.date||'실제 자료')} · ${esc(source?.title||'자료 준비 중')}</h3></div>${toolbar(isImage)}<div class="research-sources single-source">${sourceView(source,context.era==='past'?0:1,{canPin:context.canCollect&&isImage})}</div><p class="research-material-notice">${esc(lab().notice||'')}</p></section><aside class="research-notes"><div class="research-note-intro"><span>${review?'✓ 모은 단서 다시 보기':'✦ 주민이 건넨 실제 자료'}</span><p>${review?'이미 모은 단서를 읽고 사진·영상을 다시 살펴봐요.':'자료에서 직접 본 모습을 찾아요. 다음 시대의 자료는 마을에서 같은 주민을 다시 만나 모을 수 있어요.'}</p></div>${isImage?pinEditor():''}<label class="research-writing-label" for="research-observation"><b>내가 직접 본 것 한 가지</b><small>사람·도구·건물·길 등, 실제로 보이는 모습을 써요.</small></label><textarea id="research-observation" maxlength="1600" ${review?'readonly':''} placeholder="어디에서 무엇을 보았나요?">${esc(draft.observation)}</textarea><div class="research-save-row"><span class="research-status" role="status">${review?'수집한 단서를 읽고 있어요.':'사진·영상이 열리면 단서를 수집할 수 있어요.'}</span>${review?'':`<button data-action="collect" class="research-save" disabled>${context.era==='past'?'과거':'현재'} 단서 수집 ＋</button>`}<div class="research-after-collect" ${entry.collected?'':'hidden'}></div><button class="research-back-button" data-action="back-village">마을로 돌아가기</button></div></aside></div>${npcFooter(review?'다른 시대의 단서도 모았니? 두 자료를 함께 살펴보자.':context.era==='past'?'옛날 자료 속에서 네 눈으로 찾은 모습을 단서로 모아 보렴.':'최근 자료에서 네 눈으로 찾은 모습을 단서로 모아 보렴.')}`;
  bindCommon();bindViews();drawPins();
  if(!review){
   $('#research-observation').oninput=event=>{draft.observation=event.target.value;saveDraft();updateCollectButton();};
   $('[data-action="collect"]').onclick=collectCurrent;
  }
  if(entry.collected)renderAfterCollect();
  layoutSoon();
 }
 function saveDraft(){
  if(context.type!=='encounter'||!context.canCollect)return;
  const entry=record()[context.era];if(entry.collected)return;
  entry.observation=draft.observation;entry.pins=draft.pins.map(pin=>({...pin}));
  if(persist())status('찾은 모습을 쓰고, 단서 수집 버튼을 눌러요.');
 }
 function updateCollectButton(){
  const button=$('[data-action="collect"]');if(!button)return;const source=sourceForEra(context.era);
  button.disabled=!context.canCollect||!source||!loaded.has(source.id)||!draft.observation.trim();
 }
 function collectCurrent(){
  const source=sourceForEra(context.era),id=active,era=context.era,before=JSON.parse(JSON.stringify(record()));
  if(!context.canCollect||!source||!collectEvidence(record(),era,{...draft,mediaReady:loaded.has(source.id)})){status('자료를 연 뒤, 직접 본 모습을 한 가지 이상 써 주세요.');return;}
  if(!persist()){store.labs[id]=before;return;}
  context.canCollect=false;$('#research-observation').readOnly=true;
  const button=$('[data-action="collect"]');button.disabled=true;button.textContent='✓ '+(era==='past'?'과거':'현재')+' 단서를 모았어요!';
  selected=null;drawPins();status('단서를 수첩에 넣었어요.');renderAfterCollect();onCollected(id,era);
 }
 function renderAfterCollect(){
  const node=$('.research-after-collect');if(!node)return;node.hidden=false;
  if(readyToCompare(record()))node.innerHTML='<p>두 시기의 단서를 모두 모았어요!</p><button class="research-save" data-action="compare">과거·현재 비교하기 →</button>';
  else{const opposite=context.era==='past'?'now':'past';node.innerHTML=`<p>다른 시대의 같은 주민을 만나 다음 단서를 모아요.</p><button class="research-travel-button" data-action="travel" data-era="${opposite}">${opposite==='past'?'과거':'현재'}로 시간여행 ✦</button>`;}
  bindCommon();
 }
 function openCompare(id,{npc}={}){
  if(LABS[id]?.reference)return openReference(id,{npc});
  if(!enter(id,{type:'compare',npc,canCollect:false}))return;draft=null;renderCompare();
 }
 function renderCompare(){
  viewToken++;loaded=new Set();const ready=readyToCompare(record()),sources=lab().sources.slice(0,2),canSwipe=ready&&sources.length===2&&sources.every(source=>source.kind==='image');
  const views=mode==='swipe'&&canSwipe?sourceView(sources[0],0,{overlay:true}):eras.map((era,index)=>sourceView(record()[era].collected?sources[index]:null,index)).join('');
  dialog.innerHTML=header('모은 단서로 변화 찾기')+`<div class="research-body compare-body"><section class="research-viewer"><div class="research-question"><span>단서 비교</span><h3>${esc(lab().question)}</h3></div>${toolbar(sources.some(source=>source.kind==='image'),canSwipe)}<div class="research-sources ${mode==='swipe'?'swipe-mode':''}">${views}</div>${mode==='swipe'&&canSwipe?`<div class="research-swipe-control"><span>${esc(sources[0].date)}</span><label>비교 막대<input type="range" min="0" max="100" value="${swipe}" aria-label="두 시기 사진 비교 막대"></label><span>${esc(sources[1].date)}</span></div><div class="research-overlay-credit">${sourceFoot(sources[1])}</div>`:''}<p class="research-material-notice">${esc(lab().notice||'')}</p></section><aside class="research-notes"><div class="research-note-intro"><span>${ready?'✦ 두 단서를 이어 보아요':'🔒 다음 단서를 더 모아요'}</span><p>${ready?'두 자료에서 직접 찾은 모습을 근거로, 무엇이 달라졌는지 설명해요.':'아직 모으지 않은 자료는 열 수 없어요. 마을로 돌아가 다른 시대의 같은 주민을 만나세요.'}</p></div>${mode==='swipe'?`<div class="research-swipe-notes"><div><b>과거에 찾은 단서</b><p>${esc(record().past.observation)}</p></div><div><b>최근에 찾은 단서</b><p>${esc(record().now.observation)}</p></div></div>`:''}<label class="research-writing-label" for="research-comparison"><b>달라진 모습과 그 근거</b><small>어떤 모습을 보고 변화했다고 생각했나요?</small></label><textarea id="research-comparison" maxlength="1600" ${ready?'':'disabled'} placeholder="과거에는 …, 최근에는 …을 보았어요. 그래서 …이 달라졌다고 생각해요.">${esc(record().comparison)}</textarea><label class="research-writing-label" for="research-unchanged"><b>비슷하게 남아 있는 모습 <small>(선택)</small></b><small>두 자료에서 비슷하게 보이는 모습도 찾아요.</small></label><textarea id="research-unchanged" maxlength="1600" ${ready?'':'disabled'} placeholder="두 자료에 모두 …이 보여요.">${esc(record().unchanged)}</textarea><div class="research-save-row"><span class="research-status" role="status">${record().completed?'✓ 완성한 비교 단서 카드예요.':ready?'근거를 담아 문장을 쓰고 카드를 완성해요.':'과거와 최근의 단서가 모두 필요해요.'}</span><button data-action="complete" class="research-save" ${ready?'':'disabled'}>비교 단서 카드 완성 ✓</button>${!ready&&hasEvidence(record())?`<button data-action="travel" data-era="${record().past.collected?'now':'past'}" class="research-travel-button">다음 단서가 있는 시대로 →</button>`:''}<button data-action="back-village" class="research-back-button">마을로 돌아가기</button></div></aside></div>${npcFooter(ready?'네가 모은 단서들이 있구나! 무엇이 달라졌는지, 어떤 모습을 보고 알았는지 이야기해 주렴.':'다음 단서는 다른 시대의 나를 만나면 보여 줄게. 마을에서 다시 만나자!')}`;
  bindCommon();bindViews();drawPins();
  for(const [selector,key]of [['#research-comparison','comparison'],['#research-unchanged','unchanged']])$(selector).oninput=event=>{record()[key]=event.target.value;record().completed=false;if(persist())status('비교 문장을 쓰고, 단서 카드 완성 버튼을 눌러요.');};
  $('[data-action="complete"]').onclick=()=>{
   if(!finishComparison(record(),$('#research-comparison').value,$('#research-unchanged').value)){status('두 시기의 단서를 모은 뒤, 달라진 모습과 그 근거를 써 주세요.');$('#research-comparison').focus();return;}
   if(!persist()){record().completed=false;return;}status('✓ 비교 단서 카드를 완성했어요!');const button=$('[data-action="complete"]');button.textContent='✓ 비교 단서 카드 완성!';onCompared(active);
  };
  layoutSoon();
 }
 function openReference(id='grow',{npc}={}){
  if(!enter(id,{type:'reference',npc,canCollect:false}))return;draft=null;const sources=lab().sources||[];
  dialog.innerHTML=header('현재 농업의 모습을 살펴봐요')+`<div class="research-body reference-body"><section class="research-viewer"><div class="research-question"><span>참고 자료</span><h3>${esc(lab().question)}</h3></div>${toolbar(sources.some(source=>source.kind==='image'))}<div class="research-sources ${sources.length===1?'single-source':''}">${sources.map((source,index)=>sourceView(source,index)).join('')}</div><p class="research-material-notice">이 자료들은 현재 농업을 이해하는 서로 다른 농장의 참고 사례예요. 과거·최근의 변화 증거로 비교하지 않아요. ${esc(lab().notice||'')}</p></section><aside class="research-notes"><div class="research-note-intro"><span>🍅 농업 모습을 더 알아봐요</span><p>작물 주변에 어떤 시설이 있나요?<br>시설이 하는 일을 사진과 영상에서 찾아요.</p></div><label class="research-writing-label" for="research-reference-note"><b>살펴보고 남기는 메모 <small>(선택)</small></b><small>현재 농업의 모습을 이해하는 참고 기록이에요.</small></label><textarea id="research-reference-note" maxlength="1600" placeholder="작물 주변에서 …을 보았어요.">${esc(record().referenceNote)}</textarea><div class="research-save-row"><span class="research-status" role="status">메모는 이 기기에 자동 저장돼요.</span><button data-action="back-village" class="research-save">마을 탐험 계속하기 →</button></div></aside></div>${npcFooter('지금도 농사를 짓는 사람들의 실제 모습이야. 작물이 자라도록 어떤 시설을 이용하는지 찾아보렴.')}`;
  bindCommon();bindViews();$('#research-reference-note').oninput=event=>{record().referenceNote=event.target.value;record().updatedAt=new Date().toISOString();if(persist())status('농업 참고 메모를 저장했어요.');};layoutSoon();
 }
 function bindViews(){
  const token=viewToken;
  const zoomIn=$('[data-action="zoom-in"]'),zoomOut=$('[data-action="zoom-out"]'),reset=$('[data-action="reset-view"]');
  if(zoomIn)zoomIn.onclick=()=>{zoom=Math.min(3,zoom+.5);layoutImages();};if(zoomOut)zoomOut.onclick=()=>{zoom=Math.max(1,zoom-.5);layoutImages();};
  if(reset)reset.onclick=()=>{zoom=1;layoutImages();$$('.research-source-window').forEach(window=>{window.scrollLeft=0;window.scrollTop=0;});};
  for(const next of ['split','swipe'])if($(`[data-action="${next}"]`))$(`[data-action="${next}"]`).onclick=()=>{stopViews();mode=next;selected=null;renderCompare();};
  const range=$('.research-swipe-control input');if(range)range.oninput=()=>{swipe=Number(range.value);applySwipe();drawPins();};
  const markReady=sourceId=>{if(token!==viewToken)return;loaded.add(sourceId);if(context.type==='encounter'){updateCollectButton();if(context.canCollect)status('자료가 열렸어요. 직접 본 모습을 쓰고 단서를 수집해요.');}};
  const showError=(node,sourceId)=>{if(token!==viewToken)return;loaded.delete(sourceId);node.hidden=true;const error=node.closest('.research-source')?.querySelector('.research-media-error');if(error)error.hidden=false;updateCollectButton();status('자료가 열리지 않아 단서를 수집할 수 없어요. 원문을 확인하거나 다시 만나 보세요.');};
  $$('video').forEach(video=>{
   const sourceId=video.closest('[data-source]').dataset.source;
   for(const name of ['loadeddata','canplay'])video.addEventListener(name,()=>markReady(sourceId));
   video.addEventListener('error',()=>showError(video,sourceId));video.querySelector('source')?.addEventListener('error',()=>showError(video,sourceId));
   if(video.readyState>=2)markReady(sourceId);
  });
  $$('.research-photo-plane').forEach(plane=>{
   const image=plane.querySelector('img'),sourceId=plane.closest('[data-source]').dataset.source;
   image.addEventListener('load',()=>{markReady(sourceId);layoutImages();});image.addEventListener('error',()=>showError(plane,sourceId));
   if(image.complete&&image.naturalWidth)markReady(sourceId);
   plane.addEventListener('click',event=>{
    if(Date.now()<pinGuardUntil||context.type!=='encounter'||!context.canCollect||plane.dataset.canPin!=='true'||!loaded.has(sourceId)||event.target.closest('[data-pin-index]'))return;
    const point=pointOnImage(plane.getBoundingClientRect(),event.clientX,event.clientY);if(!point)return;
    if(draft.pins.length>=12){status('사진 한 장에는 단서를 12개까지 표시할 수 있어요.');return;}
    draft.pins.push(createPin(point.x,point.y));selected=draft.pins.length-1;saveDraft();drawPins();$('#research-pin-label')?.focus();
   });
  });
  $$('.research-source-window').forEach(sourceWindow=>sourceWindow.addEventListener('scroll',()=>{
   if(syncing||mode!=='split')return;syncing=true;
   const x=sourceWindow.scrollLeft/Math.max(1,sourceWindow.scrollWidth-sourceWindow.clientWidth),y=sourceWindow.scrollTop/Math.max(1,sourceWindow.scrollHeight-sourceWindow.clientHeight);
   $$('.research-source-window').filter(other=>other!==sourceWindow).forEach(other=>{other.scrollLeft=x*(other.scrollWidth-other.clientWidth);other.scrollTop=y*(other.scrollHeight-other.clientHeight);});
   requestAnimationFrame(()=>syncing=false);
  },{passive:true}));
  if(typeof ResizeObserver==='function'){resizeObserver=new ResizeObserver(layoutImages);$$('.research-source-window').forEach(node=>resizeObserver.observe(node));}
  else{resizeFallback=layoutImages;window.addEventListener('resize',resizeFallback);}
 }
 function layoutSoon(){requestAnimationFrame(()=>{layoutImages();$('.research-close')?.focus({preventScroll:true});});}
 function layoutImages(){
  $$('.research-photo-plane').forEach(plane=>{
   const image=plane.querySelector('img'),window=plane.parentElement.parentElement;if(!image.naturalWidth||!window.clientWidth)return;
   const baseWidth=window.clientWidth,baseHeight=window.clientHeight,fit=Math.min(baseWidth/image.naturalWidth,baseHeight/image.naturalHeight),width=image.naturalWidth*fit*zoom,height=image.naturalHeight*fit*zoom,spaceWidth=Math.max(baseWidth,width),spaceHeight=Math.max(baseHeight,height);
   plane.parentElement.style.width=spaceWidth+'px';plane.parentElement.style.height=spaceHeight+'px';Object.assign(plane.style,{width:width+'px',height:height+'px',left:(spaceWidth-width)/2+'px',top:(spaceHeight-height)/2+'px'});
  });
  const label=$('.research-zoom-label');if(label)label.textContent=Math.round(zoom*100)+'%';applySwipe();
 }
 function applySwipe(){const image=$('.research-overlay-image'),line=$('.research-swipe-line');if(image)image.style.clipPath=`inset(0 0 0 ${swipe}%)`;if(line)line.style.left=swipe+'%';}
 function drawPins(){
  if(!active)return;const editable=context.type==='encounter'&&context.canCollect;
  $$('.research-photo-plane').forEach(plane=>{
   const index=Number(plane.dataset.sourceIndex),indices=mode==='swipe'&&context.type==='compare'?[0,1]:[index];
   plane.querySelector('.research-pins').innerHTML=indices.map(sourceIndex=>{
    const pins=context.type==='encounter'?(draft?.pins||[]):context.type==='compare'?record()[eras[sourceIndex]].pins:[];
    return pins.map((pin,pinIndex)=>mode==='swipe'&&!pinVisibleInSwipe(pin,sourceIndex,swipe)?'':`<${editable?'button':'span'} class="research-pin source-${sourceIndex} ${selected===pinIndex?'selected':''}" ${editable?`data-pin-index="${pinIndex}"`:''} style="left:${pin.x*100}%;top:${pin.y*100}%" ${editable?`aria-label="단서 ${pinIndex+1}: ${esc(pin.label||'설명 쓰기')}"`:`title="${esc(pin.label||'모은 단서')}"`}>${pinIndex+1}</${editable?'button':'span'}>`).join('');
   }).join('');
  });
  const list=$('.research-pin-list');if(!list)return;
  const pins=draft?.pins||[];$('.research-pin-count').textContent=pins.length?'('+pins.length+')':'';
  list.innerHTML=pins.map((pin,index)=>editable?`<button class="research-pin-chip ${selected===index?'selected':''}" data-pin-index="${index}"><b>${index+1}</b> ${esc(pin.label||'어떤 단서인가요?')}</button>`:`<span class="research-pin-chip"><b>${index+1}</b> ${esc(pin.label||'사진에 표시한 단서')}</span>`).join('')||'<p class="research-pin-empty">사진에 표시하는 것은 선택이에요.<br>직접 본 모습은 아래에 글로 남겨요.</p>';
  $$('[data-pin-index]').forEach(button=>button.onclick=event=>{event.stopPropagation();selected=Number(button.dataset.pinIndex);drawPins();$('#research-pin-label')?.focus();});
  const editor=$('.research-selected-pin');editor.hidden=!editable||selected===null;
  if(editable&&selected!==null){
   const pin=pins[selected];if(!pin){selected=null;editor.hidden=true;return;}
   $('#research-pin-label').value=pin.label;$('#research-pin-label').oninput=event=>{pin.label=event.target.value;saveDraft();$$('.research-pin-chip').filter(button=>Number(button.dataset.pinIndex)===selected).forEach(button=>button.lastChild.textContent=' '+(pin.label||'어떤 단서인가요?'));};
   $('[data-action="remove-pin"]').onclick=()=>{draft.pins.splice(selected,1);selected=null;saveDraft();drawPins();};
  }
 }
 function openNotebook(){
  stopViews();prepare();active=null;context={type:'notebook',npc:{name:'부엉 박사',role:'단서 수첩',art:7}};viewToken++;draft=null;
  const cards=Object.values(LABS).filter(item=>!item.reference).map(item=>{
   const entry=store.labs[item.id];return `<article class="research-evidence-card"><div class="research-evidence-card-head"><span>${item.id==='rice'?'🌾':'🗺️'}</span><div><span class="research-card-state ${entry.completed?'complete':''}">${entry.completed?'✓ 비교 카드 완성':hasEvidence(entry)?'단서 수집 중':'아직 모은 단서가 없어요'}</span><h3>${esc(item.title)}</h3></div></div><div class="research-pocket-pair">${eras.map((era,index)=>{
    if(!entry[era].collected)return `<div class="research-pocket locked"><span>🔒</span><b>${eraLabel(era)} 단서</b><p>이 시대의 주민을 만나 단서를 모아요.</p></div>`;
    const source=item.sources[index];if(!source)return '';
    return `<div class="research-pocket"><span class="research-era-pill">${eraLabel(era)} 단서</span>${source.kind==='image'?`<img src="${esc(source.src||'')}" alt="${esc(source.title)}">`:source.poster?`<img src="${esc(source.poster)}" alt="${esc(source.title)} 대표 사진">`:''}<b>${esc(source.date)}</b><small>${esc(source.place)}</small><p>${esc(entry[era].observation)}</p><a href="${esc(source.sourceUrl||'#')}" target="_blank" rel="noopener noreferrer">${esc(source.sourceName||'자료 원문')} ↗</a></div>`;
   }).join('')}</div>${entry.comparison?`<div class="research-card-comparison"><b>달라진 모습과 그 근거</b><p>${esc(entry.comparison)}</p>${entry.unchanged?`<b>비슷하게 남아 있는 모습</b><p>${esc(entry.unchanged)}</p>`:''}</div>`:''}${hasEvidence(entry)?`<button class="research-card-review" data-review="${esc(item.id)}">모은 단서 다시 보기 →</button>`:'<p class="research-uncollected-tip">마을을 탐험하며 주민을 만나 보세요.</p>'}</article>`;
  }).join('');
  const refs=Object.values(LABS).filter(item=>item.reference&&store.labs[item.id]?.referenceNote.trim()).map(item=>`<article class="research-reference-card"><b>🍅 현재 농업 참고 메모</b><p>${esc(store.labs[item.id].referenceNote)}</p></article>`).join('');
  dialog.innerHTML=header('모은 단서 카드 수첩')+`<div class="research-notebook"><div class="research-notebook-intro"><div><span class="research-eyebrow">주민을 만나 하나씩 모은 증거</span><h3>${esc(getName()||'들빛마을')} 탐정의 단서 카드</h3><p>비교 카드 완성 ${count()} / ${Object.values(LABS).filter(item=>!item.reference).length} · 모은 단서만 수첩에 나타나요.</p></div><div class="research-download-actions"><button class="research-save" data-action="download">단서 수첩 내려받기 ↓</button><div class="research-download-ready" ${readyDownload?'':'hidden'}>${readyDownload?`<a href="${esc(readyDownload.url)}" download="${esc(readyDownload.name)}">준비된 단서 수첩 받기 ↓</a>`:''}</div></div></div><div class="research-evidence-cards">${cards}</div>${refs}<p class="research-status" role="status">이 기기에서 이어 볼 수 있어요. 내려받은 수첩은 파일을 열어 읽거나 인쇄할 수 있어요.</p></div>${npcFooter('주민을 만나 모은 단서가 들어 있어. 모르는 내용은 먼저 짐작하지 말고, 다음 단서를 찾아보렴.')}`;
  bindCommon();$$('[data-review]').forEach(button=>button.onclick=()=>openCompare(button.dataset.review,{npc:{name:'부엉 박사',role:'모은 단서 다시 보기',art:7}}));$('[data-action="download"]').onclick=exportNotebook;layoutSoon();
 }
 async function exportNotebook(){
  const button=$('[data-action="download"]');if(!button)return;button.disabled=true;button.textContent='사진과 단서를 담는 중…';
  try{
   const media={};await Promise.all(Object.values(LABS).flatMap(item=>item.sources.map(async(source,index)=>{
    const entry=store.labs[item.id];if(item.reference?!entry.referenceNote.trim():!eras[index]||!entry[eras[index]].collected)return;
    const src=source.kind==='image'?source.src:source.poster;if(!src)return;
    try{const response=await fetch(src);if(!response.ok)return;const blob=await response.blob();if(!blob.type.startsWith('image/'))return;media[item.id+'/'+source.id]=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(blob);});}catch{}
   })));
   const html=buildResearchHTML(LABS,store,getName(),media),url=URL.createObjectURL(new Blob([html],{type:'text/html;charset=utf-8'}));
   if(readyDownload)URL.revokeObjectURL(readyDownload.url);readyDownload={url,name:'들빛마을_과거현재_단서수첩.html'};
   const holder=$('.research-download-ready');
   if(holder){holder.hidden=false;holder.innerHTML=`<a href="${esc(url)}" download="${esc(readyDownload.name)}">준비된 단서 수첩 받기 ↓</a>`;holder.querySelector('a').click();}
   status('단서 수첩이 준비됐어요. 저장되지 않았다면 ‘준비된 단서 수첩 받기’를 눌러요.');
  }catch{status('단서 수첩을 내려받지 못했어요. 다시 눌러 주세요.');}
  finally{if(button.isConnected){button.disabled=false;button.textContent='단서 수첩 내려받기 ↓';}}
 }
 function finishClose(){if(closed)return;closed=true;stopViews();onClose();lastFocus?.focus?.({preventScroll:true});}
 function close(){
  if(!isOpen())return;stopViews();
  try{if(typeof dialog.close==='function'&&!dialog.classList.contains('research-dialog-fallback'))dialog.close();else throw new Error('fallback close');}
  catch{dialog.removeAttribute('open');finishClose();}
 }
 dialog.addEventListener('close',finishClose);dialog.addEventListener('cancel',event=>{event.preventDefault();close();});dialog.addEventListener('keydown',event=>{
  event.stopPropagation();if(event.key==='Escape'){event.preventDefault();close();return;}
  if(event.key==='Tab'){
   const nodes=$$('button:not(:disabled),a[href],input:not(:disabled),textarea:not(:disabled),[tabindex="0"]').filter(node=>node.getClientRects().length);
   if(!nodes.length){event.preventDefault();return;}const first=nodes[0],last=nodes.at(-1);
   if(event.shiftKey&&(document.activeElement===first||document.activeElement===dialog)){event.preventDefault();last.focus();}
   else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  }
 });
 function count(){return Object.values(LABS).filter(item=>!item.reference&&store.labs[item.id].completed).length;}
 function reset(){close();store=restoreResearch(null,LABS);if(readyDownload){URL.revokeObjectURL(readyDownload.url);readyDownload=null;}persist();}
 return {openEncounter,openCompare,openReference,openNotebook,isOpen,close,reset,count,records:()=>JSON.parse(JSON.stringify(store.labs)),open:(id='maps')=>openCompare(id)};
}

return Object.freeze({createResearch});
})();

// src/game.js
const __mod0=(()=>{
const {WIDTH, HEIGHT, AVATARS, NPCS, QUESTS, MAP_LABELS}=__mod1;
const {snap, pathfind, walkable, advance, dist}=__mod2;
const {SAVE_KEY, fresh, restore, currentQuest, mark, ready, recordComparison, complete}=__mod3;
const {createGait, updateGait, moveSpeed}=__mod4;
const {createWalker}=__mod5;
const {PHOTOS}=__mod7;
const {createResearch}=__mod8;







const $=id=>document.getElementById(id),escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let hasSession=false;
let gait=createGait(), walkingSpeed=0;
const walker=createWalker(document.getElementById('player-art'));
let state=fresh(),avatar=0,running=false,route=[],arrival=null,keys=new Set(),stick={x:0,y:0},camera={x:0,y:0},zoom=1,overview=false,last=0,lastMini=0,dialogue=null,typing=null,typed=false,traveling=false,sound=false,audioCtx=null,toastTimer=null,nearby=null;
const npcList=NPCS.map(n=>({...n,...snap(n)})),images={past:$('world-past'),now:$('world-now')};
let evidenceResident=null;
const research=createResearch({getName:()=>state.name,
 onCollected:(id,era)=>{const q=QUESTS.find(q=>q.lab===id);if(!q)return;mark(state,q.id,'met',era);mark(state,q.id,'seen',era);save();updateQuest();tone('win');},
 onCompared:id=>{const q=QUESTS.find(q=>q.lab===id);if(!q)return;if(!recordComparison(state,q))return;research.close();closeDialogue();finishQuest(q,evidenceResident||npcList.find(n=>n.id===q.npc));},
 onTravel:era=>{research.close();travel(era);},
 onClose:()=>{keys.clear();resetStick();if(hasSession){syncEvidenceProgress();save();updateQuest();}}});
function pauseForEvidence(){route=[];arrival=null;keys.clear();resetStick();$('destination').hidden=true;closeDialogue();}
function meetResident(n){
 evidenceResident=n;pauseForEvidence();
 if(!state.intro){state.intro=true;save();}
 if(n.id==='grower'){research.openReference('grow',{npc:n});updateQuest();return;}
 const id=n.id==='farmer'?'rice':'maps',q=QUESTS.find(q=>q.lab===id),record=research.records()[id];
 if(ready(state,q)&&record?.past?.collected&&record?.now?.collected)research.openCompare(id,{npc:n});
 else research.openEncounter(id,{era:state.era,npc:n,canCollect:true});
 updateQuest();
}

function save(){if(!hasSession)return;try{localStorage.setItem(SAVE_KEY,JSON.stringify(state))}catch{}}
function saved(){try{return restore(localStorage.getItem(SAVE_KEY))}catch{return null}}
function toast(message){$('toast').textContent=message;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,3500)}
function tone(kind='step'){if(!sound)return;try{audioCtx??=new(window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.setValueAtTime(kind==='win'?587:kind==='time'?280:740,audioCtx.currentTime);if(kind==='win')o.frequency.exponentialRampToValueAtTime(1174,audioCtx.currentTime+.2);g.gain.setValueAtTime(.065,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+.3);o.start();o.stop(audioCtx.currentTime+.32)}catch{}}
function avatarArt(el,i){el.className='sprite cast-'+i;if(el===$('player-art'))walker.select(i);}
function setScreen(id){for(const s of ['title-screen','create-screen','game-screen'])$(s).hidden=s!==id;running=id==='game-screen';if(!running){route=[];arrival=null;keys.clear();resetStick();closeDialogue();$('panel').close()}else{$('viewport').focus({preventScroll:true});resize()}}
function updateContinue(){$('continue-game').hidden=!saved()}
AVATARS.forEach((a,i)=>{const b=document.createElement('button');b.className='avatar-choice'+(i===0?' active':'');b.innerHTML=`<span class="sprite cast-${i}"></span><b>${a.name}</b>`;b.setAttribute('aria-label',a.name);b.setAttribute('aria-pressed',i===0?'true':'false');b.onclick=()=>{avatar=i;[...$('avatar-options').children].forEach((el,j)=>{el.classList.toggle('active',j===i);el.setAttribute('aria-pressed',j===i?'true':'false')})};$('avatar-options').append(b)});
$('new-game').onclick=()=>setScreen('create-screen');$('back-title').onclick=()=>setScreen('title-screen');$('continue-game').onclick=()=>{const s=saved();if(s){state=s;start()}};$('start-game').onclick=()=>{research.reset();hasSession=true;state=fresh(avatar,$('detective-name').value);save();start();toast('부엉 박사에게 다가가서 인사해 볼까요?')};
$('home-button').onclick=()=>{if(traveling)return;save();setScreen('title-screen');updateContinue()};
function syncEvidenceProgress(){const records=research.records();for(const q of QUESTS){const r=records[q.lab];state.progress[q.id]={met:['past','now'].filter(e=>r?.[e]?.collected),seen:['past','now'].filter(e=>r?.[e]?.collected),compared:!!r?.completed};}state.completed=QUESTS.filter(q=>ready(state,q)&&state.progress[q.id].compared).map(q=>q.id);state.ending=state.ending&&state.completed.length===QUESTS.length;}
function start(){syncEvidenceProgress();save();gait=createGait();walkingSpeed=0;hasSession=true;Object.assign(state,snap(state));route=[];arrival=null;traveling=false;overview=false;avatarArt($('player-art'),state.avatar);$('player-name').textContent=state.name;setScreen('game-screen');buildActors();renderWorld();updateQuest();updateCamera(true);updateMinimap();last=performance.now();}
function buildActors(){const root=$('actors');root.replaceChildren();for(const n of npcList){const b=document.createElement('button');b.className='actor npc';b.id='npc-'+n.id;b.style.left=n.x+'px';b.style.top=n.y+'px';b.style.zIndex=String(10+Math.floor(n.y/100));b.setAttribute('aria-label',`${n.name}에게 걸어가 대화하기`);b.innerHTML=`<div class="actor-shadow"></div><span class="npc-marker quiet">···</span><span class="sprite cast-${n.art}"></span><span class="actor-name">${n.name}</span>`;b.addEventListener('pointerdown',e=>e.stopPropagation());b.onclick=e=>{e.stopPropagation();go(n,()=>talk(n))};root.append(b)}}
function progress(q){return state.progress[q.id]}
function goal(){if(!state.intro)return {type:'npc',...npcList.find(n=>n.id==='owl')};const q=currentQuest(state);if(!q)return {type:'npc',...npcList.find(n=>n.id==='owl')};const n=npcList.find(n=>n.id===q.npc);if(ready(state,q))return {type:'npc',...n};if(progress(q).seen.includes(state.era))return {type:'era',...n,name:'다른 시대로 이동'};return {type:'npc',...n};}
function renderWorld(){images.past.classList.toggle('hidden-era',state.era!=='past');images.now.classList.toggle('hidden-era',state.era!=='now');$('era-past').classList.toggle('active',state.era==='past');$('era-now').classList.toggle('active',state.era==='now');$('era-now').dataset.era='now';$('era-past').disabled=!state.intro||traveling;$('era-now').disabled=!state.intro||traveling;$('mini-era').textContent=state.era==='past'?'과거 · 수십 년 전':'현재 · 오늘의 마을';$('map-labels').innerHTML=MAP_LABELS.map(l=>`<span class="map-label" style="left:${l.x}px;top:${l.y}px">${l[state.era]}</span>`).join('');$('clues').replaceChildren();const g=goal();for(const n of npcList){const m=$('npc-'+n.id)?.querySelector('.npc-marker');if(!m)continue;const active=g.type==='npc'&&g.id===n.id;m.className='npc-marker'+(active?'':state.completed.some(id=>QUESTS.find(q=>q.id===id).npc===n.id)?' complete':' quiet');m.textContent=active?'!':m.classList.contains('complete')?'✓':'···'}updateMinimap();}
function updateQuest(){
 const q=currentQuest(state);$('xp').textContent='✦ '+state.completed.length*100;
 if(!state.intro){$('quest-chapter').textContent='프롤로그 · 시간의 문';$('quest-title').textContent='부엉 박사에게 인사하기';$('quest-instruction').textContent='주민을 만나 실제 자료를 받고, 두 시대의 단서를 찾아요.';$('quest-steps').innerHTML='<span class="quest-step">두 가지 비교 의뢰</span>'}
 else if(q){const p=progress(q);$('quest-chapter').textContent=`비교 의뢰 ${state.completed.length+1} / ${QUESTS.length}`;$('quest-title').textContent=q.title;const g=goal();$('quest-instruction').textContent=ready(state,q)?'두 시대의 실제 단서를 모았어요. 주민을 만나 비교 단서 카드를 완성해요.':g.type==='era'?'이 시대의 단서를 얻었어요. 시간을 바꾸고 같은 주민을 다시 만나요.':`${g.name}에게 가면 실제 자료가 열려요. 직접 본 모습을 단서로 남겨요.`;$('quest-steps').innerHTML=['past','now'].map(e=>`<span class="quest-step ${p.seen.includes(e)?'done':''}">${p.seen.includes(e)?'✓':'○'} ${e==='past'?'과거':'현재'} 단서</span>`).join('')+`<span class="quest-step ${p.compared?'done':''}">${p.compared?'✓':'○'} 비교 카드</span>`;}
 else{$('quest-chapter').textContent=state.ending?'탐정단 인증 완료':'최종 보고';$('quest-title').textContent=state.ending?'비교 단서 수집 완료!':'부엉 박사에게 보고하기';$('quest-instruction').textContent='농사 방법과 땅의 쓰임을 비교한 단서 카드를 수첩에서 확인해요.';$('quest-steps').innerHTML='<span class="quest-step done">✓ 두 가지 비교 카드</span>';}
 renderWorld();
}
function say(n,pages,onDone=null,options={}){route=[];arrival=null;keys.clear();resetStick();clearInterval(typing);dialogue={n,pages,index:0,onDone,...options};$('dialogue').hidden=false;$('controls').hidden=true;$('speaker').textContent=n.name;$('dialogue-tag').textContent=n.role||'들빛마을';avatarArt($('portrait'),n.art??7);$('dialogue-choices').replaceChildren();showPage();}
function showPage(){const d=dialogue;if(!d)return;const text=d.pages[d.index];$('dialogue-text').textContent='';$('page-count').textContent=`${d.index+1} / ${d.pages.length}`;$('dialogue-next').hidden=false;$('dialogue-next').textContent=d.index===d.pages.length-1?(d.lastLabel||'이야기 마치기 ✓'):'다음 이야기 ▸';$('dialogue-choices').replaceChildren();typed=false;let count=0;clearInterval(typing);typing=setInterval(()=>{if(!dialogue){clearInterval(typing);return}count+=2;$('dialogue-text').textContent=text.slice(0,count);if(count>=text.length){typed=true;clearInterval(typing)}},18);}
function reveal(){if(!dialogue)return;clearInterval(typing);$('dialogue-text').textContent=dialogue.pages[dialogue.index];typed=true;}
$('dialogue-next').onclick=()=>{if(!dialogue)return;if(!typed){reveal();return}if(dialogue.index<dialogue.pages.length-1){dialogue.index++;showPage()}else{const fn=dialogue.onDone;closeDialogue();fn?.()}};
$('dialogue-text').onclick=()=>{if(dialogue&&!typed)reveal()};$('dialogue-close').onclick=()=>{closeDialogue();toast('대화를 마쳐야 이야기가 기록돼요. 다시 말을 걸 수 있어요.')};
function closeDialogue(){clearInterval(typing);dialogue=null;$('dialogue').hidden=true;$('controls').hidden=false;$('dialogue-choices').replaceChildren()}
function talk(n){
 if(traveling)return;tone();
 if(n.id!=='owl'){meetResident(n);return;}
 if(!state.intro){say(n,[`반가워, ${state.name}! 나는 부엉 박사야. 두 가지 시간여행 의뢰가 있단다.`, '주민을 만나면 실제 사진이나 영상이 열려. 직접 본 모습을 적고 단서를 수집해 봐.', '과거 단서를 얻으면 시간을 바꿔 같은 주민을 다시 만나렴. 현재 단서까지 얻으면 두 자료를 비교해 마지막 단서 카드를 완성할 수 있어.'],()=>{state.intro=true;save();updateQuest();toast('들녘 할아버지에게 가면 실제 자료가 열려요.');},{lastLabel:'주민 만나러 출발! →'});return;}
 if(!currentQuest(state)){state.ending=true;save();tone('win');confetti();showEnding();return;}
 const q=currentQuest(state),g=goal();say(n,[`지금 의뢰는 ‘${q.title}’이야.`,g.type==='era'?'이 시대의 단서를 모았구나. 위의 과거·현재 버튼으로 시간을 바꾸고 같은 주민을 만나렴.':`${npcList.find(p=>p.id===q.npc).name}에게 가면 실제 자료를 받을 수 있어. 두 시대를 비교해서 네가 발견한 것을 알려 줘.`]);
}

function finishQuest(q,n){if(!complete(state,q))return;save();tone('win');confetti();const next=currentQuest(state);say({...npcList.find(n=>n.id==='owl'),role:'비교 단서 카드 완성'},['과거와 현재의 실제 자료를 근거로 비교 카드를 완성했구나! 네가 모은 단서와 생각은 수첩에 남아 있어.',next?`다음 의뢰는 ‘${next.title}’이야. ${npcList.find(n=>n.id===next.npc).name}을 찾아가렴.`:'두 비교 카드를 모두 모았구나! 나에게 돌아와 최종 보고를 해 주렴.'],()=>{updateQuest();save();},{lastLabel:next?'다음 주민 만나러 가기 →':'부엉 박사에게 보고하기 →'});updateQuest()}
function showEnding(){const records=research.records();showPanel('탐정단 최종 보고',`<div class="complete-badge">🏅</div><h2 class="complete-text">시간의 단서를 모은 탐정!</h2><p class="complete-text"><b>${escape(state.name)}</b>, 실제 자료 네 장에서 두 가지 비교 카드를 완성했어요.</p>${QUESTS.map(q=>`<article class="journal-entry"><h3>✓ ${escape(q.title)}</h3><p>${escape(records[q.lab]?.comparison||'수첩에서 비교 기록을 확인해요.')}</p></article>`).join('')}<p class="small">농사 방법과 땅의 쓰임은 지역마다 다르게 달라질 수 있어요. 모든 들이 똑같이 바뀌는 것은 아니에요.</p><div class="title-actions"><button id="ending-notebook" class="button primary">내가 모은 비교 카드 보기 ▤</button><button id="certificate" class="button secondary">탐정 인증서 저장 ↓</button><button id="freeplay" class="button secondary">마을 더 둘러보기</button></div>`);$('ending-notebook').onclick=()=>{$('panel').close();research.openNotebook();};$('certificate').onclick=download;$('freeplay').onclick=()=>$('panel').close();}
function go(target,fn=null){if(!running||dialogue||traveling||$('panel').open||research.isOpen())return;const dest=snap(target);const next=pathfind(state,dest);if(!next.length&&dist(state,dest)>40){toast('길이 이어진 곳을 눌러 주세요.');return}route=next;arrival=fn;$('destination').style.left=dest.x+'px';$('destination').style.top=dest.y+'px';$('destination').hidden=false;if(!route.length){$('destination').hidden=true;const cb=arrival;arrival=null;cb?.()} }
function viewportPoint(e){const rect=$('viewport').getBoundingClientRect();return {x:(e.clientX-rect.left-camera.x)/zoom,y:(e.clientY-rect.top-camera.y)/zoom}}
$('viewport').addEventListener('pointerdown',e=>{if(e.target.closest('.actor,.clue'))return;if(e.button!==0&&e.pointerType==='mouse')return;const p=viewportPoint(e);if(p.x<0||p.x>WIDTH||p.y<0||p.y>HEIGHT)return;go(p);$('viewport').focus({preventScroll:true})});
function resetStick(){stick={x:0,y:0};$('stick').style.transform='translate(0,0)'}let joyId=null;
$('joystick').addEventListener('pointerdown',e=>{if(dialogue||traveling||research.isOpen())return;joyId=e.pointerId;$('joystick').setPointerCapture(e.pointerId);updateStick(e);e.preventDefault()});
function updateStick(e){if(e.pointerId!==joyId)return;const r=$('joystick').getBoundingClientRect(),dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2,d=Math.hypot(dx,dy),max=30;stick={x:dx/(d>max?d:max),y:dy/(d>max?d:max)};$('stick').style.transform=`translate(${stick.x*max}px,${stick.y*max}px)`;route=[];arrival=null;$('destination').hidden=true;}
$('joystick').addEventListener('pointermove',updateStick);for(const event of ['pointerup','pointercancel','lostpointercapture'])$('joystick').addEventListener(event,()=>{joyId=null;resetStick();save()});
window.addEventListener('keydown',e=>{if(!running||$('panel').open||traveling||research.isOpen())return;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','w','a','s','d','W','A','S','D'].includes(e.key)){if(dialogue)return;e.preventDefault();keys.add(e.key.toLowerCase());route=[];arrival=null;$('destination').hidden=true}if((e.key===' '||e.key==='e'||e.key==='E')&&!e.repeat){e.preventDefault();if(dialogue){if(!$('dialogue-next').hidden)$('dialogue-next').click()}else{$('interact').click()}}if(e.key==='Escape'&&dialogue)closeDialogue()});window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));window.addEventListener('blur',()=>{keys.clear();resetStick();save()});document.addEventListener('visibilitychange',()=>{if(document.hidden){keys.clear();resetStick();save()}});
function interactions(){if(dialogue||traveling||research.isOpen())return;nearby=[...npcList].sort((a,b)=>dist(state,a)-dist(state,b)).find(n=>dist(state,n)<65)||null;$('interact').disabled=!nearby;$('interact').querySelector('span').textContent=nearby?'주민 만나기':'…';$('interact').querySelector('small').textContent=nearby?nearby.name:'주민에게 가까이 가요';}
$('interact').onclick=()=>{if(!nearby||dialogue||traveling||research.isOpen())return;talk(nearby)};
async function travel(era){if(!state.intro||traveling||era===state.era)return;if(dialogue)closeDialogue();keys.clear();route=[];arrival=null;resetStick();traveling=true;$('destination').hidden=true;$('time-overlay').hidden=false;$('controls').hidden=true;tone('time');await new Promise(r=>setTimeout(r,650));state.era=era;save();renderWorld();updateQuest();await new Promise(r=>setTimeout(r,650));$('time-overlay').hidden=true;$('controls').hidden=false;traveling=false;renderWorld();toast(era==='past'?'수십 년 전의 들빛마을에 도착했어요.':'오늘의 들빛마을에 도착했어요.');}
$('era-past').onclick=()=>travel('past');$('era-now').onclick=()=>travel('now');$('track-button').onclick=()=>{const g=goal();if(g.type==='era'){toast('위의 과거·현재 버튼을 눌러 다른 시대로 이동해요.');return}toast(`${g.name}까지 길을 따라 걸어가요.`);go(g,()=>talk(npcList.find(n=>n.id===g.id)))};$('quest-fold').onclick=()=>{const folded=$('quest-card').classList.toggle('folded');$('quest-fold').textContent=folded?'+':'−';$('quest-fold').setAttribute('aria-label',folded?'미션 펼치기':'미션 접기')};$('zoom-button').onclick=()=>{overview=!overview;$('zoom-button').textContent=overview?'+':'−';resize();updateCamera(true)};$('minimap').onclick=e=>{const r=$('minimap').getBoundingClientRect();go({x:(e.clientX-r.left)/r.width*WIDTH,y:(e.clientY-r.top)/r.height*HEIGHT})};
function resize(){const w=$('viewport').clientWidth,h=$('viewport').clientHeight;zoom=overview?Math.min(w/WIDTH,h/HEIGHT):w<650?1.15:h<500?1.25:1.4;}
function updateCamera(immediate=false){const w=$('viewport').clientWidth,h=$('viewport').clientHeight;let targetX=w*.5-state.x*zoom,targetY=h*(dialogue?.36:.53)-state.y*zoom;targetX=WIDTH*zoom<w?(w-WIDTH*zoom)/2:Math.min(0,Math.max(w-WIDTH*zoom,targetX));targetY=HEIGHT*zoom<h?(h-HEIGHT*zoom)/2:Math.min(0,Math.max(h-HEIGHT*zoom,targetY));const lerp=immediate?1:.12;camera.x+=(targetX-camera.x)*lerp;camera.y+=(targetY-camera.y)*lerp;$('world').style.transform=`translate(${camera.x.toFixed(2)}px,${camera.y.toFixed(2)}px) scale(${zoom})`;$('player').style.left=state.x+'px';$('player').style.top=state.y+'px';const g=goal(),gx=g.x*zoom+camera.x,gy=g.y*zoom+camera.y;const off=g.type!=='era'&&!dialogue&&(gx<20||gx>w-20||gy<15||gy>h-50);$('waypoint').hidden=!off;if(off){const angle=Math.atan2(gy-h/2,gx-w/2);$('waypoint').style.left=Math.max(100,Math.min(w-120,gx))+'px';$('waypoint').style.top=65+Math.max(160,Math.min(h-150,gy))+'px';$('waypoint').style.right='auto';$('waypoint').querySelector('span').style.transform=`rotate(${angle}rad)`}}
function updateMinimap(){const c=$('minimap'),x=c.getContext('2d'),sx=c.width/WIDTH,sy=c.height/HEIGHT;x.clearRect(0,0,c.width,c.height);const im=images[state.era];if(im.complete&&im.naturalWidth)x.drawImage(im,0,0,c.width,c.height);for(const n of npcList){x.beginPath();x.fillStyle=n.id==='owl'?'#f7e4b0':'#fff9e9';x.arc(n.x*sx,n.y*sy,2,0,Math.PI*2);x.fill()}const g=goal();if(g.type!=='era'){x.beginPath();x.fillStyle='#f5c645';x.strokeStyle='#fff9dd';x.lineWidth=2;x.arc(g.x*sx,g.y*sy,4.5,0,Math.PI*2);x.fill();x.stroke()}x.beginPath();x.fillStyle='#3274a1';x.strokeStyle='#fff';x.lineWidth=2;x.arc(state.x*sx,state.y*sy,4,0,Math.PI*2);x.fill();x.stroke();const w=$('viewport').clientWidth,h=$('viewport').clientHeight;x.strokeStyle='#fff9dfb8';x.lineWidth=1;x.strokeRect(-camera.x/zoom*sx,-camera.y/zoom*sy,w/zoom*sx,h/zoom*sy)}
function frame(time){
 const dt=Math.min(.04,(time-last)/1000||.016);last=time;
 if(running){
  const before={x:state.x,y:state.y};
  if(!dialogue&&!traveling&&!$('panel').open&&!research.isOpen()){
   let vx=stick.x+(keys.has('arrowright')||keys.has('d')?1:0)-(keys.has('arrowleft')||keys.has('a')?1:0);
   let vy=stick.y+(keys.has('arrowdown')||keys.has('s')?1:0)-(keys.has('arrowup')||keys.has('w')?1:0);
   const wantsMove=!!(vx||vy||route.length);
   walkingSpeed=moveSpeed(walkingSpeed,wantsMove,dt);
   if(vx||vy){
    const len=Math.max(1,Math.hypot(vx,vy));vx/=len;vy/=len;
    const dx=vx*walkingSpeed*dt,dy=vy*walkingSpeed*dt;
    if(walkable(state.x+dx,state.y))state.x+=dx;
    if(walkable(state.x,state.y+dy))state.y+=dy;
   }else if(route.length){
    advance(state,route,walkingSpeed*dt);
    if(!route.length){$('destination').hidden=true;save();const fn=arrival;arrival=null;fn?.();}
   }
   interactions();
  }else{walkingSpeed=0;}
  const dx=state.x-before.x,dy=state.y-before.y;
  gait=updateGait(gait,dx,dy,dt);
  $('player').classList.toggle('walking',gait.moving);
  $('player').classList.remove('facing-left');
  walker.render(gait);
  updateCamera();
  if(time-lastMini>140){
   updateMinimap();lastMini=time;
   const nearest=[...npcList].sort((a,b)=>dist(state,a)-dist(state,b))[0];
   $('location').textContent=nearest&&dist(state,nearest)<230?nearest.role.replace(' 이야기','')+' 주변':'들빛마을 산책길';
  }
 }
 requestAnimationFrame(frame);
}
function showPanel(label,html){keys.clear();resetStick();$('panel-label').textContent=label;$('panel-content').innerHTML=html;if(!$('panel').open)$('panel').showModal()}
$('panel-close').onclick=()=>$('panel').close();$('panel').addEventListener('click',e=>{if(e.target===$('panel')){const r=$('panel').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('panel').close()}});
$('journal-button').onclick=()=>{if(traveling)return;pauseForEvidence();research.openNotebook();};
$('settings-button').onclick=()=>{if(traveling)return;showPanel('탐험 안내',`<h2>주민에게 시간의 단서를 받아요</h2><p><b>① 주민 만나기</b> · 주민을 누르면 길을 따라 가까이 걸어가요. 옆에서 ‘주민 만나기’를 눌러도 돼요. 실제 자료가 바로 열립니다.</p><p><b>② 과거 단서 수집</b> · 사진·영상에서 직접 본 모습을 한 줄로 쓰고 단서를 수집해요. 사진에는 찾은 곳을 표시할 수 있어요.</p><p><b>③ 현재 단서 수집</b> · 시간을 바꾸고 같은 주민을 다시 만나 다른 시기의 자료를 받아요.</p><p><b>④ 두 자료 비교</b> · 두 단서를 나란히 살펴보고 달라진 모습과 그 근거를 적어 비교 카드를 완성해요.</p><p><b>보조 자료</b> · 초록 이모는 현재 농업 시설의 사진·영상을 보여 줘요. 서로 다른 농장 자료이므로 같은 장소의 과거·현재라고 비교하지 않아요.</p><p><b>조작</b> · 바닥 누르기, 조이스틱, 방향키·WASD로 이동해요. E·스페이스로 주민을 만날 수 있어요. 수첩에서는 수집한 단서만 다시 볼 수 있어요.</p><div class="settings-row"><span>효과음</span><button id="sound-toggle" class="button secondary">${sound?'켜짐':'꺼짐'}</button></div><p class="small">마을 그림은 가상 배경이에요. 실제 자료의 지역·연도를 확인하며 관찰해요. 기록은 같은 기기에 저장됩니다. 버전 4.0 · 주민과 실제 자료 연결</p>`);$('sound-toggle').onclick=()=>{sound=!sound;$('sound-toggle').textContent=sound?'켜짐':'꺼짐';tone();};};

function download(){const c=document.createElement('canvas');c.width=1400;c.height=1000;const x=c.getContext('2d');x.fillStyle='#f8f4e5';x.fillRect(0,0,1400,1000);x.strokeStyle='#91b296';x.lineWidth=8;x.strokeRect(35,35,1330,930);x.textAlign='center';x.fillStyle='#849b76';x.font='bold 18px sans-serif';x.fillText('TIME TRAVEL DETECTIVES · CHAPTER 01',700,115);x.fillStyle='#305d4c';x.font='bold 56px sans-serif';x.fillText('들빛마을 시간 탐정 인증서',700,205);x.font='36px sans-serif';x.fillText(state.name+' 탐정',700,295);x.font='25px sans-serif';['손으로 모내기하는 사진과 기계 모내기 영상','대전 갑천 주변의 1970년·2021년 항공사진','과거와 현재의 실제 자료에서 네 단서를 모으고','두 가지 비교 카드에 관찰한 모습과 근거를 남겼습니다.'].forEach((t,i)=>x.fillText(t,700,390+i*62));x.fillStyle='#e8e8ce';x.fillRect(100,695,1200,130);x.fillStyle='#4b7158';x.font='23px sans-serif';x.fillText('환경을 이용하며 살아가는 모습은 다양하고,',700,747);x.fillText('지역마다 변화 모습도 다를 수 있습니다.',700,790);x.fillStyle='#8b987d';x.font='17px sans-serif';x.fillText('가상 마을 탐험 · 실제 자료 네 단서 · 두 비교 카드 완료',700,905);const a=document.createElement('a');a.download='들빛마을_시간탐정_인증서.png';a.href=c.toDataURL('image/png');document.body.append(a);a.click();a.remove();toast('인증서 이미지를 저장했어요.')}
function confetti(){const root=$('confetti');root.replaceChildren();for(let i=0;i<35;i++){const p=document.createElement('i');p.style.left=Math.random()*100+'%';p.style.background=['#f6cd6e','#98bf9a','#e99e88','#98c7cc'][i%4];p.style.animationDelay=Math.random()*.5+'s';p.style.rotate=Math.random()*360+'deg';root.append(p)}setTimeout(()=>root.replaceChildren(),3600)}
const ambient=$('ambient');ambient.innerHTML='<div class="portal"></div>'+Array.from({length:14},(_,i)=>`<span class="petal" style="left:${80+i*100}px;top:${80+i%5*130}px;animation-delay:${-i*.8}s"></span>`).join('')+Array.from({length:7},(_,i)=>`<span class="ripple" style="left:${1400-i%2*40}px;top:${110+i*120}px;animation-delay:${-i*.7}s"></span>`).join('');
window.addEventListener('resize',()=>{if(running){resize();updateCamera(true)}});window.addEventListener('pagehide',save);Object.values(images).forEach(im=>im.addEventListener('load',()=>{if(running)updateMinimap()}));updateContinue();requestAnimationFrame(frame);

return Object.freeze({});
})();
 }catch(error){
  console.error('들빛마을 초기화 실패',error);
  if(typeof document==='undefined')return;
  try{
   document.querySelectorAll('dialog[open]').forEach(dialog=>{try{dialog.close();}catch{dialog.removeAttribute('open');}});
   const notice=document.getElementById('boot-error')||document.createElement('section');
   notice.id='boot-error';notice.hidden=false;notice.setAttribute('role','alert');
   Object.assign(notice.style,{position:'fixed',inset:'20px',zIndex:'2147483647',maxWidth:'640px',maxHeight:'fit-content',margin:'auto',padding:'28px',border:'3px solid #fffdf4',borderRadius:'22px',background:'#fffaf0',color:'#315b4b',boxShadow:'0 12px 80px #163c3966',fontFamily:'"Malgun Gothic",system-ui,sans-serif',fontSize:'18px',lineHeight:'1.7',pointerEvents:'auto'});
   const title=document.createElement('strong');title.textContent='마을을 다시 불러와 주세요.';
   const explanation=document.createElement('p');explanation.textContent='앱을 여는 중 문제가 생겼어요. 새로고침한 뒤 다시 시작해 주세요.';
   const reload=document.createElement('button');reload.type='button';reload.textContent='새로고침하기 ↻';reload.onclick=()=>location.reload();
   Object.assign(reload.style,{border:'0',borderRadius:'12px',padding:'12px 18px',background:'#367d66',color:'#fffbed',font:'inherit',fontWeight:'700',cursor:'pointer'});
   notice.replaceChildren(title,explanation,reload);
   if(!notice.isConnected)(document.body||document.documentElement).append(notice);
   reload.focus();
  }catch(displayError){console.error('초기화 안내 표시 실패',displayError);}
 }
})();
