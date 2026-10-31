import {LABS} from './research-data.js';
import {RESEARCH_KEY,escapeHTML,restoreResearch,createPin,pointOnImage,pinVisibleInSwipe,hasEvidence,readyToCompare,collectEvidence,finishComparison,buildResearchHTML} from './research-model.js';

export function createResearch({mount=document.body,getName=()=>'',onCollected=()=>{},onCompared=()=>{},onTravel=()=>{},onClose=()=>{}}={}){
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
