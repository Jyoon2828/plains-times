import {WIDTH,HEIGHT,AVATARS,NPCS,QUESTS,MAP_LABELS} from './data.js';
import {snap,pathfind,NPC_STOPS,moveOnRoad,advance,dist} from './world.js';
import {SAVE_KEY,fresh,restore,currentQuest,mark,ready,recordComparison,complete} from './state.js';
import {createGait,updateGait,moveSpeed} from './motion.js';
import {createWalker} from './walker.js';
import {cameraFrame,viewScale} from './camera.js';
import {PHOTOS} from './photos.js';
import {createResearch} from './research.js';
const $=id=>document.getElementById(id),escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let hasSession=false;
let gait=createGait(), walkingSpeed=0;
const walker=createWalker(document.getElementById('player-art'));
let state=fresh(),avatar=0,running=false,route=[],arrival=null,keys=new Set(),stick={x:0,y:0},camera={x:0,y:0},zoom=1,overview=true,last=0,lastMini=0,dialogue=null,typing=null,typed=false,traveling=false,sound=false,audioCtx=null,toastTimer=null,nearby=null,routeLabel='';
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const npcList=NPCS.map(n=>({...n,...NPC_STOPS[n.id]})),images={past:$('world-past'),now:$('world-now')};
let evidenceResident=null;
const research=createResearch({getName:()=>state.name,
 onCollected:(id,era)=>{const q=QUESTS.find(q=>q.lab===id);if(!q)return;mark(state,q.id,'met',era);mark(state,q.id,'seen',era);save();updateQuest();tone('win');},
 onCompared:id=>{const q=QUESTS.find(q=>q.lab===id);if(!q)return;if(!recordComparison(state,q))return;research.close();closeDialogue();finishQuest(q,evidenceResident||npcList.find(n=>n.id===q.npc));},
 onTravel:era=>{research.close();travel(era);},
 onClose:()=>{keys.clear();resetStick();if(hasSession){syncEvidenceProgress();save();updateQuest();}}});
function pauseForEvidence(){route=[];arrival=null;clearRoute();keys.clear();resetStick();$('destination').hidden=true;closeDialogue();}
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
function start(){syncEvidenceProgress();save();gait=createGait();walkingSpeed=0;hasSession=true;Object.assign(state,snap(state));route=[];arrival=null;traveling=false;overview=true;clearRoute();avatarArt($('player-art'),state.avatar);$('player-name').textContent=state.name;setScreen('game-screen');buildActors();renderWorld();updateQuest();updateCamera(true);updateMinimap();last=performance.now();}
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
function say(n,pages,onDone=null,options={}){route=[];arrival=null;clearRoute();keys.clear();resetStick();clearInterval(typing);dialogue={n,pages,index:0,onDone,...options};$('dialogue').hidden=false;$('controls').hidden=true;$('speaker').textContent=n.name;$('dialogue-tag').textContent=n.role||'들빛마을';avatarArt($('portrait'),n.art??7);$('dialogue-choices').replaceChildren();showPage();}
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
function clearRoute(){ $('route-line').setAttribute('d','');$('route-shadow').setAttribute('d','');$('walk-status').hidden=true; }
function drawRoute(){const d=route.length?'M '+state.x+' '+state.y+' L '+route.map(p=>p.x+' '+p.y).join(' L '):'';$('route-line').setAttribute('d',d);$('route-shadow').setAttribute('d',d);}
function viewMode(wide){overview=wide;for(const [id,active] of [['view-overview',wide],['view-walk',!wide]]){$(id).classList.toggle('active',active);$(id).setAttribute('aria-pressed',String(active));}$('zoom-button').textContent=wide?'＋':'−';$('zoom-button').setAttribute('aria-label',wide?'가까이 걷기로 바꾸기':'마을 전체 보기');$('game-screen').classList.toggle('walking-view',!wide);}
function stopWalking(){route=[];arrival=null;walkingSpeed=0;keys.clear();resetStick();$('destination').hidden=true;clearRoute();save();}
function go(target,fn=null){
 if(!running||dialogue||traveling||$('panel').open||research.isOpen())return;
 let dest=snap(target),next=pathfind(state,dest);
 if(fn&&dist(state,target)<55){route=[];arrival=null;clearRoute();$('destination').hidden=true;fn();return;}
 if(fn&&next.length){let remaining=38;while(next.length&&remaining>0){const end=next.at(-1),previous=next.length>1?next.at(-2):state,length=dist(previous,end);if(length<=remaining){next.pop();remaining-=length;}else{const t=(length-remaining)/length;next[next.length-1]={x:previous.x+(end.x-previous.x)*t,y:previous.y+(end.y-previous.y)*t};remaining=0;}}dest=next.at(-1)||{x:state.x,y:state.y};}
 if(!next.length&&dist(state,dest)>12){toast('길이 이어진 곳을 눌러 주세요.');return;}
 route=next;arrival=fn;routeLabel=target.name?target.name+'에게 가는 길':'길을 따라 산책 중';
 if(dist(target,dest)>36&&!fn)toast('가장 가까운 길로 걸어갈게요.');
 $('destination').style.left=dest.x+'px';$('destination').style.top=dest.y+'px';$('destination').hidden=!route.length;
 if(route.length){viewMode(false);drawRoute();$('walk-heading').textContent=routeLabel;$('walk-status').hidden=false;}
 else{clearRoute();const cb=arrival;arrival=null;cb?.();}
}
function viewportPoint(e){const rect=$('viewport').getBoundingClientRect();return {x:(e.clientX-rect.left-camera.x)/zoom,y:(e.clientY-rect.top-camera.y)/zoom}}
$('viewport').addEventListener('pointerdown',e=>{if(e.target.closest('.actor,.clue'))return;if(e.button!==0&&e.pointerType==='mouse')return;const p=viewportPoint(e);if(p.x<0||p.x>WIDTH||p.y<0||p.y>HEIGHT)return;go(p);$('viewport').focus({preventScroll:true})});
function resetStick(){stick={x:0,y:0};$('stick').style.transform='translate(0,0)'}let joyId=null;
$('joystick').addEventListener('pointerdown',e=>{if(dialogue||traveling||research.isOpen())return;joyId=e.pointerId;$('joystick').setPointerCapture(e.pointerId);updateStick(e);e.preventDefault()});
function updateStick(e){if(e.pointerId!==joyId)return;const r=$('joystick').getBoundingClientRect(),dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2,d=Math.hypot(dx,dy),max=30;stick={x:dx/(d>max?d:max),y:dy/(d>max?d:max)};$('stick').style.transform=`translate(${stick.x*max}px,${stick.y*max}px)`;route=[];arrival=null;clearRoute();viewMode(false);$('destination').hidden=true;}
$('joystick').addEventListener('pointermove',updateStick);for(const event of ['pointerup','pointercancel','lostpointercapture'])$('joystick').addEventListener(event,()=>{joyId=null;resetStick();save()});
window.addEventListener('keydown',e=>{if(!running||$('panel').open||traveling||research.isOpen())return;if(e.target.closest?.('input,textarea,select,[contenteditable="true"]'))return;if(!dialogue&&e.target.closest?.('button')&&(e.key===' '||e.key==='Enter'||e.key.toLowerCase()==='e'))return;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','w','a','s','d','W','A','S','D'].includes(e.key)){if(dialogue)return;e.preventDefault();keys.add(e.key.toLowerCase());route=[];arrival=null;clearRoute();viewMode(false);$('destination').hidden=true}if((e.key===' '||e.key==='e'||e.key==='E')&&!e.repeat){e.preventDefault();if(dialogue){if(!$('dialogue-next').hidden)$('dialogue-next').click()}else{$('interact').click()}}if(e.key==='Escape'&&dialogue)closeDialogue()});window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));window.addEventListener('blur',()=>{keys.clear();resetStick();save()});document.addEventListener('visibilitychange',()=>{if(document.hidden){keys.clear();resetStick();save()}});
function interactions(){if(dialogue||traveling||research.isOpen())return;nearby=[...npcList].sort((a,b)=>dist(state,a)-dist(state,b)).find(n=>dist(state,n)<65)||null;$('interact').disabled=!nearby;$('interact').querySelector('span').textContent=nearby?'주민 만나기':'…';$('interact').querySelector('small').textContent=nearby?nearby.name:'주민에게 가까이 가요';}
$('interact').onclick=()=>{if(!nearby||dialogue||traveling||research.isOpen())return;talk(nearby)};
async function travel(era){if(!state.intro||traveling||era===state.era)return;if(dialogue)closeDialogue();keys.clear();route=[];arrival=null;clearRoute();resetStick();traveling=true;$('destination').hidden=true;$('time-overlay').hidden=false;$('controls').hidden=true;tone('time');await new Promise(r=>setTimeout(r,650));state.era=era;save();renderWorld();updateQuest();await new Promise(r=>setTimeout(r,650));$('time-overlay').hidden=true;$('controls').hidden=false;traveling=false;renderWorld();toast(era==='past'?'수십 년 전의 들빛마을에 도착했어요.':'오늘의 들빛마을에 도착했어요.');}
$('era-past').onclick=()=>travel('past');$('era-now').onclick=()=>travel('now');
$('track-button').onclick=()=>{const g=goal();if(g.type==='era'){toast('위의 과거·현재 버튼을 눌러 다른 시대로 이동해요.');return;}go(g,()=>talk(npcList.find(n=>n.id===g.id)));};
$('quest-fold').onclick=()=>{const folded=$('quest-card').classList.toggle('folded');$('quest-fold').textContent=folded?'+':'−';$('quest-fold').setAttribute('aria-label',folded?'미션 펼치기':'미션 접기');};
$('zoom-button').onclick=()=>viewMode(!overview);$('view-overview').onclick=()=>viewMode(true);$('view-walk').onclick=()=>viewMode(false);$('stop-walking').onclick=stopWalking;
$('minimap').onclick=e=>{const r=$('minimap').getBoundingClientRect();go({x:(e.clientX-r.left)/r.width*WIDTH,y:(e.clientY-r.top)/r.height*HEIGHT})};

function resize(){if(overview)zoom=viewScale($('viewport').clientWidth,$('viewport').clientHeight,true);viewMode(overview);}
function updateCamera(immediate=false,dt=1/60){
 const w=$('viewport').clientWidth,h=$('viewport').clientHeight;
 const next=cameraFrame({...camera,zoom},state,w,h,{overview,dialogue:!!dialogue,dt,immediate,reducedMotion});camera={x:next.x,y:next.y};zoom=next.zoom;
 $('world').style.transform=`translate(${camera.x.toFixed(2)}px,${camera.y.toFixed(2)}px) scale(${zoom})`;
 $('player').style.left=state.x+'px';$('player').style.top=state.y+'px';$('player').style.zIndex=String(10+Math.floor(state.y/100));
 const g=goal(),gx=g.x*zoom+camera.x,gy=g.y*zoom+camera.y;
 const off=g.type!=='era'&&!dialogue&&!research.isOpen()&&(gx<20||gx>w-20||gy<15||gy>h-50);$('waypoint').hidden=!off;
 if(off){const angle=Math.atan2(gy-h/2,gx-w/2),card=$('quest-card');let left=Math.max(100,Math.min(w-120,gx)),top=$('viewport').offsetTop+Math.max(160,Math.min(h-150,gy));if(left<card.offsetLeft+card.offsetWidth+50&&top<card.offsetTop+card.offsetHeight+25)top=Math.min($('viewport').offsetTop+h-145,card.offsetTop+card.offsetHeight+28);$('waypoint').style.left=left+'px';$('waypoint').style.top=top+'px';$('waypoint').style.right='auto';$('waypoint').querySelector('span').style.transform=`rotate(${angle}rad)`;}
}
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
    moveOnRoad(state,dx,dy);
   }else if(route.length){
    advance(state,route,walkingSpeed*dt);
    if(!route.length){$('destination').hidden=true;clearRoute();save();const fn=arrival;arrival=null;fn?.();}
   }
   interactions();
  }else{walkingSpeed=0;}
  const dx=state.x-before.x,dy=state.y-before.y;
  gait=updateGait(gait,dx,dy,dt);
  $('player').classList.toggle('walking',gait.moving);
  $('player').classList.remove('facing-left');
  walker.render(gait);
  updateCamera(false,dt);
  $('game-screen').classList.toggle('on-the-move',gait.moving&&!dialogue&&!research.isOpen());
  if(time-lastMini>140){
   updateMinimap();lastMini=time;
   if(route.length)drawRoute();
   const nearest=[...npcList].sort((a,b)=>dist(state,a)-dist(state,b))[0];
   $('location').textContent=nearest&&dist(state,nearest)<230?nearest.role.replace(' 이야기','')+' 주변':'들빛마을 산책길';
  }
 }
 requestAnimationFrame(frame);
}
function showPanel(label,html){keys.clear();resetStick();$('panel-label').textContent=label;$('panel-content').innerHTML=html;if(!$('panel').open)$('panel').showModal()}
$('panel-close').onclick=()=>$('panel').close();$('panel').addEventListener('click',e=>{if(e.target===$('panel')){const r=$('panel').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('panel').close()}});
$('journal-button').onclick=()=>{if(traveling)return;pauseForEvidence();research.openNotebook();};
$('settings-button').onclick=()=>{if(traveling)return;showPanel('탐험 안내',`<h2>주민에게 시간의 단서를 받아요</h2><p><b>① 주민 만나기</b> · 주민을 누르면 길을 따라 가까이 걸어가요. 옆에서 ‘주민 만나기’를 눌러도 돼요. 실제 자료가 바로 열립니다.</p><p><b>② 과거 단서 수집</b> · 사진·영상에서 직접 본 모습을 한 줄로 쓰고 단서를 수집해요. 사진에는 찾은 곳을 표시할 수 있어요.</p><p><b>③ 현재 단서 수집</b> · 시간을 바꾸고 같은 주민을 다시 만나 다른 시기의 자료를 받아요.</p><p><b>④ 두 자료 비교</b> · 두 단서를 나란히 살펴보고 달라진 모습과 그 근거를 적어 비교 카드를 완성해요.</p><p><b>보조 자료</b> · 초록 이모는 현재 농업 시설의 사진·영상을 보여 줘요. 서로 다른 농장 자료이므로 같은 장소의 과거·현재라고 비교하지 않아요.</p><p><b>조작</b> · 길이나 주민을 누르면 도로를 따라 걸어가요. 조이스틱·방향키·WASD로도 움직일 수 있어요. 건물과 논밭으로는 들어갈 수 없어요. ‘마을 전체’로 길을 살펴보고 ‘가까이 걷기’로 풍경을 볼 수 있어요. E·스페이스로 주민을 만날 수 있어요. 수첩에서는 수집한 단서만 다시 볼 수 있어요.</p><div class="settings-row"><span>효과음</span><button id="sound-toggle" class="button secondary">${sound?'켜짐':'꺼짐'}</button></div><p class="small">마을 그림은 가상 배경이에요. 실제 자료의 지역·연도를 확인하며 관찰해요. 기록은 같은 기기에 저장됩니다. 버전 4.2 · 화면 가득 마을 탐험</p>`);$('sound-toggle').onclick=()=>{sound=!sound;$('sound-toggle').textContent=sound?'켜짐':'꺼짐';tone();};};

function download(){const c=document.createElement('canvas');c.width=1400;c.height=1000;const x=c.getContext('2d');x.fillStyle='#f8f4e5';x.fillRect(0,0,1400,1000);x.strokeStyle='#91b296';x.lineWidth=8;x.strokeRect(35,35,1330,930);x.textAlign='center';x.fillStyle='#849b76';x.font='bold 18px sans-serif';x.fillText('TIME TRAVEL DETECTIVES · CHAPTER 01',700,115);x.fillStyle='#305d4c';x.font='bold 56px sans-serif';x.fillText('들빛마을 시간 탐정 인증서',700,205);x.font='36px sans-serif';x.fillText(state.name+' 탐정',700,295);x.font='25px sans-serif';['손으로 모내기하는 사진과 기계 모내기 영상','대전 갑천 주변의 1970년·2021년 항공사진','과거와 현재의 실제 자료에서 네 단서를 모으고','두 가지 비교 카드에 관찰한 모습과 근거를 남겼습니다.'].forEach((t,i)=>x.fillText(t,700,390+i*62));x.fillStyle='#e8e8ce';x.fillRect(100,695,1200,130);x.fillStyle='#4b7158';x.font='23px sans-serif';x.fillText('환경을 이용하며 살아가는 모습은 다양하고,',700,747);x.fillText('지역마다 변화 모습도 다를 수 있습니다.',700,790);x.fillStyle='#8b987d';x.font='17px sans-serif';x.fillText('가상 마을 탐험 · 실제 자료 네 단서 · 두 비교 카드 완료',700,905);const a=document.createElement('a');a.download='들빛마을_시간탐정_인증서.png';a.href=c.toDataURL('image/png');document.body.append(a);a.click();a.remove();toast('인증서 이미지를 저장했어요.')}
function confetti(){const root=$('confetti');root.replaceChildren();for(let i=0;i<35;i++){const p=document.createElement('i');p.style.left=Math.random()*100+'%';p.style.background=['#f6cd6e','#98bf9a','#e99e88','#98c7cc'][i%4];p.style.animationDelay=Math.random()*.5+'s';p.style.rotate=Math.random()*360+'deg';root.append(p)}setTimeout(()=>root.replaceChildren(),3600)}
const ambient=$('ambient');ambient.innerHTML='<div class="portal"></div>'+Array.from({length:14},(_,i)=>`<span class="petal" style="left:${80+i*100}px;top:${80+i%5*130}px;animation-delay:${-i*.8}s"></span>`).join('')+Array.from({length:7},(_,i)=>`<span class="ripple" style="left:${1400-i%2*40}px;top:${110+i*120}px;animation-delay:${-i*.7}s"></span>`).join('');
window.addEventListener('resize',()=>{if(running){resize();updateCamera(true)}});window.addEventListener('pagehide',save);Object.values(images).forEach(im=>im.addEventListener('load',()=>{if(running)updateMinimap()}));updateContinue();requestAnimationFrame(frame);
