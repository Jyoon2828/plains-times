import {QUESTS,AVATARS} from './data.js';
export const SAVE_KEY='plains-detective-rpg-v2';
export function fresh(avatar=0,name=''){return {version:2,avatar,name:name.trim().slice(0,10)||AVATARS[avatar].name,era:'past',x:531,y:619,intro:false,progress:Object.fromEntries(QUESTS.map(q=>[q.id,{met:[],seen:[]}])),completed:[],ending:false,helpSeen:false}}
export function restore(raw){try{const s=JSON.parse(raw);if(s.version!==2||!Number.isInteger(s.avatar)||s.avatar<0||s.avatar>3||typeof s.name!=='string'||!['past','now'].includes(s.era)||!Array.isArray(s.completed))return null;const n=fresh(s.avatar,s.name);n.era=s.era;n.x=Number.isFinite(s.x)?s.x:n.x;n.y=Number.isFinite(s.y)?s.y:n.y;n.intro=!!s.intro;n.ending=!!s.ending;n.completed=QUESTS.filter(q=>s.completed.includes(q.id)).map(q=>q.id);for(const q of QUESTS){const p=s.progress?.[q.id];n.progress[q.id]={met:['past','now'].filter(e=>p?.met?.includes(e)),seen:['past','now'].filter(e=>p?.seen?.includes(e))}}return n}catch{return null}}
export function currentQuest(s){return QUESTS.find(q=>!s.completed.includes(q.id))||null}
export function mark(s,id,field,era){if(!s.progress[id][field].includes(era))s.progress[id][field].push(era)}
export function ready(s,q){return s.progress[q.id].seen.includes('past')&&s.progress[q.id].seen.includes('now')}
export function complete(s,q){if(!ready(s,q)||s.completed.includes(q.id))return false;s.completed.push(q.id);return true}
