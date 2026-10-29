import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {QUESTS} from '../src/data.js';
import {PHOTOS} from '../src/photos.js';
import {WALK_ATLASES} from '../src/walk-atlases.js';
import {layoutFrame} from '../src/walker.js';
const root=new URL('../',import.meta.url);
test('all clue topics have local genuine photo files and complete attribution',()=>{
 for(const q of QUESTS){const p=PHOTOS[q.id];assert.ok(p);assert.ok(existsSync(new URL(p.src,root)));const bytes=readFileSync(new URL(p.src,root));assert.equal(bytes[0],0xff);assert.equal(bytes[1],0xd8);assert.match(p.sourceUrl,/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);assert.ok(p.author&&p.license&&p.licenseUrl&&p.photographedAt);assert.match(p.referenceNotice,/참고 사진/);}
});
test('all four avatars have 12 valid atlas cells without leaving their source image',()=>{
 assert.equal(WALK_ATLASES.length,4);
 for(const sheet of WALK_ATLASES){assert.ok(existsSync(new URL(sheet.src,root)));assert.equal(sheet.frames.length,12);for(const f of sheet.frames){const[x,y,w,h]=f;assert.ok(w>0&&h>0);assert.ok(x>=0&&y>=0&&x+w<=sheet.width&&y+h<=sheet.height)}}
});
test('different transparent margins never change the rendered ground baseline',()=>{
 for(const sheet of WALK_ATLASES)for(const frame of sheet.frames){const r=layoutFrame(frame);assert.ok(Math.abs(r.dy+r.dh-96)<1e-9);assert.ok(r.dx>=0);assert.ok(r.dx+r.dw<=80);}
});
