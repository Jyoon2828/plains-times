#!/usr/bin/env node
// Build version 1: dependency-free bundling for the buildless classroom app.
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';

const projectRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const entry=path.join(projectRoot,'src/game.js');
const output=path.join(projectRoot,'app.js');
const modules=new Map();
const ordered=[];
const identifier=/^[A-Za-z_$][\w$]*$/;

function namesIn(list,context){
 const items=list.split(',').map(part=>part.trim()).filter(Boolean);
 if(!items.length)throw new Error(`Empty named list in ${context}`);
 return items.map(item=>{
  const parts=item.split(/\s+as\s+/);
  if(parts.length>2||!parts.every(name=>identifier.test(name)))throw new Error(`Unsupported binding "${item}" in ${context}`);
  return {name:parts[0],local:parts[1]||parts[0]};
 });
}

async function visit(filename,trail=[]){
 if(trail.includes(filename))throw new Error('Circular imports are not supported: '+[...trail,filename].map(file=>path.relative(projectRoot,file)).join(' → '));
 if(modules.has(filename))return modules.get(filename);
 const relative=path.relative(projectRoot,filename).replaceAll(path.sep,'/');
 if(relative.startsWith('../')||path.isAbsolute(relative))throw new Error('Import leaves the project: '+relative);
 const source=await readFile(filename,'utf8');
 const module={id:modules.size,filename,relative,source,imports:[],requested:new Set(),aliases:new Map(),body:''};
 modules.set(filename,module);

 // This app deliberately uses only static, named relative ES imports.
 const importPattern=/^[\t ]*import\s*\{([^}]+)\}\s*from\s*(['"])(\.[^'"\r\n]+)\2\s*;?[\t ]*/gm;
 let body=source.replace(importPattern,(statement,list,quote,specifier)=>{
  if(!specifier.endsWith('.js')&&!specifier.endsWith('.mjs'))throw new Error(`Unsupported import path in ${relative}: ${specifier}`);
  const record={specifier,bindings:namesIn(list,relative),dependency:null};
  module.imports.push(record);
  return '';
 });
 if(/^[\t ]*import\b/m.test(body)||/\bimport\s*(?:\(|\.)/.test(body))throw new Error('Unsupported import syntax in '+relative);

 // Named export lists may alias a local name; re-exports are intentionally unsupported.
 body=body.replace(/^[\t ]*export\s*\{([^}]+)\}\s*([^;\r\n]*)[;]?[\t ]*/gm,(statement,list,tail)=>{
  if(tail.trim())throw new Error('Re-exports are not supported in '+relative);
  for(const binding of namesIn(list,relative))module.aliases.set(binding.local,binding.name);
  return '';
 });
 body=body.replace(/(^[\t ]*)export\s+(?=(?:async\s+)?function\b|(?:const|let|var|class)\b)/gm,'$1');
 if(/^[\t ]*export\b/m.test(body))throw new Error('Unsupported export syntax in '+relative);
 module.body=body;

 for(const record of module.imports){
  const dependency=await visit(path.resolve(path.dirname(filename),record.specifier),[...trail,filename]);
  record.dependency=dependency;
  for(const binding of record.bindings)dependency.requested.add(binding.name);
 }
 ordered.push(module);
 return module;
}

await visit(entry);
const metadata=JSON.parse(await readFile(path.join(projectRoot,'package.json'),'utf8'));
const version=String(metadata.version||'local').replace(/[^A-Za-z0-9_.-]/g,'');
const hash=createHash('sha256');
for(const module of ordered)hash.update(module.relative+'\0'+module.source+'\0');
const digest=hash.digest('hex').slice(0,12);
const pieces=ordered.map(module=>{
 const imports=module.imports.map(record=>{
  const bindings=record.bindings.map(binding=>binding.name===binding.local?binding.name:binding.name+': '+binding.local).join(', ');
  return `const {${bindings}}=__mod${record.dependency.id};`;
 }).join('\n');
 // Collect exports from actual import requests, which also handles declarations
 // such as `export const WIDTH=1536,HEIGHT=1024` without parsing initializers.
 const exports=[...module.requested].map(name=>{
  const local=module.aliases.get(name)||name;
  return name===local?name:name+': '+local;
 }).join(', ');
 return `// ${module.relative}\nconst __mod${module.id}=(()=>{\n${imports}\n${module.body}\nreturn Object.freeze({${exports}});\n})();`;
});

const bundle=`/* 들빛마을 bundle v${version} · ${digest} · node scripts/build.mjs */
;(()=>{
 'use strict';
 try{
${pieces.join('\n\n')}
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
`;

try{new Function(bundle);}catch(error){throw new Error('Generated app.js has invalid syntax: '+error.message);}
await mkdir(path.dirname(output),{recursive:true});
await writeFile(output,bundle,'utf8');
console.log(`Built app.js v${version} (${ordered.length} modules, ${Buffer.byteLength(bundle)} bytes, ${digest}).`);
