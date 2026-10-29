export const RESEARCH_KEY='deulbit-fieldwork-v1';
const clean=(value,max=1600)=>typeof value==='string'?value.slice(0,max):'';
export const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export function blankRecord(lab){return {observation:'',inference:'',pins:Object.fromEntries(lab.sources.map(source=>[source.id,[]])),completed:false,updatedAt:null};}
export function createPin(x,y,label=''){
 if(!Number.isFinite(x)||!Number.isFinite(y))return null;
 return {x:Math.max(0,Math.min(1,x)),y:Math.max(0,Math.min(1,y)),label:clean(label,100)};
}
export function freshResearch(labs){return {version:1,labs:Object.fromEntries(Object.values(labs).map(lab=>[lab.id,blankRecord(lab)]))};}
export function restoreResearch(raw,labs){
 const next=freshResearch(labs);let saved;
 try{saved=typeof raw==='string'?JSON.parse(raw):raw;}catch{return next;}
 if(saved?.version!==1||!saved.labs||typeof saved.labs!=='object')return next;
 for(const lab of Object.values(labs)){
  const old=saved.labs[lab.id];if(!old||typeof old!=='object')continue;
  const record=next.labs[lab.id];record.observation=clean(old.observation);record.inference=clean(old.inference);
  record.completed=!!old.completed&&!!record.observation.trim()&&!!record.inference.trim();
  record.updatedAt=typeof old.updatedAt==='string'&&!Number.isNaN(Date.parse(old.updatedAt))?old.updatedAt:null;
  for(const source of lab.sources){
   const pins=old.pins?.[source.id];if(!Array.isArray(pins))continue;
   record.pins[source.id]=pins.slice(0,12).map(pin=>createPin(pin?.x,pin?.y,pin?.label)).filter(Boolean);
  }
 }
 return next;
}
export function hasDraft(record){return !!record&&(!!record.observation.trim()||!!record.inference.trim()||Object.values(record.pins).some(pins=>pins.length));}
export function finishRecord(record,now=new Date().toISOString()){
 if(!record.observation.trim()||!record.inference.trim())return false;record.completed=true;record.updatedAt=now;return true;
}
export function pointOnImage(rect,clientX,clientY){
 if(!rect||rect.width<=0||rect.height<=0)return null;
 const x=(clientX-rect.left)/rect.width,y=(clientY-rect.top)/rect.height;
 return x<0||x>1||y<0||y>1?null:createPin(x,y);
}
export function pinVisibleInSwipe(pin,sourceIndex,percent){
 const boundary=Math.max(0,Math.min(100,percent))/100;
 return sourceIndex===0?pin.x<boundary:pin.x>=boundary;
}
function imageFor(source,media,key){
 const encoded=media[key];
 return typeof encoded==='string'&&/^data:image\/(png|jpeg|webp|gif);base64,[a-z0-9+/=\s]+$/i.test(encoded)?encoded:'';
}
export function buildResearchHTML(labs,store,name='',media={}){
 const esc=escapeHTML;
 const entries=Object.values(labs).filter(lab=>hasDraft(store.labs[lab.id]));
 const html=entries.map(lab=>{
  const record=store.labs[lab.id];
  const sources=lab.sources.map(source=>{
   const image=imageFor(source,media,lab.id+'/'+source.id);
   const pins=record.pins[source.id]||[];
   return `<figure>${image?`<div class="photo"><img src="${image}" alt="${esc(source.title)}">${source.kind==='image'?pins.map((pin,index)=>`<b class="pin" style="left:${pin.x*100}%;top:${pin.y*100}%">${index+1}</b>`).join(''):''}</div>`:''}<figcaption><strong>${esc(source.title)}</strong><br>${esc(source.place)} · ${esc(source.date)}<br>${esc(source.caption)}</figcaption>${pins.length?`<ol>${pins.map(pin=>`<li>${esc(pin.label||'표시한 단서')}</li>`).join('')}</ol>`:''}<p class="credit">${source.kind==='video'?'영상의 대표 사진입니다. 전체 영상은 원문에서 볼 수 있어요.<br>':''}${esc(source.credit||source.sourceName)}<br><a href="${esc(source.sourceUrl)}">${esc(source.sourceName||'자료 원문')} ↗</a></p></figure>`;
  }).join('');
  return `<article><p class="tag">${esc(lab.tag)} · ${record.completed?'조사 완료':'작성 중'}</p><h2>${esc(lab.title)}</h2><p class="question">${esc(lab.question)}</p><div class="photos">${sources}</div><div class="notes"><section><h3>자료에서 확인한 것</h3><p>${esc(record.observation||'아직 기록하지 않았어요.')}</p></section><section><h3>그것을 보고 생각한 것</h3><p>${esc(record.inference||'아직 기록하지 않았어요.')}</p></section></div><p class="notice">${esc(lab.notice||'')}</p></article>`;
 }).join('');
 return `<!doctype html><html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(name||'들빛마을 탐정')}의 현장 조사 수첩</title><style>*{box-sizing:border-box}body{margin:0;background:#edf2e6;color:#284a43;font-family:"Malgun Gothic",system-ui,sans-serif;line-height:1.7}main{max-width:1080px;margin:32px auto;padding:30px;background:#fffaf0;border-radius:24px}header{padding:10px 0 20px;border-bottom:3px solid #a7c5ac}h1{font-size:32px;margin:5px 0}article{padding:25px 0;border-bottom:1px solid #d2dfc8;break-inside:avoid}.tag,.credit,.notice{font-size:12px;color:#617a68}h2{margin:0;font-size:25px}.question{font-weight:bold}.photos,.notes{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}figure{margin:0;padding:12px;background:#fff;border:1px solid #d4dfcd;border-radius:14px}.photo{position:relative;line-height:0}.photo img{width:100%;height:auto}.pin{position:absolute;transform:translate(-50%,-50%);background:#f8cf6b;border:2px solid #fff;color:#304b41;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;font-size:13px;line-height:1}.notes{margin-top:18px}.notes section{padding:15px;background:#edf2e3;border-radius:12px}.notes h3{font-size:16px;margin:0}.notes p{white-space:pre-wrap;overflow-wrap:anywhere;font-size:16px}a{color:#267a65}footer{font-size:12px;color:#617a68;margin-top:25px}@media(max-width:650px){main{padding:18px;margin:12px}.photos,.notes{grid-template-columns:1fr}}@media print{body{background:white}main{margin:0;padding:0;max-width:none}.photos{grid-template-columns:1fr 1fr}a{overflow-wrap:anywhere}}</style></head><body><main><header><p class="tag">들빛마을 · 시간여행 탐정단</p><h1>${esc(name||'이름 없는 탐정')}의 현장 조사 수첩</h1><p>사진과 지도를 살펴보고 근거를 모았어요.</p></header>${html||'<p>작성한 조사 기록이 아직 없어요.</p>'}<footer>이야기 속 들빛마을은 가상 마을입니다. 실제 자료의 지역과 연도는 각 자료에 표시했습니다.</footer></main></body></html>`;
}
