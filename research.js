import {LABS} from './research-data.js';
import {RESEARCH_KEY,escapeHTML,restoreResearch,createPin,pointOnImage,pinVisibleInSwipe,hasDraft,finishRecord,buildResearchHTML} from './research-model.js';

export function createResearch({mount=document.body,getName=()=>'',onSaved=()=>{},onClose=()=>{}}={}){
 const esc=escapeHTML;let raw=null;try{raw=localStorage.getItem(RESEARCH_KEY);}catch{}
 let store=restoreResearch(raw,LABS),active=null,mode='split',zoom=1,swipe=50,selected=null,syncing=false,resizeObserver=null,lastFocus=null;
 const dialog=document.createElement('dialog');dialog.className='research-dialog';dialog.setAttribute('aria-label','실제 자료 현장 조사');mount.append(dialog);
 const $=selector=>dialog.querySelector(selector),$$=selector=>[...dialog.querySelectorAll(selector)];
 function persist(){try{localStorage.setItem(RESEARCH_KEY,JSON.stringify(store));return true;}catch{status('저장 공간이 부족해요. 수첩을 내려받아 기록을 보관해요.');return false;}}
 function status(text){const node=$('.research-status');if(node)node.textContent=text;}
 function pause(){ $$('video').forEach(video=>video.pause()); }
 function stopViews(){const download=$('.research-download-link');if(download)URL.revokeObjectURL(download.href);pause();resizeObserver?.disconnect();resizeObserver=null;}
 function header(label){return `<header class="research-header"><div class="research-seal" aria-hidden="true">🔎</div><div><span class="research-eyebrow">들빛마을 탐정단 · 실제 자료 조사</span><h2>${esc(label)}</h2></div><button class="research-notebook-button" data-action="notebook">▤ 조사 수첩</button><button class="research-close" data-action="close" aria-label="현장 조사 닫고 마을로 돌아가기">✕</button></header>`;}
 function tabs(){return `<nav class="research-tabs" aria-label="조사 장소">${Object.values(LABS).map(lab=>`<button data-lab="${esc(lab.id)}" class="${active===lab.id?'active':''}" aria-pressed="${active===lab.id}"><span>${lab.id==='rice'?'🌾':lab.id==='maps'?'🗺️':'🍅'}</span> ${esc(lab.title)}${store.labs[lab.id].completed?'<b aria-label="조사 완료">✓</b>':''}</button>`).join('')}</nav>`;}
 function bindCommon(){
  $('[data-action="close"]').onclick=close;
  $('[data-action="notebook"]').onclick=openNotebook;
  $$('[data-lab]').forEach(button=>button.onclick=()=>open(button.dataset.lab));
 }
 function prepare(){if(!dialog.open)dialog.showModal();}
 function open(id='maps'){
  if(!dialog.open)lastFocus=document.activeElement;
  if(!LABS[id])id=Object.keys(LABS)[0];stopViews();active=id;selected=null;zoom=1;mode=id==='maps'?'swipe':'split';swipe=50;
  renderLab();prepare();
 }
 function sourceFoot(source){return `<div class="research-source-meta"><div><b>${esc(source.place||'지역 정보 확인 중')}</b><span>${esc(source.date)}</span></div><details class="research-source-details"><summary>자료 설명 · 출처 보기</summary><p>${esc(source.caption||'')}</p><a href="${esc(source.sourceUrl)}" target="_blank" rel="noopener noreferrer">${esc(source.sourceName||'자료 원문')} ↗</a><small>${esc(source.credit||'')}</small></details></div>`;}
 function sourceView(source,index,overlay=false){
  const title=`<div class="research-source-title"><span class="source-dot dot-${index}"></span><b>${esc(overlay?source.date+' ↔ '+LABS[active].sources[1].date:source.title)}</b></div>`;
  if(source.kind==='video')return `<section class="research-source is-video" data-source="${esc(source.id)}">${title}<div class="research-video-wrap"><video controls playsinline preload="metadata" ${source.poster?`poster="${esc(source.poster)}"`:''} aria-label="${esc(source.title)}"><source src="${esc(source.src||'')}" type="video/mp4"></video><div class="research-media-error" hidden>영상을 불러오지 못했어요.<br><a href="${esc(source.sourceUrl)}" target="_blank" rel="noopener noreferrer">원문에서 영상 보기 ↗</a></div></div><p class="research-video-tip">▷ 재생하고, 멈춰서 자세히 살펴봐요.</p>${sourceFoot(source)}</section>`;
  return `<section class="research-source" data-source="${esc(source.id)}">${title}<div class="research-source-window" tabindex="0" aria-label="${esc(source.title)}. 사진에서 단서를 찾은 곳을 누르면 표시할 수 있어요."><div class="research-scroll-space"><div class="research-photo-plane" data-image-source="${esc(source.id)}"><img src="${esc(source.src||'')}" alt="${esc(source.title)}" draggable="false">${overlay?`<img class="research-overlay-image" src="${esc(LABS[active].sources[1].src||'')}" alt="${esc(LABS[active].sources[1].title)}" draggable="false"><span class="research-swipe-line" aria-hidden="true"></span>`:''}<div class="research-pins"></div></div></div><div class="research-media-error" hidden>사진을 불러오지 못했어요.<br><a href="${esc(source.sourceUrl)}" target="_blank" rel="noopener noreferrer">자료 원문 열기 ↗</a></div></div>${sourceFoot(source)}</section>`;
 }
 function renderLab(){
  const lab=LABS[active],record=store.labs[active],imagesOnly=lab.sources.length===2&&lab.sources.every(source=>source.kind==='image');
  dialog.innerHTML=header(lab.title)+tabs()+`<div class="research-body"><section class="research-viewer"><div class="research-question"><span>이번 조사</span><h3>${esc(lab.question)}</h3></div><div class="research-toolbar"><p>${lab.sources.some(source=>source.kind==='image')?'사진·지도를 누르면 단서를 표시할 수 있어요.':'영상을 멈추며 보고, 찾은 단서를 기록해요.'}</p><div class="research-view-buttons" ${lab.sources.some(source=>source.kind==='image')?'':'hidden'}>${imagesOnly?`<button data-action="split" class="${mode==='split'?'active':''}">나란히</button><button data-action="swipe" class="${mode==='swipe'?'active':''}">겹쳐 보기</button>`:''}<button data-action="zoom-out" aria-label="사진 축소">−</button><span class="research-zoom-label">${Math.round(zoom*100)}%</span><button data-action="zoom-in" aria-label="사진 확대">＋</button><button data-action="reset" aria-label="사진 크기와 위치 처음으로">↺</button></div></div><div class="research-sources ${mode==='swipe'?'swipe-mode':''} ${lab.sources.length===1?'single-source':''}">${(mode==='swipe'?[lab.sources[0]]:lab.sources).map((source,index)=>sourceView(source,index,mode==='swipe')).join('')}</div>${mode==='swipe'?`<div class="research-swipe-control"><span>${esc(lab.sources[0].date)}</span><label>비교 막대<input type="range" min="0" max="100" value="${swipe}" aria-label="두 시기 사진 비교 막대"></label><span>${esc(lab.sources[1].date)}</span></div><div class="research-overlay-credit">${sourceFoot(lab.sources[1])}</div>`:''}<p class="research-material-notice">${esc(lab.notice||'')}</p></section><aside class="research-notes"><div class="research-note-intro"><span>✎ 나의 조사 기록</span><p>${lab.guide.map(text=>esc(text)).join('<br>')}</p></div><section class="research-pin-editor"><h3>📍 내가 찾은 단서 <span class="research-pin-count"></span></h3><div class="research-pin-list"></div><div class="research-selected-pin" hidden><label for="research-pin-label">선택한 곳에서 무엇을 찾았나요?</label><input id="research-pin-label" maxlength="100" placeholder="예: 길이 이어진 곳"><button data-action="remove-pin" class="research-delete-pin">이 표시 지우기</button></div></section><label class="research-writing-label" for="research-observation"><b>① 자료에서 확인한 것</b><small>사진·지도·영상에서 직접 본 모습을 써요.</small></label><textarea id="research-observation" maxlength="1600" placeholder="어디에서 무엇을 보았나요?">${esc(record.observation)}</textarea><label class="research-writing-label" for="research-inference"><b>② 그것을 보고 생각한 것</b><small>그렇게 생각한 까닭도 함께 써요.</small></label><textarea id="research-inference" maxlength="1600" placeholder="이를 보고 어떤 변화가 있었다고 생각하나요?">${esc(record.inference)}</textarea><div class="research-save-row"><span class="research-status" role="status">${record.completed?'✓ 저장한 조사 기록이에요.':'쓰는 내용은 이 기기에 자동 저장돼요.'}</span><button data-action="save" class="research-save">조사 기록 저장 ✓</button></div></aside></div>`;
  bindCommon();bindViews();drawPins();
  for(const [selector,key] of [['#research-observation','observation'],['#research-inference','inference']]){
   $(selector).oninput=event=>{record[key]=event.target.value;record.completed=false;record.updatedAt=new Date().toISOString();if(persist())status('작성 중 · 자동 저장했어요.');};
  }
  $('[data-action="save"]').onclick=()=>{
   if(!finishRecord(record)){const missing=!record.observation.trim()?'#research-observation':'#research-inference';status(missing==='#research-observation'?'①에서 직접 확인한 모습을 한 가지 이상 써 주세요.':'②에서 자료를 보고 생각한 것과 그 까닭을 써 주세요.');$(missing).focus();return;}
   if(!persist()){record.completed=false;return;}status('✓ 조사 기록을 저장했어요! 수첩에서 다시 볼 수 있어요.');const tab=$$('[data-lab]').find(button=>button.dataset.lab===active);if(tab&&!tab.querySelector('b'))tab.insertAdjacentHTML('beforeend','<b aria-label="조사 완료">✓</b>');onSaved(active);
  };
 }
 function bindViews(){
  $('[data-action="zoom-in"]').onclick=()=>changeZoom(Math.min(3,zoom+.5));
  $('[data-action="zoom-out"]').onclick=()=>changeZoom(Math.max(1,zoom-.5));
  $('[data-action="reset"]').onclick=()=>{zoom=1;layoutImages();$$('.research-source-window').forEach(window=>{window.scrollLeft=0;window.scrollTop=0;});};
  for(const next of ['split','swipe'])if($(`[data-action="${next}"]`))$(`[data-action="${next}"]`).onclick=()=>{stopViews();mode=next;selected=null;renderLab();};
  const range=$('.research-swipe-control input');if(range)range.oninput=()=>{swipe=Number(range.value);applySwipe();drawPins();};
  $$('video').forEach(video=>{const showError=()=>{video.hidden=true;video.parentElement.querySelector('.research-media-error').hidden=false;};video.addEventListener('error',showError);video.querySelector('source')?.addEventListener('error',showError);});
  $$('.research-photo-plane').forEach(plane=>{
   const img=plane.querySelector('img');img.addEventListener('load',()=>{plane.parentElement.parentElement.querySelector('.research-media-error').hidden=true;layoutImages();});
   img.addEventListener('error',()=>{plane.hidden=true;plane.parentElement.parentElement.querySelector('.research-media-error').hidden=false;});
   plane.addEventListener('click',event=>{
    if(event.target.closest('[data-pin-index]'))return;
    const point=pointOnImage(plane.getBoundingClientRect(),event.clientX,event.clientY);if(!point)return;
    const sourceId=mode==='swipe'&&point.x>=swipe/100?LABS[active].sources[1].id:plane.dataset.imageSource;
    const pins=store.labs[active].pins[sourceId];if(pins.length>=12){status('한 자료에 단서는 12개까지 표시할 수 있어요.');return;}
    pins.push(createPin(point.x,point.y));selected={sourceId,index:pins.length-1};store.labs[active].completed=false;persist();drawPins();$('#research-pin-label').focus();
   });
  });
  $$('.research-source-window').forEach(sourceWindow=>sourceWindow.addEventListener('scroll',()=>{
   if(syncing||mode!=='split')return;syncing=true;
   const x=sourceWindow.scrollLeft/Math.max(1,sourceWindow.scrollWidth-sourceWindow.clientWidth),y=sourceWindow.scrollTop/Math.max(1,sourceWindow.scrollHeight-sourceWindow.clientHeight);
   $$('.research-source-window').filter(other=>other!==sourceWindow).forEach(other=>{other.scrollLeft=x*(other.scrollWidth-other.clientWidth);other.scrollTop=y*(other.scrollHeight-other.clientHeight);});
   requestAnimationFrame(()=>syncing=false);
  },{passive:true}));
  resizeObserver=new ResizeObserver(()=>layoutImages());$$('.research-source-window').forEach(node=>resizeObserver.observe(node));
  requestAnimationFrame(layoutImages);
 }
 function changeZoom(next){zoom=next;layoutImages();}
 function layoutImages(){
  $$('.research-photo-plane').forEach(plane=>{
   const image=plane.querySelector('img'),sourceWindow=plane.parentElement.parentElement;if(!image.naturalWidth||!sourceWindow.clientWidth)return;
   const baseWidth=sourceWindow.clientWidth,baseHeight=sourceWindow.clientHeight;
   const fit=Math.min(baseWidth/image.naturalWidth,baseHeight/image.naturalHeight),width=image.naturalWidth*fit*zoom,height=image.naturalHeight*fit*zoom;
   const spaceWidth=Math.max(baseWidth,width),spaceHeight=Math.max(baseHeight,height);
   plane.parentElement.style.width=spaceWidth+'px';plane.parentElement.style.height=spaceHeight+'px';
   Object.assign(plane.style,{width:width+'px',height:height+'px',left:(spaceWidth-width)/2+'px',top:(spaceHeight-height)/2+'px'});
  });
  const label=$('.research-zoom-label');if(label)label.textContent=Math.round(zoom*100)+'%';applySwipe();
 }
 function applySwipe(){const image=$('.research-overlay-image'),line=$('.research-swipe-line');if(image)image.style.clipPath=`inset(0 0 0 ${swipe}%)`;if(line)line.style.left=swipe+'%';}
 function drawPins(){
  if(!active)return;const lab=LABS[active],record=store.labs[active];
  $$('.research-photo-plane').forEach(plane=>{
   const sources=mode==='swipe'?lab.sources.filter(source=>source.kind==='image'):lab.sources.filter(source=>source.id===plane.dataset.imageSource);
   plane.querySelector('.research-pins').innerHTML=sources.map(source=>record.pins[source.id].map((pin,index)=>mode==='swipe'&&!pinVisibleInSwipe(pin,lab.sources.indexOf(source),swipe)?'':`<button class="research-pin ${selected?.sourceId===source.id&&selected.index===index?'selected':''} source-${lab.sources.indexOf(source)}" data-pin-source="${esc(source.id)}" data-pin-index="${index}" style="left:${pin.x*100}%;top:${pin.y*100}%" aria-label="${esc(source.title)}의 단서 ${index+1}: ${esc(pin.label||'설명 쓰기')}">${index+1}</button>`).join('')).join('');
  });
  let total=0;$('.research-pin-list').innerHTML=lab.sources.map((source,sourceIndex)=>{
   const pins=record.pins[source.id];total+=pins.length;
   return pins.map((pin,index)=>`<button class="research-pin-chip ${selected?.sourceId===source.id&&selected.index===index?'selected':''}" data-pin-source="${esc(source.id)}" data-pin-index="${index}"><span class="source-dot dot-${sourceIndex}"></span><b>${index+1}</b> ${esc(pin.label||'어떤 단서인가요?')}</button>`).join('');
  }).join('')||'<p class="research-pin-empty">사진·지도에서 찾은 곳을 눌러 표시해요.<br>영상에서 본 것은 아래에 기록해요.</p>';
  $('.research-pin-count').textContent=total?'('+total+')':'';
  $$('[data-pin-index]').forEach(button=>button.onclick=event=>{event.stopPropagation();selected={sourceId:button.dataset.pinSource,index:Number(button.dataset.pinIndex)};drawPins();$('#research-pin-label').focus();});
  const editor=$('.research-selected-pin');editor.hidden=!selected;
  if(selected){
   const pin=record.pins[selected.sourceId][selected.index];if(!pin){selected=null;editor.hidden=true;return;}
   $('#research-pin-label').value=pin.label;
   $('#research-pin-label').oninput=event=>{pin.label=event.target.value;record.completed=false;const saved=persist();const value=pin.label||'어떤 단서인가요?';$$('.research-pin-chip').filter(button=>button.dataset.pinSource===selected.sourceId&&Number(button.dataset.pinIndex)===selected.index).forEach(button=>{button.lastChild.textContent=' '+value;});if(saved)status('단서 설명을 자동 저장했어요.');};
   $('[data-action="remove-pin"]').onclick=()=>{record.pins[selected.sourceId].splice(selected.index,1);record.completed=false;selected=null;persist();drawPins();};
  }
 }
 function openNotebook(){
  if(!dialog.open)lastFocus=document.activeElement;
  stopViews();active=null;selected=null;
  dialog.innerHTML=header('나의 현장 조사 수첩')+`<div class="research-notebook"><div class="research-notebook-intro"><div><span class="research-eyebrow">실제 자료에서 찾은 근거</span><h3>${esc((getName()||'들빛마을').replace(/\s*탐정$/u,''))} 탐정의 조사 기록</h3><p>조사 완료 ${count()} / ${Object.keys(LABS).length} · 같은 기기에서 이어 쓸 수 있어요.</p></div><button class="research-save" data-action="download">수첩 내려받기 ↓</button></div><div class="research-lab-cards">${Object.values(LABS).map(lab=>{
   const record=store.labs[lab.id],image=lab.sources.find(source=>source.kind==='image')?.src||lab.sources[0]?.poster;
   return `<article class="research-lab-card">${image?`<img src="${esc(image)}" alt="${esc(lab.title)} 자료 미리 보기">`:`<div class="research-card-icon">${lab.id==='rice'?'🌾':lab.id==='maps'?'🗺️':'🍅'}</div>`}<div><span class="research-card-state ${record.completed?'complete':''}">${record.completed?'✓ 조사 완료':hasDraft(record)?'✎ 작성 중':'새 조사'}</span><h3>${esc(lab.title)}</h3><p>${esc(lab.question)}</p>${hasDraft(record)?`<dl><dt>직접 확인한 것</dt><dd>${esc(record.observation||'아직 기록하지 않았어요.')}</dd><dt>내가 생각한 것</dt><dd>${esc(record.inference||'아직 기록하지 않았어요.')}</dd></dl>`:''}<button data-lab="${esc(lab.id)}">${hasDraft(record)?'조사 이어 보기':'자료 조사하기'} →</button></div></article>`;
  }).join('')}</div><p class="research-status" role="status">쓰는 내용은 이 기기에 자동 저장돼요. 수첩을 내려받으면 다른 기기에서도 읽을 수 있어요.</p><p class="research-material-notice">들빛마을은 학습용 가상 마을이에요. 실제 자료의 지역과 연도를 살펴보며 조사해요.</p></div>`;
  bindCommon();$('[data-action="download"]').onclick=exportNotebook;prepare();
 }
 async function exportNotebook(){
  const button=$('[data-action="download"]');if(!button)return;button.disabled=true;button.textContent='사진과 기록을 담는 중…';
  try{
   const media={};
   await Promise.all(Object.values(LABS).filter(lab=>hasDraft(store.labs[lab.id])).flatMap(lab=>lab.sources.map(async source=>{
    const src=source.kind==='image'?source.src:source.poster;if(!src)return;
    try{const response=await fetch(src);if(!response.ok)return;const blob=await response.blob();if(!blob.type.startsWith('image/'))return;
     media[lab.id+'/'+source.id]=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(blob);});
    }catch{}
   })));
   const html=buildResearchHTML(LABS,store,getName(),media),url=URL.createObjectURL(new Blob([html],{type:'text/html;charset=utf-8'}));
   const previous=$('.research-download-link');if(previous){URL.revokeObjectURL(previous.href);previous.remove();}
   const link=document.createElement('a');link.href=url;link.download='들빛마을_실제자료_조사수첩.html';link.className='research-download-link';link.textContent='준비된 수첩 파일 받기 ↓';link.setAttribute('aria-label','사진과 기록을 담은 수첩 HTML 파일 받기');button.insertAdjacentElement('afterend',link);link.click();status('수첩 파일을 만들었어요. 내려받기가 시작되지 않으면 ‘준비된 수첩 파일 받기’를 눌러요.');
  }catch{status('수첩을 내려받지 못했어요. 다시 눌러 주세요.');}
  finally{if(button.isConnected){button.disabled=false;button.textContent='수첩 내려받기 ↓';}}
 }
 function close(){if(dialog.open)dialog.close();}
 dialog.addEventListener('close',()=>{stopViews();persist();onClose();lastFocus?.focus?.({preventScroll:true});});
 dialog.addEventListener('cancel',()=>{pause();});
 function count(){return Object.values(store.labs).filter(record=>record.completed).length;}
 function reset(){close();store=restoreResearch(null,LABS);persist();}
 return {open,openNotebook,isOpen:()=>dialog.open,close,count,reset,records:()=>JSON.parse(JSON.stringify(store.labs))};
}
