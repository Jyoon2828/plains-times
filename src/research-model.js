export const RESEARCH_KEY='deulbit-evidence-v2';
const clean=(value,max=1600)=>typeof value==='string'?value.slice(0,max):'';
export const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const eraNames=['past','now'];
export function createPin(x,y,label=''){
 if(!Number.isFinite(x)||!Number.isFinite(y))return null;
 return {x:Math.max(0,Math.min(1,x)),y:Math.max(0,Math.min(1,y)),label:clean(label,100)};
}
export function blankRecord(){return {past:{collected:false,observation:'',pins:[]},now:{collected:false,observation:'',pins:[]},comparison:'',unchanged:'',referenceNote:'',completed:false,updatedAt:null};}
export function freshResearch(labs){return {version:2,labs:Object.fromEntries(Object.values(labs).map(lab=>[lab.id,blankRecord()]))};}
export function restoreResearch(raw,labs){
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
export function readyToCompare(record){return eraNames.every(era=>record?.[era]?.collected&&record[era].observation.trim());}
export function collectEvidence(record,era,{observation,pins=[],mediaReady=false}={},now=new Date().toISOString()){
 if(!eraNames.includes(era)||!mediaReady||!clean(observation).trim())return false;
 const text=clean(observation).trim();
 if(record[era].observation!==text)record.completed=false;
 record[era]={collected:true,observation:text,pins:Array.isArray(pins)?pins.slice(0,12).map(pin=>createPin(pin?.x,pin?.y,pin?.label)).filter(Boolean):[]};
 record.updatedAt=now;return true;
}
export function finishComparison(record,comparison,unchanged='',now=new Date().toISOString()){
 if(!readyToCompare(record)||!clean(comparison).trim())return false;
 record.comparison=clean(comparison).trim();record.unchanged=clean(unchanged).trim();record.completed=true;record.updatedAt=now;return true;
}
export function pointOnImage(rect,clientX,clientY){
 if(!rect||rect.width<=0||rect.height<=0)return null;
 const x=(clientX-rect.left)/rect.width,y=(clientY-rect.top)/rect.height;
 return x<0||x>1||y<0||y>1?null:createPin(x,y);
}
export function pinVisibleInSwipe(pin,sourceIndex,percent){const boundary=Math.max(0,Math.min(100,percent))/100;return sourceIndex===0?pin.x<boundary:pin.x>=boundary;}
export function hasEvidence(record){return !!record&&(record.past.collected||record.now.collected);}
function imageFor(media,key){const encoded=media[key];return typeof encoded==='string'&&/^data:image\/(png|jpeg|webp|gif);base64,[a-z0-9+/=\s]+$/i.test(encoded)?encoded:'';}
export function buildResearchHTML(labs,store,name='',media={}){
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
