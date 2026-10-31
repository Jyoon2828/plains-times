import {QUESTS,AVATARS} from './data.js';
export const SAVE_KEY='plains-detective-rpg-v2';
export function fresh(avatar=0,name=''){return {version:3,avatar,name:name.trim().slice(0,10)||AVATARS[avatar].name,era:'past',x:531,y:619,intro:false,progress:Object.fromEntries(QUESTS.map(q=>[q.id,{met:[],seen:[],compared:false}])),completed:[],ending:false,helpSeen:false}}
export function restore(raw){try{
 const s=JSON.parse(raw);if(![2,3].includes(s.version)||!Number.isInteger(s.avatar)||s.avatar<0||s.avatar>3||typeof s.name!=='string'||!['past','now'].includes(s.era)||!Array.isArray(s.completed))return null;
 const n=fresh(s.avatar,s.name);n.era=s.era;n.x=Number.isFinite(s.x)?s.x:n.x;n.y=Number.isFinite(s.y)?s.y:n.y;n.intro=!!s.intro;
 // Old fictional clue/quiz completion is not evidence from actual source materials.
 if(s.version===2)return n;
 for(const q of QUESTS){const p=s.progress?.[q.id];n.progress[q.id]={met:['past','now'].filter(e=>p?.met?.includes(e)),seen:['past','now'].filter(e=>p?.seen?.includes(e)),compared:!!p?.compared};}
 n.completed=QUESTS.filter(q=>s.completed.includes(q.id)&&ready(n,q)&&n.progress[q.id].compared).map(q=>q.id);n.ending=!!s.ending&&n.completed.length===QUESTS.length;return n;
}catch{return null}}
export function currentQuest(s){return QUESTS.find(q=>!s.completed.includes(q.id))||null}
export function mark(s,id,field,era){if(!s.progress[id]||!['met','seen'].includes(field)||!['past','now'].includes(era))return;if(!s.progress[id][field].includes(era))s.progress[id][field].push(era)}
export function ready(s,q){return !!s.progress[q.id]&&s.progress[q.id].seen.includes('past')&&s.progress[q.id].seen.includes('now')}
export function recordComparison(s,q){if(!ready(s,q))return false;s.progress[q.id].compared=true;return true;}
export function complete(s,q){if(!ready(s,q)||!s.progress[q.id].compared||s.completed.includes(q.id))return false;s.completed.push(q.id);return true}
